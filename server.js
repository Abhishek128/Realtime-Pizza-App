require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3300
const mongoose = require('mongoose')
const session = require('express-session')
const flash   = require('express-flash')
const  MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')
const Emitter = require('events')

// const url = 'mongodb://localhost/pizza'

mongoose.connect(process.env.HOST,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:true
})
const connection = mongoose.connection
connection.once('open',() => {
    console.log('DataBase Connected')
}).catch(err => {
    console.log('Commection Failed')    
})


const mongoStore = new MongoDbStore({
    mongooseConnection :connection , 
    collection : 'sessions'
})

const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)

app.use(session({
    secret : process.env.COOKIES_SECRET,
    resave : false ,
    saveUninitialized : false , 
    store : mongoStore  ,
    // cookie : {maxAge : 1000*15}
    cookie : {maxAge : 1000*60*60*24}
}))
const passportInit = require('./app/config/passport')
const { Socket } = require('dgram')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({extended : false }))
app.use(express.json())
app.use(flash())
app.use(expressLayout)
app.set('views',path.join(__dirname,'./resources/views'))
app.set('view engine','ejs')

app.use((req,res,next) =>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
} )

require('./routes/web')(app)


app.use(express.static('public'))
const server = app.listen(PORT,()=>{
        console.log(`Lisening on Port ${PORT} : http://localhost:3300`)
})

const io = require('socket.io')(server)
io.on('connection',(socket)=> {
    // console.log(socket.id)
    socket.on('join',(orderId)=>{
        console.log(orderId)
        socket.join(orderId)

    })
})

eventEmitter.on('orderUpdated',(data) =>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})
eventEmitter.on('orderPlaced',(data) =>{
    io.to(`adminRoom`).emit('orderPlaced',data)
})