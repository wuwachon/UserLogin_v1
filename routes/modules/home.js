const express = require('express')
const router = express.Router()

// home page before login
router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router