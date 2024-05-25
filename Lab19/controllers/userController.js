const { User } = require('../models')

class UserController {
  async getAllUsers(req, res) {
    try {
      req.ability.throwUnlessCan('read', 'User', 'all')
      const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'role'],
      })
      res.status(200).end(JSON.stringify(users, null, 4))
    } catch (err) {
      console.log(err)
      res
        .status(403)
        .send(
          'У вас недостаточно прав чтобы посмотреть всех пользователей или время действия токена истекло'
        )
    }
  }

  async getOneUser(req, res) {
    try {
      console.log('hgs')
      let userId = +req.payload.id
      // console.log(req)
      if (req.payload.role === 'admin') {
        userId = +req.params.id
      } else {
        res
          .status(403)
          .send(
            'У вас недостаточно прав чтобы посмотреть данные о пользователе или время действия токена истекло'
          )
      }
      const user = await User.findOne({
        where: {
          id: userId,
        },
        attributes: ['id', 'username', 'email', 'role'],
      })
      if (user) {
        res.status(200).end(JSON.stringify(user, null, 4))
      } else {
        res.status(404).send('Юзера с таким id не существует.')
      }
    } catch (err) {
      console.log(err)
      res
        .status(403)
        .send(
          'У вас недостаточно прав чтобы посмотреть данные о пользователе или время действия токена истекло'
        )
    }
  }
}

module.exports = new UserController()
