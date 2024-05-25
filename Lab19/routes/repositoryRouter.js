const Router = require('express')
const repoRouter = new Router()
const reposController = require('../controllers/repositoryController')

repoRouter
  .get('/', reposController.getAllRepo)
  .get('/:id', reposController.getOneRepo)
  .post('/', reposController.createRepo)
  .put('/:id', reposController.updateRepo)
  .delete('/:id', reposController.deleteRepo)

module.exports = repoRouter
