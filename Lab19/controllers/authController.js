const { User } = require('../models')
const jwt = require('jsonwebtoken')

class AuthController {
  getLoginPage(req, res) {
    res.send(`
          <form method="post" action="/login">
              <input type="text" name="username" placeholder="Имя пользователя" required />
              <input type="password" name="password" placeholder="Пароль" required />
              <button type="submit">Войти</button>
          </form>
      `)
  }

  getRegisterPage(req, res) {
    res.send(`
          <form method="post" action="/register">
              <input type="text" name="username" placeholder="Имя пользователя" required />
              <input type="password" name="password" placeholder="Пароль" required />
              <input type="email" name="email" placeholder="E-Mail" required />
              <select name="role">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="guest">Guest</option>
                </select>
              <button type="submit">Зарегистрироваться</button>
          </form>
      `)
  }

  getResourcePage(req, res) {
    if (req.payload && req.payload.id !== 0) {
      res
        .status(200)
        .send(
          `<h2>Welcome to the resource, ${req.payload.username}!</h2>` +
            `<h3>Your id: ${req.payload.id}</h3>` +
            `<h3>Your role: ${req.payload.role}</h3>` +
            `<a href="http://localhost:3000/logout">Log Out</a>`
        )
    } else {
      res.status(401).send('Unauthorized')
    }
  }

  refreshToken(req, res) {
    if (req.cookies.refreshToken) {
      jwt.verify(
        req.cookies.refreshToken,
        process.env.JWT_REFRESH_SECRET,
        async (err, payload) => {
          if (err) console.log(err.message)
          else if (payload) {
            const candidate = await User.findOne({
              where: {
                id: payload.id,
              },
            })

            const newAccessToken = jwt.sign(
              {
                id: candidate.id,
                username: candidate.username,
                role: candidate.role,
              },
              process.env.JWT_ACCESS_SECRET,
              { expiresIn: 6 * 60 * 60 }
            )
            const newRefreshToken = jwt.sign(
              {
                id: candidate.id,
                username: candidate.username,
                role: candidate.role,
              },
              JWT_REFRESH_SECRET,
              { expiresIn: 24 * 60 * 60 }
            )
            res.cookie('accessToken', newAccessToken, {
              httpOnly: true,
              sameSite: 'strict',
            })
            res.cookie('refreshToken', newRefreshToken, {
              path: '/refresh-token',
            })
            res.redirect('/resource')
          }
        }
      )
    } else res.status(401).send('Unauthorized')
  }

  logout(req, res) {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.redirect('/login')
  }

  async login(req, res) {
    try {
      const candidate = await User.findOne({
        where: {
          username: req.body.username,
          password: req.body.password,
        },
      })

      if (candidate) {
        const accessToken = jwt.sign(
          {
            id: candidate.id,
            username: candidate.username,
            role: candidate.role,
          },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: 6 * 60 * 60 }
        )

        const refreshToken = jwt.sign(
          {
            id: candidate.id,
            username: candidate.username,
            role: candidate.role,
          },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: 24 * 60 * 60 }
        )

        // Set cookies
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          sameSite: 'strict',
        })

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
        })

        // Redirect the user
        return res.redirect('/api/ability')
      } else {
        // Redirect the user if login credentials are invalid
        return res.redirect('/login')
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // Handle token expiration
        return res.redirect('/login?expired=true')
      } else {
        // Handle other errors
        console.error('Error during login:', error)
        return res.status(500).send('Internal Server Error')
      }
    }
  }

  async register(req, res) {
    try {
      const candidate = await User.findOne({
        where: {
          username: req.body.username,
        },
      })

      if (candidate) {
        res.redirect('/register')
      } else {
        console.log('ROLE: ', req.body.role)
        const user = await User.create({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
        })

        const accessToken = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role,
          },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: '6h' } // Token expires in 6 hours
        )

        const refreshToken = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role,
          },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: '24h' } // Refresh token expires in 24 hours
        )

        // Set cookies only if headers have not been sent
        if (!res.headersSent) {
          res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
          })

          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
          })

          res.redirect('/login')
        }
      }
    } catch (error) {
      console.error('Error registering user:', error)
      res.status(500).send('Internal Server Error')
    }
  }
}

module.exports = new AuthController()
