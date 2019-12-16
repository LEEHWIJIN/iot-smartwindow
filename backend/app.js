const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const checktoken = require('./middle/checktoken')
const cafe = require('./route/cafe')
const auth = require('./route/auth')
const win = require('./route/win')
const blind = require('./route/blind')
const weather = require('./route/weather')

require('./db/database_config') //connect db

const app = express()
app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, authorization")
    next()
})
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use(checktoken.checktoken)
app.get('/', (req, res)=>{
    res.json({
        user: req.user
    })
})

//app.use('/', cafe)
app.use('/auth', auth)
app.use('/win', win)
app.use('/blind',blind)
app.use('/weather',weather)

module.exports = app