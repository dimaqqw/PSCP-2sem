const { PrismaClient } = require('@prisma/client')
const express = require('express')
const fs = require('fs')

const PORT = process.env.PORT

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})

const app = express()
app.use(express.json())

app.get('/', async (req, res) => {
  try {
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Internal Server Error')
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(data)
      }
    })
  } catch (error) {
    console.error(e)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})

app
  .route('/api/faculties')
  .get(async (req, res) => {
    try {
      const faculties = await prisma.fACULTY.findMany()
      res.json(faculties)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })
  .post(async (req, res) => {
    try {
      const { FACULTY, FACULTY_NAME } = req.body
      const faculty = await prisma.fACULTY.create({
        data: {
          FACULTY,
          FACULTY_NAME,
        },
      })
      res.json(faculty)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })
  .put(async (req, res) => {
    try {
      const OLD_FACULTY_FACULTY = req.body[0].FACULTY
      const OLD_FACULTY_FACULTY_NAME = req.body[0].FACULTY_NAME
      const NEW_FACULTY_FAСUCLY = req.body[1].FACULTY
      const NEW_FACULTY_FAСUCLY_NAME = req.body[1].FACULTY_NAME

      const faculty = await prisma.fACULTY.update({
        where: {
          FACULTY: OLD_FACULTY_FACULTY,
          FACULTY_NAME: OLD_FACULTY_FACULTY_NAME,
        },
        data: {
          FACULTY: NEW_FACULTY_FAСUCLY,
          FACULTY_NAME: NEW_FACULTY_FAСUCLY_NAME,
        },
      })

      res.json(faculty)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })

app
  .route('/api/pulpits')
  .get(async (req, res) => {
    try {
      const pulpits = await prisma.pULPIT.findMany()
      res.json(pulpits)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })
  .post(async (req, res) => {
    try {
      const { PULPIT, PULPIT_NAME, FACULTY } = req.body
      const pulpit = await prisma.pULPIT.create({
        data: {
          PULPIT,
          PULPIT_NAME,
          FACULTY,
        },
      })
      res.json(pulpit)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })
  .put(async (req, res) => {
    try {
      const OLD_PULPIT_PULPIT = req.body[0].PULPIT
      const OLD_PULPIT_PULPIT_NAME = req.body[0].PULPIT_NAME
      const OLD_PULPIT_FACULTY = req.body[0].FACULTY
      const NEW_PULPIT_PULPIT = req.body[1].PULPIT
      const NEW_PULPIT_PULPIT_NAME = req.body[1].PULPIT_NAME
      const NEW_PULPIT_FACULTY = req.body[1].FACULTY

      const pulpit = await prisma.pULPIT.update({
        where: {
          PULPIT: OLD_PULPIT_PULPIT,
          PULPIT_NAME: OLD_PULPIT_PULPIT_NAME,
          FACULTY: OLD_PULPIT_FACULTY,
        },
        data: {
          PULPIT: NEW_PULPIT_PULPIT,
          PULPIT_NAME: NEW_PULPIT_PULPIT_NAME,
          FACULTY: NEW_PULPIT_FACULTY,
        },
      })
      res.json(pulpit)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })

app
  .route('/api/subjects')
  .get(async (req, res) => {
    try {
      const subjects = await prisma.sUBJECT.findMany()
      res.json(subjects)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })
  .post(async (req, res) => {
    try {
      const { SUBJECT, SUBJECT_NAME, PULPIT } = req.body
      const subject = await prisma.sUBJECT.create({
        data: {
          SUBJECT,
          SUBJECT_NAME,
          PULPIT,
        },
      })
      res.json(subject)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })
  .put(async (req, res) => {
    try {
      const OLD_SUBJECT_SUBJECT = req.body[0].SUBJECT
      const OLD_SUBJECT_SUBJECT_NAME = req.body[0].SUBJECT_NAME
      const OLD_SUBJECT_PULPIT = req.body[0].PULPIT
      const NEW_SUBJECT_SUBJECT = req.body[1].SUBJECT
      const NEW_SUBJECT_SUBJECT_NAME = req.body[1].SUBJECT_NAME
      const NEW_SUBJECT_PULPIT = req.body[1].PULPIT

      const subject = await prisma.sUBJECT.update({
        where: {
          SUBJECT: OLD_SUBJECT_SUBJECT,
          SUBJECT_NAME: OLD_SUBJECT_SUBJECT_NAME,
          PULPIT: OLD_SUBJECT_PULPIT,
        },
        data: {
          SUBJECT: NEW_SUBJECT_SUBJECT,
          SUBJECT_NAME: NEW_SUBJECT_SUBJECT_NAME,
          PULPIT: NEW_SUBJECT_PULPIT,
        },
      })
      res.json(subject)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })

app
  .route('/api/teachers')
  .get(async (req, res) => {
    try {
      const teachers = await prisma.tEACHER.findMany()
      res.json(teachers)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })
  .post(async (req, res) => {
    try {
      const { TEACHER, TEACHER_NAME, PULPIT } = req.body
      const teacher = await prisma.sUBJECT.create({
        data: {
          TEACHER,
          TEACHER_NAME,
          PULPIT,
        },
      })
      res.json(teacher)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })
  .put(async (req, res) => {
    try {
      const OLD_TEACHER_TEACHER = req.body[0].TEACHER
      const OLD_TEACHER_TEACHER_NAME = req.body[0].TEACHER_NAME
      const OLD_TEACHER_PULPIT = req.body[0].PULPIT
      const NEW_TEACHER_TEACHER = req.body[1].TEACHER
      const NEW_TEACHER_TEACHER_NAME = req.body[1].TEACHER_NAME
      const NEW_TEACHER_PULPIT = req.body[1].PULPIT

      const teacher = await prisma.sUBJECT.update({
        where: {
          TEACHER: OLD_TEACHER_TEACHER,
          TEACHER_NAME: OLD_TEACHER_TEACHER_NAME,
          PULPIT: OLD_TEACHER_PULPIT,
        },
        data: {
          TEACHER: NEW_TEACHER_TEACHER,
          TEACHER_NAME: NEW_TEACHER_TEACHER_NAME,
          PULPIT: NEW_TEACHER_PULPIT,
        },
      })
      res.json(teacher)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })

app
  .route('/api/auditoriumstypes')
  .get(async (req, res) => {
    try {
      const auditoriumstypes = await prisma.aUDITORIUM_TYPE.findMany()
      res.json(auditoriumstypes)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })
  .post(async (req, res) => {
    try {
      const { AUDITORIUM_TYPE, AUDITORIUM_TYPENAME } = req.body
      const auditoriumstype = await prisma.aUDITORIUM_TYPE.create({
        data: {
          AUDITORIUM_TYPE,
          AUDITORIUM_TYPENAME,
        },
      })
      res.json(auditoriumstype)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })
  .put(async (req, res) => {
    try {
      const OLD_AUDITORIUM_TYPE = req.body[0].AUDITORIUM_TYPE
      const OLD_AUDITORIUM_TYPENAME = req.body[0].AUDITORIUM_TYPENAME
      const NEW_AUDITORIUM_TYPE = req.body[1].AUDITORIUM_TYPE
      const NEW_AUDITORIUM_TYPENAME = req.body[1].AUDITORIUM_TYPENAME

      const auditoriumstype = await prisma.aUDITORIUM_TYPE.update({
        where: {
          AUDITORIUM_TYPE: OLD_AUDITORIUM_TYPE,
          AUDITORIUM_TYPENAME: OLD_AUDITORIUM_TYPENAME,
        },
        data: {
          AUDITORIUM_TYPE: NEW_AUDITORIUM_TYPE,
          AUDITORIUM_TYPENAME: NEW_AUDITORIUM_TYPENAME,
        },
      })
      res.json(auditoriumstype)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })

app
  .route('/api/auditoriums')
  .get(async (req, res) => {
    try {
      const auditoriums = await prisma.aUDITORIUM.findMany()
      res.json(auditoriums)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })
  .post(async (req, res) => {
    try {
      const {
        AUDITORIUM,
        AUDITORIUM_NAME,
        AUDITORIUM_CAPACITY,
        AUDITORIUM_TYPE,
      } = req.body
      const auditorium = await prisma.aUDITORIUM.create({
        data: {
          AUDITORIUM,
          AUDITORIUM_NAME,
          AUDITORIUM_CAPACITY,
          AUDITORIUM_TYPE,
        },
      })
      res.json(auditorium)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })
  .put(async (req, res) => {
    try {
      const OLD_AUDITORIUM = req.body[0].AUDITORIUM
      const OLD_AUDITORIUM_NAME = req.body[0].AUDITORIUM_NAME
      const OLD_AUDITORIUM_CAPACITY = req.body[0].AUDITORIUM_CAPACITY
      const OLD_AUDITORIUM_TYPE = req.body[0].AUDITORIUM_TYPE
      const NEW_AUDITORIUM = req.body[1].AUDITORIUM
      const NEW_AUDITORIUM_NAME = req.body[1].AUDITORIUM_NAME
      const NEW_AUDITORIUM_CAPACITY = req.body[1].AUDITORIUM_CAPACITY
      const NEW_AUDITORIUM_TYPE = req.body[1].AUDITORIUM_TYPE

      const auditorium = await prisma.aUDITORIUM.update({
        where: {
          AUDITORIUM: OLD_AUDITORIUM,
          AUDITORIUM_NAME: OLD_AUDITORIUM_NAME,
          AUDITORIUM_CAPACITY: OLD_AUDITORIUM_CAPACITY,
          AUDITORIUM_TYPE: OLD_AUDITORIUM_TYPE,
        },
        data: {
          AUDITORIUM: NEW_AUDITORIUM,
          AUDITORIUM_NAME: NEW_AUDITORIUM_NAME,
          AUDITORIUM_CAPACITY: NEW_AUDITORIUM_CAPACITY,
          AUDITORIUM_TYPE: NEW_AUDITORIUM_TYPE,
        },
      })
      res.json(auditoriumstype)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Something goes wrong...' })
    }
  })

// Делиты
app.delete('/api/faculties/:id', async (req, res) => {
  try {
    const param = req.params['id']
    const obj = await prisma.fACULTY.delete({
      where: {
        FACULTY: param,
      },
    })
    res.json(obj)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})
app.delete('/api/pulpits/:id', async (req, res) => {
  try {
    const param = req.params['id']
    const obj = await prisma.pULPIT.delete({
      where: {
        PULPIT: param,
      },
    })
    res.json(obj)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})
app.delete('/api/subjects/:id', async (req, res) => {
  try {
    const param = req.params['id']
    const obj = await prisma.sUBJECT.delete({
      where: {
        SUBJECT: param,
      },
    })
    res.json(obj)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})
app.delete('/api/teachers/:id', async (req, res) => {
  try {
    const param = req.params['id']
    const obj = await prisma.tEACHER.delete({
      where: {
        TEACHER: param,
      },
    })
    res.json(obj)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})
app.delete('/api/auditoriumtypes/:id', async (req, res) => {
  try {
    const param = req.params['id']
    const obj = await prisma.aUDITORIUM_TYPE.delete({
      where: {
        AUDITORIUM_TYPE: param,
      },
    })
    res.json(obj)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})
app.delete('/api/auditoriums/:id', async (req, res) => {
  try {
    const param = req.params['id']
    const obj = await prisma.aUDITORIUM.delete({
      where: {
        AUDITORIUM: param,
      },
    })
    res.json(obj)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})

// Особые запросы
app.get('/api/faculties/:id/subjects', async (req, res) => {
  try {
    const param = req.params[['id']]
    const faculty = await prisma.fACULTY.findMany({
      where: {
        FACULTY: param,
      },
      select: {
        FACULTY: true,
        PULPIT_PULPIT_FACULTYToFACULTY: {
          select: {
            PULPIT: true,
            SUBJECT_SUBJECT_PULPITToPULPIT: {
              select: {
                SUBJECT: true,
                SUBJECT_NAME: true,
              },
            },
          },
        },
      },
    })
    res.json(faculty)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})
app.get('/api/auditoriumtypes/:id/auditoriums', async (req, res) => {
  try {
    const param = req.params[['id']]
    const auditoriumstype = await prisma.aUDITORIUM_TYPE.findMany({
      where: {
        AUDITORIUM_TYPE: param,
      },
      select: {
        AUDITORIUM_TYPE: true,
        AUDITORIUM_AUDITORIUM_AUDITORIUM_TYPEToAUDITORIUM_TYPE: {
          select: {
            AUDITORIUM: true,
          },
        },
      },
    })
    res.json(auditoriumstype)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})
app.get('/api/auditoriumsWithComp1', async (req, res) => {
  try {
    const result = await prisma.aUDITORIUM.findMany({
      where: {
        AUDITORIUM_TYPE: 'ЛБ-К',
        AUDITORIUM: {
          endsWith: '1',
        },
      },
    })
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})
app.get('/api/puplitsWithoutTeachers', async (req, res) => {
  try {
    const result = await prisma.pULPIT.findMany({
      where: {
        TEACHER_TEACHER_PULPITToPULPIT: {
          none: {},
        },
      },
    })
    res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})
app.get('/api/pulpitsWithVladimir', async (req, res) => {
  try {
    const obj = await prisma.pULPIT.findMany({
      where: {
        TEACHER_TEACHER_PULPITToPULPIT: {
          some: {
            TEACHER_NAME: {
              contains: 'Владимир',
            },
          },
        },
      },
    })
    res.json(obj)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})
app.get('/api/auditoriumsSameCount', async (req, res) => {
  try {
    const obj = await prisma.aUDITORIUM.groupBy({
      by: ['AUDITORIUM_TYPE', 'AUDITORIUM_CAPACITY'],
      _count: true,
    })
    res.json(obj)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})
app.get('/api/htmlapi', async (req, res) => {
  try {
    const obj = await prisma.pULPIT.findMany({
      include: {
        _count: {
          select: {
            TEACHER_TEACHER_PULPITToPULPIT: true,
          },
        },
      },
    })
    res.json(obj)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
  x
})
// Транзакция
app.get('/api/transaction', async (req, res) => {
  prisma.$transaction(async (prisma) => {
    try {
      prisma.aUDITORIUM.updateMany({
        data: {
          AUDITORIUM_CAPACITY: {
            increment: 100,
          },
        },
      })
      console.log(prisma.aUDITORIUM.findMany())
      throw new Error('Rollback')
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Transaction rollback' })
    }
  })
})

// Fluent API
app.get('/api/fluentapi', async (req, res) => {
  try {
    const obj = await prisma.fACULTY
      .findUnique({ where: { FACULTY: 'ИЭФ' } })
      .PULPIT_PULPIT_FACULTYToFACULTY()
    res.json(obj)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something goes wrong...' })
  }
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`)
})
