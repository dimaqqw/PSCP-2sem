const express = require('express')
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
const session = require('express-session')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(
  session({
    secret: 'DDD',
    resave: false,
    saveUninitialized: false,
  })
)
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

app.get('/login', (req, res) => {
  res.send('<a href="/auth/github">Войти с помощью GitHub</a>')
})

app.get('/auth/github', passport.authenticate('github'))

app.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/resource')
  }
)

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err)
      return res.status(500).send('Internal Server Error')
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err)
        return res.status(500).send('Internal Server Error')
      }
      res.clearCookie('connect.sid', { path: '/' })
      res.redirect('/login')
    })
  })
})

app.get('/resource', isAuthenticated, (req, res) => {
  res.send(
    `RESOURCE\nAuthenticated User: ${req.user.username} (ID: ${req.user.id})`
  )
})

app.get('/', (req, res) => {
  res.redirect('/login')
})

app.use((req, res) => {
  res.status(404).send('Not Found')
})

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
