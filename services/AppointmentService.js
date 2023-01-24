const appointment = require("../models/Appointment")
const mongoose = require('mongoose')

const Appointment = mongoose.model('Appointment', appointment)

const AppointmentFactory = require("../factories/AppointmentFactory")

const mailer = require("nodemailer")

class AppointmentService {

    async Create(name, email, description, cpf, date, time){
        const newAppo = new Appointment({
            name, 
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false
        })

        try{
            await newAppo.save()
            return true
        }catch(err){
            console.log(err)
            return false
        }
    }

    async GetAll(showFinished){
        if(showFinished){
            return await Appointment.find()
        }else{
            const appos = await Appointment.find({'finished': false})
            let appointments = []

            appos.forEach(appointment => {
                appointments.push(AppointmentFactory.build(appointment))
            })

            return appointments
        }
    }

    async GetById(id){
        try{
            const event = await Appointment.findById(id)
            return event
        }catch(err){
            console.log(err)
        }
        
    }

    async Finish(id){
        try{
            await Appointment.findByIdAndUpdate(id, {finished: true})
            return true
        }catch(err){
            console.log(err)
            return false
        }
    }

    async Search(query){
        try{
            const appos = await Appointment.find().or([{email: query}, {cpf: query}])
            return appos
        }  catch(err){
            console.log(err)
            return []
        }
        
    }

    async SendNotification(){
        const appo = await this.GetAll(false)

        const transporter = mailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "a7bcea90ca1b02",
                pass: "fb64d185482102"
            }
        })
    
        appo.forEach(async appo => {
            const date = appo.start.getTime()
            const hour = 1000 * 60 * 60
            const gap = date - Date.now()
    
            if(gap <= hour){
                if(!appo.notified){
    
                    await Appointment.findByIdAndUpdate(appo.id, {notified: true})
                    
    
                    transporter.sendMail({
                        from: "Bruno Morais <brunomoraisads@gmail.com>",
                        to: appo.email,
                        subject: "Sua consulta vai acontcer em breve",
                        text: "Sua consulta vai acontecer em uma hora"
                    }).then(() => {
                        console.log("Email enviado")
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }
        })
    }
}

module.exports = new AppointmentService()