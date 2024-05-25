const { Repo } = require('../models')

class RepoController {
  async getAllRepo(req, res) {
    try {
      // req.ability.throwUnlessCan('read', await Repo.findByPk(req.params.id))
      const repos = await Repo.findAll()
      return res.status(200).end(JSON.stringify(repos, null, 4))
    } catch (err) {
      console.log(err)
      res
        .status(403)
        .send(
          'У вас недостаточно прав чтобы посмотреть все репозитории или время действия токена истекло.'
        )
    }
  }
  async getOneRepo(req, res) {
    try {
      req.ability.throwUnlessCan('read', await Repo.findByPk(req.params.id))
      const repos = await Repo.findByPk(req.params.id)
      if (repos) {
        if (repos.authorId == req.payload.id || req.payload.role == 'admin') {
          return res.status(200).end(JSON.stringify(repos, null, 4))
        } else {
          res
            .status(403)
            .send(
              'У вас недостаточно прав чтобы посмотреть информацию о репозитории или время действия токена истекло.'
            )
        }
      } else {
        return res.status(404).send('Репозиторий не найден.')
      }
    } catch (err) {
      console.log(err)
      res
        .status(403)
        .send(
          'У вас недостаточно прав чтобы посмотреть информацию о репозитории или время действия токена истекло.'
        )
    }
  }

  async createRepo(req, res) {
    try {
      req.ability.throwUnlessCan('create', 'Repo')
      console.log('body: ', req.body)
      const repoExists = await Repo.findOne({
        where: {
          name: req.body.name,
          authorId: req.payload.id,
        },
      })
      if (repoExists)
        return res.status(409).send('Репозиторий с таким именем не существует.')
      const repos = await Repo.create({
        name: req.body.name,
        authorId: req.payload.id,
      })
      return res.status(201).end(JSON.stringify(repos, null, 4))
    } catch (err) {
      console.log(err)
      res
        .status(403)
        .send(
          'У вас нет прав чтобы создать репозиторий или срок действия токена истёк.'
        )
    }
  }

  async updateRepo(req, res) {
    try {
      req.ability.throwUnlessCan('update', await Repo.findByPk(req.params.id))
      const repos = await Repo.findOne({
        where: { id: req.params.id },
      })
      const repoWithSameName = await Repo.findOne({
        where: { name: req.body.name },
      })

      if (repoWithSameName && repoWithSameName.id != req.params.id)
        return res.status(409).send('Репозиторий с таким именем не существует.')
      if (repos) {
        await Repo.update(
          { name: req.body.name },
          {
            where: { id: req.params.id },
          }
        )

        const repoUpdated = await Repo.findOne({
          where: { id: +req.params.id },
        })
        console.log(repoUpdated)
        console.log(+req.params.id)
        return res.status(200).end(JSON.stringify(repoUpdated, null, 4))
      } else res.status(404).send('Repo is not found.')
    } catch (err) {
      console.log(err)
      res
        .status(403)
        .send(
          'У вас нет прав чтобы обновить репозиторий или срок действия токена истёк.'
        )
    }
  }

  async deleteRepo(req, res) {
    try {
      req.ability.throwUnlessCan('manage', 'all')
      const repos = await Repo.findOne({
        where: {
          id: req.params.id,
        },
      })
      if (repos) {
        await Repo.destroy({
          where: {
            id: req.params.id,
          },
        })
        return res.status(200).end(JSON.stringify(repos, null, 4))
      } else res.status(404).send('Репозитория с таким id не существует.')
    } catch (err) {
      console.log(err)
      res
        .status(403)
        .send(
          'У вас нет прав чтобы удалить репозиторий или срок действия токена истёк.'
        )
    }
  }
}

module.exports = new RepoController()
