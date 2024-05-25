const http = require('http')
const url = require('url')
const fs = require('fs')
const { Sequelize, DataTypes } = require('sequelize')
const FACULTY = require('./models/FACULTY')
const { log } = require('console')
// const db = require('./models/')
const sequelize = new Sequelize('DDD', 'student', 'fitfit', {
  host: 'localhost',
  dialect: 'mssql',
})

const Faculty = require('./models/FACULTY')(sequelize, Sequelize)
const Pulpit = require('./models/PULPIT')(sequelize, Sequelize)
const Subject = require('./models/SUBJECT')(sequelize, Sequelize)
const Teacher = require('./models/TEACHER')(sequelize, Sequelize)
const AuditoriumTypes = require('./models/AUDITORIUM_TYPE')(
  sequelize,
  Sequelize
)
const Auditorium = require('./models/AUDITORIUM')(sequelize, Sequelize)

Faculty.hasMany(Pulpit, { foreignKey: 'FACULTY' })
Pulpit.belongsTo(Faculty, { foreignKey: 'FACULTY', as: 'faculty' })

Pulpit.hasMany(Subject, { foreignKey: 'PULPIT' })
Subject.belongsTo(Pulpit, { foreignKey: 'PULPIT', as: 'pulpit' })

async function testConnectionWithDB() {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
testConnectionWithDB()

http
  .createServer(async (req, res) => {
    await sequelize.sync()
    switch (req.method) {
      case 'GET': {
        if (req.url == '/') {
          fs.readFile('index.html', 'utf8', (err, data) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' })
              res.end('Internal Server Error')
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' })
              res.end(data)
            }
          })
        }
        if (req.url.startsWith('/api/faculties')) {
          const decoded = decodeURI(req.url)
          console.log(decoded)
          const urlParts = decoded.split('/')
          console.log(urlParts)
          if (urlParts[3] != undefined && urlParts[4] == 'subjects') {
            try {
              const code = urlParts[3]
              console.log(code)
              const faculties = await Faculty.findOne({
                where: { FACULTY: code },
                include: [
                  {
                    model: Pulpit,
                    include: [
                      {
                        model: Subject,
                      },
                    ],
                  },
                ],
              })
              if (faculties == null) {
                res.writeHead(200, {
                  'Content-Type': 'text/plain; charset=utf-8',
                })
                res.end('Ничего не найдено')
                break
              }
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify(faculties))
            } catch (error) {
              console.error(error)
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ message: 'Internal server error' }))
            }
          } else if (urlParts[2] == 'faculties' && urlParts[3] == undefined) {
            try {
              const faculties = await Faculty.findAll()
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify(faculties))
            } catch (error) {
              console.error(error)
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ message: 'Internal server error' }))
            }
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.end('Not Found')
          }
        }
        if (req.url === '/api/pulpits') {
          try {
            const pulpits = await Pulpit.findAll()
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(pulpits))
          } catch (error) {
            console.error(error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Internal server error' }))
          }
        }
        if (req.url === '/api/subjects') {
          try {
            const subjects = await Subject.findAll()
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(subjects))
          } catch (error) {
            console.error(error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Internal server error' }))
          }
        }
        if (req.url === '/api/teachers') {
          try {
            const teachers = await Teacher.findAll()
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(teachers))
          } catch (error) {
            console.error(error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Internal server error' }))
          }
        }
        if (req.url === '/api/auditoriumstypes') {
          try {
            const auditoriumstypes = await AuditoriumTypes.findAll()
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(auditoriumstypes))
          } catch (error) {
            console.error(error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Internal server error' }))
          }
        }
        if (req.url === '/api/auditoriums') {
          try {
            const auditoriums = await Auditorium.findAll()
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(auditoriums))
          } catch (error) {
            console.error(error)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Internal server error' }))
          }
        }
        break
      }
      case 'POST': {
        const decoded = decodeURI(req.url)
        const urlParts = decoded.split('/')
        if (urlParts[1] == 'api') {
          let data = ''
          let params
          req.on('data', (chunk) => {
            data += chunk
          })
          req.on('end', async () => {
            params = JSON.parse(data)

            switch (urlParts[2]) {
              case 'faculties': {
                try {
                  const result = await Faculty.create({
                    FACULTY: params[0].FACULTY,
                    FACULTY_NAME: params[0].FACULTY_NAME,
                  })
                  console.log(result)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                } catch (error) {
                  console.log(error)
                  res.statusCode = 404
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(error))
                }
                break
              }
              case 'pulpits': {
                try {
                  const result = await Pulpit.create({
                    PULPIT: params[0].PULPIT,
                    PULPIT_NAME: params[0].PULPIT_NAME,
                    FACULTY: params[0].FACULTY,
                  })
                  console.log(result)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                } catch (error) {
                  console.log(error)
                  res.statusCode = 404
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(error))
                }
                break
              }
              case 'subjects': {
                try {
                  const result = await Subject.create({
                    SUBJECT: params[0].SUBJECT,
                    SUBJECT_NAME: params[0].SUBJECT_NAME,
                    PULPIT: params[0].PULPIT,
                  })
                  console.log(result)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                } catch (error) {
                  console.log(error)
                  res.statusCode = 404
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(error))
                }
                break
              }
              case 'teachers': {
                try {
                  console.log(params)
                  const result = await Teacher.create({
                    TEACHER: params.TEACHER,
                    TEACHER_NAME: params.TEACHER_NAME,
                    PULPIT: params.PULPIT,
                  })
                  console.log(result)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                } catch (error) {
                  console.log(error)
                  res.statusCode = 404
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(error))
                }
                break
              }
              case 'auditoriumstypes': {
                try {
                  const result = await AuditoriumTypes.create({
                    AUDITORIUM_TYPE: params[0].AUDITORIUM_TYPE,
                    AUDITORIUM_TYPENAME: params[0].AUDITORIUM_TYPENAME,
                  })
                  console.log(result)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                } catch (error) {
                  console.log(error)
                  res.statusCode = 404
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(error))
                }
                break
              }
              case 'auditoriums': {
                try {
                  const result = await Auditorium.create({
                    AUDITORIUM: params[0].AUDITORIUM,
                    AUDITORIUM_NAME: params[0].AUDITORIUM_NAME,
                    AUDITORIUM_CAPACITY: params[0].AUDITORIUM_CAPACITY,
                    AUDITORIUM_TYPE: params[0].AUDITORIUM_TYPE,
                  })
                  console.log(result)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                } catch (error) {
                  console.log(error)
                  res.statusCode = 404
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(error))
                }
                break
              }
            }
          })
        }
        break
      }
      case 'PUT': {
        const decoded = decodeURI(req.url)
        const urlParts = decoded.split('/')
        if (urlParts[1] == 'api') {
          let data = ''
          let params
          req.on('data', (chunk) => {
            data += chunk
          })
          req.on('end', async () => {
            params = JSON.parse(data)

            switch (urlParts[2]) {
              case 'faculties': {
                console.log(params)
                console.log(params[0].FACULTY)
                console.log(params[0].FACULTY_NAME)
                try {
                  const result = await Faculty.update(
                    {
                      FACULTY: params[0].FACULTY,
                      FACULTY_NAME: params[0].FACULTY_NAME,
                    },
                    {
                      where: {
                        FACULTY: params[1].FACULTY,
                        FACULTY_NAME: params[1].FACULTY_NAME,
                      },
                    }
                  )
                  console.log(result)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                } catch (error) {
                  console.log(error)
                  res.statusCode = 404
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(error))
                }
                break
              }
              case 'pulpits': {
                console.log(params)
                console.log(params[0].PULPIT)
                console.log(params[0].PULPIT_NAME)
                console.log(params[0].FACULTY)
                try {
                  const result = await Pulpit.update(
                    {
                      PULPIT: params[0].PULPIT,
                      PULPIT_NAME: params[0].PULPIT_NAME,
                      FACULTY: params[0].FACULTY,
                    },
                    {
                      where: {
                        PULPIT: params[1].PULPIT,
                        PULPIT_NAME: params[1].PULPIT_NAME,
                        FACULTY: params[1].FACULTY,
                      },
                    }
                  )
                  console.log(result)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                } catch (error) {
                  console.log(error)
                  res.statusCode = 404
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(error))
                }
                break
              }
              case 'subjects': {
                console.log(params)
                console.log(params[0].SUBJECT)
                console.log(params[0].SUBJECT_NAME)
                console.log(params[0].PULPIT)
                try {
                  const result = await Subject.update(
                    {
                      SUBJECT: params[0].SUBJECT,
                      SUBJECT_NAME: params[0].SUBJECT_NAME,
                      PULPIT: params[0].PULPIT,
                    },
                    {
                      where: {
                        SUBJECT: params[1].SUBJECT,
                        SUBJECT_NAME: params[1].SUBJECT_NAME,
                        PULPIT: params[1].PULPIT,
                      },
                    }
                  )
                  console.log(result)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                } catch (error) {
                  console.log(error)
                  res.statusCode = 404
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(error))
                }
                break
              }
              case 'teachers': {
                console.log(params)
                console.log(params[0].TEACHER)
                console.log(params[0].TEACHER_NAME)
                console.log(params[0].PULPIT)
                try {
                  const result = await Teacher.update(
                    {
                      TEACHER: params[0].TEACHER,
                      TEACHER_NAME: params[0].TEACHER_NAME,
                      PULPIT: params[0].PULPIT,
                    },
                    {
                      where: {
                        TEACHER: params[1].TEACHER,
                        TEACHER_NAME: params[1].TEACHER_NAME,
                        PULPIT: params[1].PULPIT,
                      },
                    }
                  )
                  console.log(result)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                } catch (error) {
                  console.log(error)
                  res.statusCode = 404
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(error))
                }
                break
              }
              case 'auditoriumstypes': {
                console.log(params)
                console.log(params[0].AUDITORIUM_TYPE)
                console.log(params[0].AUDITORIUM_TYPENAME)
                try {
                  const result = await AuditoriumTypes.update(
                    {
                      AUDITORIUM_TYPE: params[0].AUDITORIUM_TYPE,
                      AUDITORIUM_TYPENAME: params[0].AUDITORIUM_TYPENAME,
                    },
                    {
                      where: {
                        AUDITORIUM_TYPE: params[1].AUDITORIUM_TYPE,
                        AUDITORIUM_TYPENAME: params[1].AUDITORIUM_TYPENAME,
                      },
                    }
                  )
                  console.log(result)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                } catch (error) {
                  console.log(error)
                  res.statusCode = 404
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(error))
                }
                break
              }
              case 'auditoriums': {
                console.log(params)
                console.log(params[0].AUDITORIUM)
                console.log(params[0].AUDITORIUM_NAME)
                console.log(params[0].AUDITORIUM_CAPACITY)
                console.log(params[0].AUDITORIUM_TYPE)
                try {
                  const result = await Auditorium.update(
                    {
                      AUDITORIUM: params[0].AUDITORIUM,
                      AUDITORIUM_NAME: params[0].AUDITORIUM_NAME,
                      AUDITORIUM_CAPACITY: params[0].AUDITORIUM_CAPACITY,
                      AUDITORIUM_TYPE: params[0].AUDITORIUM_TYPE,
                    },
                    {
                      where: {
                        AUDITORIUM: params[1].AUDITORIUM,
                        AUDITORIUM_NAME: params[1].AUDITORIUM_NAME,
                        AUDITORIUM_CAPACITY: params[1].AUDITORIUM_CAPACITY,
                        AUDITORIUM_TYPE: params[1].AUDITORIUM_TYPE,
                      },
                    }
                  )
                  console.log(result)
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(data))
                } catch (error) {
                  console.log(error)
                  res.statusCode = 404
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(error))
                }
                break
              }
            }
          })
        }
        break
      }
      case 'DELETE': {
        const decoded = decodeURI(req.url)
        const urlParts = decoded.split('/')
        if (urlParts[1] == 'api' && urlParts[3] != undefined) {
          const params = urlParts[3]
          switch (urlParts[2]) {
            case 'faculties': {
              try {
                const result = await Faculty.destroy({
                  where: {
                    FACULTY: params,
                  },
                })
                console.log(result)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              } catch (error) {
                console.log(error)
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(error))
              }
              break
            }
            case 'pulpits': {
              try {
                const result = await Pulpit.destroy({
                  where: {
                    PULPIT: params,
                  },
                })
                console.log(result)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              } catch (error) {
                console.log(error)
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(error))
              }
              break
            }
            case 'subjects': {
              try {
                const result = await Subject.destroy({
                  where: {
                    SUBJECT: params,
                  },
                })
                console.log(result)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              } catch (error) {
                console.log(error)
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(error))
              }
              break
            }
            case 'teachers': {
              try {
                const result = await Teacher.destroy({
                  where: {
                    TEACHER: params,
                  },
                })
                console.log(result)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end('Succes')
              } catch (error) {
                console.log(error)
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(error))
              }
              break
            }
            case 'auditoriumstypes': {
              try {
                const result = await AuditoriumTypes.destroy({
                  where: {
                    AUDITORIUM_TYPE: params,
                  },
                })
                console.log(result)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              } catch (error) {
                console.log(error)
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(error))
              }
              break
            }
            case 'auditoriums': {
              try {
                const result = await Auditorium.destroy({
                  where: {
                    AUDITORIUM: params,
                  },
                })
                console.log(result)
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              } catch (error) {
                console.log(error)
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(error))
              }
              break
            }
          }
        } else {
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(error))
        }
        break
      }
    }

    // if (req.url === '/' && req.method === 'GET') {
    //   fs.readFile('index.html', 'utf8', (err, data) => {
    //     if (err) {
    //       res.writeHead(500, { 'Content-Type': 'text/plain' })
    //       res.end('Internal Server Error')
    //     } else {
    //       res.writeHead(200, { 'Content-Type': 'text/html' })
    //       res.end(data)
    //     }
    //   })
    // } else {
    //   res.writeHead(404, { 'Content-Type': 'text/plain' })
    //   res.end('Not Found')
    // }
  })
  .listen(3000, () => {
    console.log('http://localhost:3000/')
  })
