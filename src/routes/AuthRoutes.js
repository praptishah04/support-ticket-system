const routes = require("express").Router()
const authController = require("../controllers/AuthController")

routes.post("/googlelogin",authController.googleLogin)
routes.post("/signup",authController.signup)
routes.post("/login",authController.login)

module.exports=routes