const express = require('express')
const app = express()
const passport = require('passport')
const DigestStrategy = require('passport-http').DigestStrategy
const { getCredential, verifyPassword } = require('./functions-01.js')
const session = require('express-session')({
  resave: false,
  saveUninitialized: false,
  secret: 'FUINR*hsrfhs98dsfhH9sH',
})
const PORT = 3002

app.use(session)
app.use(passport.initialize())

passport.use(
  new DigestStrategy(
    { qop: 'auth' },
    (user, done) => {
      let rc = null
      let cr = getCredential(user)
      if (!cr) {
        rc = done(null, false)
      } else {
        rc = done(null, cr.user, cr.password)
      }
      return rc
    },
    (params, done) => {
      console.log('params = ', params)
      done(null, true)
    }
  )
)

app.get(
  '/login',
  function (req, res, next) {
    console.log('preAuth')
    if (req.session.logout) {
      req.session.logout = false
      delete req.headers['authorization']
    }
    next()
  },
  passport.authenticate('digest', { session: false }),
  (req, res, next) => {
    res.redirect('/resource')
  }
)

app.get('/logout', (req, res) => {
  console.log('Logout')
  req.session.logout = true
  res.redirect('/login')
})

app.get(
  '/resource',
  passport.authenticate('digest', { session: false }),
  (req, res) => {
    res.send('RESOURCE')
  }
)

app.use((req, res) => {
  console.log('404 ERROR')
  res.status(404).send('404 ERROR')
})

app.listen(PORT, () => {
  console.log('http://localhost:3002/')
})
