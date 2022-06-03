// modules import
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes/index')
require('./config/mongoose')

const app = express()
const PORT = process.env.PORT || 3000

// app set and use
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
// routes
app.use(routes)

// port listen
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
