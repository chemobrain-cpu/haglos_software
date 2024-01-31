require('dotenv').config()
const app = require('express')();
const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const multer = require("multer")
app.use(bodyParser.json())
const path = require("path")
const { body, validationResult } = require('express-validator')
const compression = require('compression')
const { Server } = require('socket.io')
let server = require('http').createServer(app)
const axios = require('axios')

let io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST', 'PATCH'],
  }
})

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//configuring database


mongoose.connect(process.env.DB_LOCAL,{
  useNewUrlParser:true,
  useUnifiedTopology: true
}).then(data=>{
  console.log('connected')
}).catch((data)=>{
  console.log(data)
})

//configuring multer

let dir = './public'
const multerStorage = multer.diskStorage({
  destination: dir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname)
  }
})

app.use(multer({ storage: multerStorage }).single('photo'))
app.use('/public', express.static(path.join(__dirname, 'public')))

//requiring our socket middleware
require("./routes/socket.js")(io)
//importing auth  routes
const AdminRoutes = require("./routes/admin").router

app.use(AdminRoutes)

__dirname = path.resolve()
if (process.env.NODE) {
  app.use(express.static(path.join(__dirname, '/client/build')))
  app.use("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
} else {
  app.get("/", (req, res) => {
    res.send("API is running")
  })
}


//express error middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 300
  err.message = err.message || "an error occured on the server"
  console.log(err.message)

  res.status(err.statusCode).json({ response:err.message })
})



server.listen(process.env.PORT || 8080, () => {
  console.log("listening on port 8080")
})


