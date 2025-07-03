const routes = require("express").Router()
// const departmentController = require("../controllers/DepartmentController")
const {verifyToken , requireAdmin} = require("../middleware/AuthMiddleware")
const {addDepartment , getAllDepartments , deleteDepartment} = require("../controllers/DepartmentController")

routes.post("/adddepartment",verifyToken,requireAdmin,addDepartment)
routes.get("/getdepartment",verifyToken,getAllDepartments)
routes.delete("/deletedepartment/:id",verifyToken,requireAdmin,deleteDepartment)

module.exports=routes