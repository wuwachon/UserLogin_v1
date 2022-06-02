const users = require('../../users.json')
const User = require('../user')
const db = require('../../config/mongoose')

db.once('open', () => {
  users.infos.forEach(user => User.create(user))
  console.log('Done!')
})
