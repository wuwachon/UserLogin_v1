const mongoose = require('mongoose')
require('dotenv'). config()

// database connect
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection

db.on('error', () => console.log('MongoDB connect error!'))
db.once('open', () => console.log('MongoDB connected!'))

module.exports = db