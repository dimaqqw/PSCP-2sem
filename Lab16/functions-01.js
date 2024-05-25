const Users = [
  { user: 'user1', password: 'user1' },
  { user: 'user2', password: 'user2' },
  { user: 'user3', password: 'user3' },
]

const getCredential = (user) => {
  let u = Users.find((e) => {
    return e.user.toLowerCase() == user.toLowerCase()
  })
  return u
}

const verifyPassword = (pass1, pass2) => {
  return pass1 == pass2
}

module.exports = {
  getCredential: getCredential,
  verifyPassword: verifyPassword,
}
