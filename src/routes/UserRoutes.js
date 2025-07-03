const routes = require("express").Router()
const userController = require("../controllers/UserController")
const { getAllUsers } = require("../controllers/UserController");
const { verifyToken, requireAdmin } = require("../middleware/AuthMiddleware");


routes.post("/adduser",userController.addUser)
routes.get("/getalluser",verifyToken,getAllUsers)

module.exports = routes