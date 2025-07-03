const User = require("../models/UserModel")


const addUser = async(req,res)=>{
    const savedUser = await User.create(req.body)

    res.json({
        message:"data addded",
        data:savedUser
    })
}

const getAllUsers = async (req, res) => {
  try {
    // Fetch only users with role "agent"
    const agents = await User.find({ role: "agent" }).select("_id name email");
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agents" });
  }
};




module.exports={
    getAllUsers,addUser
}