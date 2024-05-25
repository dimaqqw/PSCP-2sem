const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Sequelize, DataTypes } = require('sequelize')
const redis = require('redis')
const cookieParser = require('cookie-parser')

const app = express()
const PORT = 3000

const sequelize = new Sequelize('Lab17PSCP', 'student', 'fitfit', {
  host: 'localhost',
  dialect: 'mssql',
})

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

const client = redis.createClient()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const authenticateToken = (req, res, next) => {
  const token = req.cookies['access-token']
  if (!token)
    return res.status(401).json({ message: 'Неаутентифицированный доступ' })

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Неверный токен' })
    req.user = user
    next()
  })
}

app.get('/login', (req, res) => {
  res.send(`
        <form method="post" action="/login">
            <input type="text" name="username" placeholder="Имя пользователя" required />
            <input type="password" name="password" placeholder="Пароль" required />
            <button type="submit">Войти</button>
        </form>
    `)
})

app.get('/register', (req, res) => {
  res.send(`
        <form method="post" action="/register">
            <input type="text" name="username" placeholder="Имя пользователя" required />
            <input type="password" name="password" placeholder="Пароль" required />
            <button type="submit">Зарегистрироваться</button>
        </form>
    `)
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  const hashedPassword = bcrypt.hashSync(password, 10)

  try {
    await User.create({ username, password: hashedPassword })
    res.redirect('/login')
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при регистрации' })
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ where: { username } })
  if (user && bcrypt.compareSync(password, user.password)) {
    const accessToken = jwt.sign({ username: user.username }, 'secretKey', {
      expiresIn: '10m',
    })
    const refreshToken = jwt.sign(
      { username: user.username },
      'refreshSecretKey',
      { expiresIn: '24h' }
    )

    client.set(refreshToken, user.username)

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    })
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/refresh-token',
    })

    res.redirect('/resource')
  } else {
    res.redirect('/login')
  }
})

app.get('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies['refresh-token']
  if (!refreshToken)
    return res.status(401).json({ message: 'Токен отсутствует' })

  jwt.verify(refreshToken, 'refreshSecretKey', async (err, user) => {
    if (err) return res.status(401).json({ message: 'Неверный токен' })

    const accessToken = jwt.sign({ username: user.username }, 'secretKey', {
      expiresIn: '10m',
    })
    const newRefreshToken = jwt.sign(
      { username: user.username },
      'refreshSecretKey',
      { expiresIn: '24h' }
    )

    client.set(newRefreshToken, user.username)
    client.set(`blacklist-${refreshToken}`, user.username)

    res.cookie('access-token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    })
    res.cookie('refresh-token', newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/refresh-token',
    })

    res.json({ accessToken, refreshToken: newRefreshToken })
  })
})

app.get('/logout', (req, res) => {
  // const refreshToken = req.cookies['refresh-token']
  // if (refreshToken) {
  //   client.set(`blacklist-${refreshToken}`, req.user.username)
  // }
  res.clearCookie('access-token')
  res.clearCookie('refresh-token')
  res.redirect('/login')
})

app.get('/resource', authenticateToken, (req, res) => {
  res.send(`RESOURCE. Аутентифицированный пользователь: ${req.user.username}`)
})

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    client.connect()
    client.on('connect', () => {
      console.log('Redis ok')
    })
    console.log(`http://localhost:${PORT}`)
  })
})
