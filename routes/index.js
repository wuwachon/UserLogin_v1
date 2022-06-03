const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const login = require('./modules/login')

router.use('/', home)
router.use('/user', login)

module.exports = router