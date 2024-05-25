const Router = require('express')
const router = new Router()
const abilityRouter = require('./abilityRouter')
const userRouter = require('./userRouter')
const repoRouter = require('./repositoryRouter')
const commitRouter = require('./commitsRouter')

router.use('/ability', abilityRouter)
router.use('/user', userRouter)
router.use('/repos', repoRouter)
router.use('/repos', commitRouter)

module.exports = router
