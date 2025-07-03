const EscalationRule = require("../models/EscalationRuleModel")

// Add escalation rule
const addEscalationRule = async (req, res) => {
    try {
        const saved = await EscalationRule.create(req.body)
        res.json({
            message: "Escalation rule created successfully",
            data: saved
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Get all escalation rules
const getAllEscalationRules = async (req, res) => {
    try {
        const rules = await EscalationRule.find()
        res.status(200).json(rules)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Update escalation rule
const updateEscalationRule = async (req, res) => {
    try {
        const { id } = req.params
        const updated = await EscalationRule.findByIdAndUpdate(id, req.body, { new: true })
        
        if (!updated) {
            return res.status(404).json({ message: "Escalation rule not found" })
        }

        res.json({
            message: "Escalation rule updated successfully",
            data: updated
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteEscalationRule = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await EscalationRule.findByIdAndDelete(id)

        if (!deleted) {
            return res.status(404).json({ message: "Escalation rule not found" })
        }

        res.json({
            message: "Escalation rule deleted successfully",
            data: deleted
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports={
    addEscalationRule,getAllEscalationRules,updateEscalationRule,deleteEscalationRule
}