const express = require('express')
const app = express()
const router = require("./router")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

mongoose.set("strictQuery", true);

mongoose.connect("mongodb://127.0.0.1:27017/agendamento")

app.use(router)

app.listen("8080", console.log("Servidor iniciado"))