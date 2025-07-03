const routes = require("express").Router()
// const escalationController = require("../controllers/EscalationRuleController")
const {verifyToken , requireAdmin} = require("../middleware/AuthMiddleware")
const {addEscalationRule , getAllEscalationRules, updateEscalationRule, deleteEscalationRule} = require("../controllers/EscalationRuleController")

routes.post("/addescalation",verifyToken,requireAdmin,addEscalationRule)
routes.get("/getallescalation",verifyToken,requireAdmin,getAllEscalationRules)
routes.put("/updateescalation/:id",verifyToken,requireAdmin,updateEscalationRule)
routes.delete("/deleteescalation/:id",verifyToken,requireAdmin,deleteEscalationRule)

module.exports=routes