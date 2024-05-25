const { Repo, Commit } = require('../models')

class CommitsController {
  async getAllCommitsByRepo(req, res) {
    try {
      req.ability.throwUnlessCan('read', 'Commit')
      const commits = await Commit.findAll({
        include: [
          {
            model: Repo,
            required: true,
            where: {
              id: req.params.id,
            },
            attributes: [],
          },
        ],
      })
      return res.status(200).end(JSON.stringify(commits, null, 4))
    } catch (err) {
      console.log(err)
      res
        .status(403)
        .send(
          'У вас недостаточно прав чтобы посмотреть информацию о репозитории или время действия токена истекло.'
        )
    }
  }

  async getOneCommitByRepo(req, res) {
    try {
      req.ability.throwUnlessCan('read', 'Commit')
      const commit = await Commit.findOne({
        where: {
          id: req.params.commitId,
        },
        include: [
          {
            model: Repo,
            required: true,
            where: {
              id: req.params.id,
            },
            attributes: [],
          },
        ],
      })
      if (commit) return res.status(200).end(JSON.stringify(commit, null, 4))
      else return res.status(404).send('Комита с таким id не существует')
    } catch (err) {
      console.log(err)
      res
        .status(403)
        .send(
          'У вас недостаточно прав чтобы посмотреть информацию о репозитории или время действия токена истекло.'
        )
    }
  }

  async createCommitByRepo(req, res) {
    try {
      req.ability.throwUnlessCan('create', await Repo.findByPk(req.params.id))
      const commit = await Commit.create({
        message: req.body.message,
        repoId: req.params.id,
      })
      return res.status(201).end(JSON.stringify(commit, null, 4))
    } catch (err) {
      console.log(err)
      res
        .status(403)
        .send(
          'У вас недостаточно прав чтобы создать коммит или время действия токена истекло.'
        )
    }
  }

  async updateCommitByRepo(req, res) {
    try {
      req.ability.throwUnlessCan('update', 'Repo')
      await Commit.update(
        {
          message: req.body.message,
        },
        {
          where: {
            id: req.params.commitId,
          },
          include: [
            {
              model: Repo,
              required: true,
              where: {
                id: req.params.id,
              },
              attributes: [],
            },
          ],
        }
      )

      const commit = await Commit.findOne({
        where: { id: req.params.commitId },
      })
      return res.status(200).end(JSON.stringify(commit, null, 4))
    } catch (err) {
      console.log(err)
      res
        .status(403)
        .send(
          'У вас недостаточно прав чтобы посмотреть информацию о репозитории или время действия токена истекло.'
        )
    }
  }

  async deleteCommitByRepo(req, res) {
    try {
      req.ability.throwUnlessCan('manage', 'all')
      const commit = await Commit.findOne({
        where: { id: req.params.commitId },
      })

      await Commit.destroy({
        where: {
          id: req.params.commitId,
        },
        include: [
          {
            model: Repo,
            required: true,
            where: {
              id: req.params.id,
            },
            attributes: [],
          },
        ],
      })

      if (commit) return res.status(200).end(JSON.stringify(commit, null, 4))
      else return res.status(404).send('Коммита с таким id не существует')
    } catch (err) {
      console.log(err)
      res
        .status(403)
        .send(
          'У вас недостаточно прав чтобы удалить коммит в репозитории или время действия токена истекло.'
        )
    }
  }
}

module.exports = new CommitsController()
