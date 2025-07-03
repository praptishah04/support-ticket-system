const Department = require("../models/DepartmentModel")

// Add a department
const addDepartment = async (req, res) => {
    try {
        const saved = await Department.create(req.body)
        res.json({
            message: "Department created successfully",
            data: saved
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Get all departments
const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().populate("assignedAdmins")
        res.status(200).json(departments)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Department.findByIdAndDelete(id)

        if (!deleted) {
            return res.status(404).json({ message: "Department not found" })
        }

        res.json({
            message: "Department deleted successfully",
            data: deleted
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports={
    addDepartment,getAllDepartments,deleteDepartment
}