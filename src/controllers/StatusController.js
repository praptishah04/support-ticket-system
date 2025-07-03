const Status = require("../models/StatusModel")

// Add a status
const addStatus = async (req, res) => {
    try {
        const saved = await Status.create(req.body)
        res.json({
            message: "Status created successfully",
            data: saved
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Get all statuses
const getAllStatuses = async (req, res) => {
    try {
        const statuses = await Status.find()
        res.status(200).json(statuses)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteStatus = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Status.findByIdAndDelete(id)

        if (!deleted) {
            return res.status(404).json({ message: "Status not found" })
        }

        res.json({
            message: "Status deleted successfully",
            data: deleted
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports={
    addStatus,getAllStatuses,deleteStatus
}