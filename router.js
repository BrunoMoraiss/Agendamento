const { Router } = require("express")
const router = new Router()
const AppointmentService = require("./services/AppointmentService")

const mailer = require("nodemailer")


router.get("/", (req, res) => {
    res.render("index")
})

router.get("/cadastro", (req, res) => {
    res.render("create")
})

router.post("/create", async (req, res) => {
    const { name, email, description, cpf, date, time } = req.body

    const status = await AppointmentService.Create(name, email, description, cpf, date, time)

    if(status){
        res.redirect("/")
    }else{
        res.send("Ocorreu uma falha")
    }
})

router.get("/getcalendar", async (req, res) => {
    const appointments = await AppointmentService.GetAll(false)

    res.json(appointments)
})

router.get("/event/:id", async (req, res) =>{
    const appointment = await AppointmentService.GetById(req.params.id)
    res.render("event", {appo: appointment})
})

router.post("/finish", async (req, res) => {
    const id = req.body.id

    const result = await AppointmentService.Finish(id)

    res.redirect("/")
})

router.get("/list", async (req, res) => {
    const appos = await AppointmentService.GetAll(true) 

    res.render("list", {appos})
})

router.get("/searchresult", async (req, res) => {
    const query = req.query.search

    const appos = await AppointmentService.Search(query)

    res.render("list", {appos})
})  

setInterval(async () => {
    const appo = await AppointmentService.SendNotification()

}, 300000)

module.exports = router