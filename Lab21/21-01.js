import express from 'express'
import fs from 'fs'
import * as webdav from 'webdav'

const app = express()

const client = webdav.createClient('https://webdav.yandex.ru', {
  username: 'dimaaqqw@yandex.ru',
  password: 'odlqfbsrsjqembob',
})

app.post('/md/:name', async (req, res) => {
  const nameFile = `/${req.params.name}`
  try {
    const exists = await client.exists(nameFile)
    if (!exists) {
      await client.createDirectory(nameFile)
      res.status(200).send('Папка успешно создана.')
    } else {
      res
        .status(408)
        .json(`Ошибка создания директории с именем = ${req.params.name}.`)
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Authorization Error: Invalid credentials')
      res
        .status(401)
        .json({ error: 'Unauthorized', message: 'Invalid credentials' })
    } else {
      console.error('Error:', error.message)
      res
        .status(500)
        .json({ error: 'Internal Server Error', message: error.message })
    }
  }
})

app.post('/rd/:name', (req, res) => {
  const nameFile = `/${req.params.name}`
  client.exists(nameFile).then((result) => {
    if (result) {
      client.deleteFile(nameFile)
      res.status(200).send('Папка успешно удалена.')
    } else
      res.status(404).json(`Такой папки не существует = ${req.params.name}.`)
  })
})

app.post('/up/:name', (req, res) => {
  try {
    const filePath = req.params.name

    if (!fs.existsSync(filePath)) {
      res.status(408).json(`Такого файла не существует = ${req.params.name}.`)
      return
    }

    let rs = fs.createReadStream(filePath)
    let ws = client.createWriteStream(req.params.name)
    rs.pipe(ws)
    res.status(200).send('Файл успешно записан.')
  } catch (err) {
    Error408(res, `Cannot upload file: ${err.message}.`)
  }
})

app.post('/down/:name', (req, res) => {
  const filePath = '/' + req.params.name
  client
    .exists(filePath)
    .then((alreadyExists) => {
      if (alreadyExists) {
        let rs = client.createReadStream(filePath)
        let ws = fs.createWriteStream(Date.now() + req.params.name)
        rs.pipe(ws)
        rs.pipe(res)
      } else
        res.status(404).json(`Такого файла не существует = ${req.params.name}.`)
    })
    .then((message) => (message ? res.json(message) : null))
    .catch((err) => {
      Error404(res, err.message)
    })
})

app.post('/del/:name', (req, res) => {
  const nameFile = req.params.name
  client.exists(nameFile).then((result) => {
    if (result) {
      client.deleteFile(nameFile)
      res.status(200).send('Файл успешно выгружен.')
    } else
      res.status(408).json(`Такого файла не существует = ${req.params.name}.`)
  })
})

app.post('/copy/:from/:to', (req, res) => {
  const nameFrom = req.params.from
  const nameTo = req.params.to
  client
    .exists(nameFrom)
    .then((result) => {
      if (result) {
        client.copyFile(nameFrom, nameTo)
        res.status(200).send('Файл успешно скопирован.')
      } else
        res.status(408).json(`Такого файла не существует = ${req.params.name}.`)
    })
    .catch((err) => Error408(res, err.message))
})

app.post('/move/:from/:to', (req, res) => {
  const nameFrom = req.params.from
  const nameTo = req.params.to
  client
    .exists(nameFrom)
    .then((result) => {
      if (result) {
        client.moveFile(nameFrom, nameTo)
        res.status(200).send('Файл успешно перемещён.')
      } else
        res.status(408).json(`Такого файла не существует = ${req.params.name}.`)
    })
    .catch((err) =>
      res.status(408).json(`Такого файла не существует = ${err.message}.`)
    )
})

app.listen(3000, () => {
  console.log(`http://localhost:3000/`)
})
