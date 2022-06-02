const users = require('../../users.json')
const User = require('../user')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('error', () => console.log('MongoDB connect error!'))
db.once('open', () => {
  console.log('MongoDB connected!')
  users.infos.forEach(user => User.create(user))
  console.log('Done!')
})