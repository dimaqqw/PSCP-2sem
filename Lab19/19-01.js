require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { sequelize } = require('./models')
const { AbilityBuilder, Ability } = require('casl')
const authRouter = require('./routes/authRouter')
const apiRouter = require('./routes/index')

const app = express()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log('accessToken:', req.cookies.accessToken)
  const { rules, can, cannot } = AbilityBuilder.extract()
  can('read', ['Repo', 'Commits'])
  if (req.cookies.accessToken) {
    jwt.verify(
      req.cookies.accessToken,
      process.env.JWT_ACCESS_SECRET,
      (err, payload) => {
        if (err) {
          console.log('err', err)
          next()
        } else if (payload) {
          req.payload = payload
          console.log('payload:', req.payload, '\n')

          switch (req.payload.role) {
            case 'admin':
              can('manage', 'all')
              cannot('create', 'all')
              break

            case 'user':
              can(['create', 'update'], ['Repo', 'Commits'], {
                authorId: parseInt(req.payload.id),
              })
              can('read', ['Repo', 'Commits'])
              can('read', 'users', {
                id: parseInt(req.payload.id),
              })
              break

            case 'guest':
              can(['read'], ['Repo', 'Commits'], {
                authorId: req.payload.id,
              })
              can('read', 'User', { id: req.payload.id })
              break
          }
        }
      }
    )
  } else {
    req.payload = { id: 0 }
    can('read', ['Repo', 'Commit'], 'all')
  }
  req.ability = new Ability(rules)
  next()
})

app.use('/', authRouter)
app.use('/api', apiRouter)

app.use((req, res, next) => {
  res.status(404).send('<i>Incorrect URI or method</i>')
})

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`http://localhost:${process.env.PORT || 3000}`)
  })
})
