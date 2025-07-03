const ticketController = require("../controllers/TicketController")
const routes = require("express").Router()
const {verifyToken } = require("../middleware/AuthMiddleware")


routes.post("/createticket",verifyToken,ticketController.createticket)
routes.get("/gettickets", ticketController.getTickets);
routes.put("/updateticket/:id", verifyToken,ticketController.updateTicket);
routes.post("/addreply/:id/reply", verifyToken,ticketController.addReply);
routes.get("/userticket",verifyToken,ticketController.getTicketsByUser)
routes.get("/ticket/:id",verifyToken,ticketController.getSingleTicket)
routes.post("/assign/:id", verifyToken, ticketController.assignTicket);
routes.get("/assigned", verifyToken, ticketController.getTicketsAssignedToAgent)

module.exports=routes