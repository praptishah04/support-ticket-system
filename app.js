const express = require("express") //
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config();


const app = express()

app.use(cors())
app.use(express.json())




const userRoutes = require("./src/routes/UserRoutes")
app.use("/user",userRoutes)


const ticketRoutes = require("./src/routes/TicketRoutes")
app.use("/ticket",ticketRoutes)


const departmentRoutes = require("./src/routes/DepartmentRoutes")
app.use("/department",departmentRoutes)

const statusRoutes = require("./src/routes/StatusRoutes")
app.use("/status",statusRoutes)

const escalationRoutes = require("./src/routes/EscalationRoutes")
app.use("/escalation",escalationRoutes)

const authRoutes = require("./src/routes/AuthRoutes")
app.use("/auth",authRoutes)



mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Database is connected.")
})


const PORT = 5000
app.listen(PORT,()=>{
    console.log("server started on port number ",PORT)
})