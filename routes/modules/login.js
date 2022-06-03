const express = require('express')
const app = express()
const router = express.Router()
const User = require('../../models/user')

// home page after login
router.get('/', (req, res) => {
  return User.findOne({email: app.locals.email})
    .lean()
    .then(user => res.render('index', {user}))
    .catch(error => console.log(error))
})
// user login page
router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', (req, res) => {
  const loginData = req.body
  return User.findOne({ 
    $and: [{email: loginData.email}, {password: loginData.password}]
    })
    .lean()
    .then(user => {
      if (!user) return res.redirect('/user/register')
      app.locals.email = user.email
      res.redirect('/user')
    })
    .catch(error => console.log(error))
})
// user logout
router.post('/logout', (req, res) => {
  app.locals.email = '--'
  res.redirect('/')
})
// register
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  const newUser = req.body
  return User.findOne({email: app.locals.email})
    .then(user => {
      if (user) return res.render('register', {user})
      User.create(newUser)
      app.locals.email = newUser.email
      res.redirect('/user')
    })
    .catch(error => console.log(error))
})
// read user detail
router.get('/detail', (req, res) => {
  return User.findOne({email: app.locals.email})
    .lean()
    .then(user => res.render('userdetail', {user}))
    .catch(error => console.log(error))
})
// edit the user detail
router.put('/detail', (req, res) => {
  const {firstName, password} = req.body
  return User.findOne({email: app.locals.email})
    .then(user => {
      user.firstName = firstName
      user.password = password
      user.save()
    })
    .then(() => res.redirect('/user'))
    .catch(error => console.log(error))
})

module.exports = router