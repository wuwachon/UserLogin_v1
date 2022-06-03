const express = require('express')
const app = express()
const router = express.Router()
const User = require('../../models/user')

// home page after login
router.get('/', (req, res) => {
  const email = req.signedCookies.email || '--'
  return User.findOne({email})
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
      if (!user) return res.redirect('/user/detail')
      res.cookie('email', user.email, {path: '/user', signed: true, maxAge: 60000})
      res.redirect('/user')
    })
    .catch(error => console.log(error))
})
// user logout
router.post('/logout', (req, res) => {
  res.clearCookie('email', {path: '/user'})
  res.redirect('/')
})
// register
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  const newUser = req.body
  return User.findOne({email: newUser.email})
    .then(user => {
      if (user) return res.render('register', {user: newUser})
      User.create(newUser)
      res.cookie('email', newUser.email, {path: '/user', signed: true, maxAge: 60000})
      res.redirect('/user')
    })
    .catch(error => console.log(error))
})
// read user detail
router.get('/detail', (req, res) => {
  const email = req.signedCookies.email || '--'
  return User.findOne({email})
    .lean()
    .then(user => res.render('userdetail', {user}))
    .catch(error => console.log(error))
})
// edit the user detail
router.put('/detail', (req, res) => {
  const {firstName, password} = req.body
  const email = req.signedCookies.email || '--'
  return User.findOne({email})
    .then(user => {
      user.firstName = firstName
      user.password = password
      user.save()
    })
    .then(() => res.redirect('/user'))
    .catch(error => console.log(error))
})

module.exports = router