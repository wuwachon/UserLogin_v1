// modules import
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const User = require('./models/user')
require('dotenv'). config()

const app = express()
const PORT = process.env.PORT || 3000

let userEmail = '--'
// database connect
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on('error', () => console.log('MongoDB connect error!'))
db.once('open', () => console.log('MongoDB connected!'))
// app set and use
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
// routes
app.get('/', (req, res) => {
  return User.findOne({email: userEmail})
    .lean()
    .then(user => res.render('index', {user}))
    .catch(error => console.log(error))
})
// user login page
app.get('/user/login', (req, res) => {
  res.render('login')
})
app.post('/user/login', (req, res) => {
  const loginData = req.body
  return User.findOne({ 
    $and: [{email: loginData.email}, {password: loginData.password}]
    })
    .lean()
    .then(user => {
      if (!user) return res.redirect('/user/register')
      userEmail = user.email
      res.redirect('/')
    })
    .catch(error => console.log(error))
})
// user logout
app.post('/user/logout', (req, res) => {
  userEmail = '--'
  res.redirect('/')
})
// register
app.get('/user/register', (req, res) => {
  res.render('register')
})
app.post('/user/register', (req, res) => {
  const newUser = req.body
  return User.findOne({email: userEmail})
    .then(user => {
      if (user) return res.render('register', {user})
      User.create(newUser)
      userEmail = newUser.email
      res.redirect('/')
    })
    .catch(error => console.log(error))
})
// read user detail
app.get('/user/detail', (req, res) => {
  return User.findOne({email: userEmail})
    .lean()
    .then(user => res.render('userdetail', {user}))
    .catch(error => console.log(error))
})
// edit the user detail
app.put('/user/detail', (req, res) => {
  const {firstName, password} = req.body
  return User.findOne({email: userEmail})
    .then(user => {
      user.firstName = firstName
      user.password = password
      user.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
// port listen
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
