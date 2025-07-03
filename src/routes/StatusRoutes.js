const routes = require("express").Router()
// const statusController = require("../controllers/StatusController")
const {verifyToken, requireAdmin} = require("../middleware/AuthMiddleware")
const {addStatus , getAllStatuses , deleteStatus} = require("../controllers/StatusController")

routes.post("/addstatus",verifyToken,requireAdmin,addStatus)
routes.get("/getstatus",verifyToken,getAllStatuses)
routes.delete("/deletestatus/:id",verifyToken,requireAdmin,deleteStatus)

module.exports=routes