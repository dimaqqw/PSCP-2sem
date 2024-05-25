const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

const users = require('./users.json')

passport.use(
  new LocalStrategy(function (username, password, done) {
    const user = users.find(
      (u) => u.username === username && u.password === password
    )
    if (user) {
      return done(null, user)
    } else {
      return done(null, false, {
        message: 'Неверное имя пользователя или пароль.',
      })
    }
  })
)

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  const user = users.find((u) => u.id === id)
  done(null, user)
})

app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="post">
      <div>
        <label>Имя пользователя:</label>
        <input type="text" name="username" required>
      </div>
      <div>
        <label>Пароль:</label>
        <input type="password" name="password" required>
      </div>
      <div>
        <button type="submit">Войти</button>
      </div>
    </form>
  `)
})

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/resource',
    failureRedirect: '/login',
  })
)

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login')
  })
})

app.get('/resource', isAuthenticated, (req, res) => {
  console.log(req.user)
  console.log(req.session)
  res.send(`RESOURCE\nПользователь: ${req.user.username}`)
})

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).send('Неаутентифицированный доступ.')
}

app.use((req, res) => {
  res.status(404).send('Not Found')
})

app.listen(3000, () => {
  console.log('http://localhost:3000/')
})
