const express = require('express')
const app = express()
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const { getCredential, verifyPassword } = require('./functions-01.js')
const session = require('express-session')({
  resave: false,
  saveUninitialized: false,
  secret: 'FUINR*hsrfhs98dsfhH9sH',
})
const PORT = 3001

app.use(session)
app.use(passport.initialize())

passport.use(
  new BasicStrategy((user, password, done) => {
    console.log('passport.use', user, password)
    let rc = null
    let cr = getCredential(user)
    if (!cr) {
      rc = done(null, false, { message: 'Incorrect username' })
    } else if (!verifyPassword(cr.password, password)) {
      rc = done(null, false, { message: 'Incorrect password' })
    } else {
      rc = done(null, user)
    }
    return rc
  })
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
  passport.authenticate('basic', { session: false }),
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
  passport.authenticate('basic', { session: false }),
  (req, res) => {
    res.send('RESOURCE')
  }
)

app.use((req, res) => {
  console.log('404 ERROR')
  res.status(404).send('404 ERROR')
})

app.listen(PORT, () => {
  console.log('http://localhost:3001/')
})
