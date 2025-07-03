const Ticket = require("../models/TicketModel")
const Status = require("../models/StatusModel")

const createticket = async (req, res) => {
  console.log("✅ Ticket creation endpoint hit");
  try {
    const { title, description, priority, department, assignedTo } = req.body;
    const openStatus = await Status.findOne({ title: "Open" });
    if (!openStatus) return res.status(404).json({ message: "Default status not found" });

    const newTicket = new Ticket({
      title,
      description,
      priority,
      status: openStatus._id,
      department,
      assignedTo: assignedTo ? assignedTo : null,
      createdBy: req.user.id,
      history: [
        {
          action: "Created",
          user: req.user.id,
          details: `Ticket created with priority: ${priority}`,
          timestamp: new Date()
        }
      ]
    });

    const savedTicket = await newTicket.save();

    res.status(201).json({
      message: "Ticket created successfully",
      data: savedTicket
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("department")
      .populate("status","title")
      .populate("assignedTo")
      .populate("createdBy");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const updates = req.body;
    const userId = req.user.id;

    
    const changes = [];
    for (const key of ["status", "priority", "assignedTo"]) {
      if (updates[key] && updates[key] != ticket[key]) {
        changes.push(`${key} changed`);
      }
    }

    
    Object.assign(ticket, updates);

    if (changes.length > 0) {
      ticket.history.push({
        action: "Updated",
        user: userId,
        details: changes.join(", "),
        timestamp: new Date()
      });
    }
    
    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
  .populate("replies.user", "name")
  .populate("history.user", "name")
  .populate("department", "name")
  .populate("status", "title")
  .populate("assignedTo", "name");


    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const addReply = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const { message, author } = req.body;
    if (!message || !author) {
      return res.status(400).json({ message: "Reply message and author required" });
    }

    
    ticket.replies.push({ message, user: author });

    
    ticket.history.push({
      action: "Replied",
      user: author,
      details: `Reply added: "${message.slice(0, 50)}..."`,
      timestamp: new Date()
    });

    await ticket.save();

    
    const updatedTicket = await Ticket.findById(ticket._id)
      .populate("replies.user", "name")
      .populate("history.user", "name")
      .populate("department", "name")
      .populate("status", "title")
      .populate("assignedTo", "name");

    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Error in addReply:", error);
    res.status(500).json({ error: error.message });
  }
};




const getTicketsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // comes from verifyToken middleware

    const tickets = await Ticket.find({ createdBy: userId })
      .populate("status", "title")
      .populate("department", "name");

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user's tickets" });
  }
};


const getSingleTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("department", "name")
      .populate("status", "title")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("history.user", "name email"); 

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error fetching ticket" });
  }
};

const assignTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { assignedTo } = req.body;
    console.log("Assigning ticket:", ticketId, "to user:", assignedTo);

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.assignedTo = assignedTo;

    // Set status to "Assigned"
    const assignedStatus = await Status.findOne({ title: "Assigned" });
    if (assignedStatus) {
      ticket.status = assignedStatus._id;
    }

    ticket.history.push({
      action: "Assigned",
      user: req.user.id,
      details: `Assigned to user ID: ${assignedTo}`,
      timestamp: new Date()
    });

    await ticket.save();

    const updated = await Ticket.findById(ticketId)
      .populate("assignedTo", "name email")
      .populate("status", "title")
      .populate("department", "name")
      .populate("history.user", "name email");

    res.status(200).json(updated);
  } catch (error) {
    console.error("🔥 assignTicket error:", error);
    res.status(500).json({ message: "Failed to assign ticket", error: error.message });
  }
};

const getTicketsAssignedToAgent = async (req, res) => {
  try {
    const agentId = req.user.id;
    const tickets = await Ticket.find({ assignedTo: agentId })
      .populate("status", "title")
      .populate("department", "name")
      .populate("createdBy", "name email");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports={
    createticket,getTickets,updateTicket,addReply,getTicketsByUser,getSingleTicket,assignTicket,
    getTicketsAssignedToAgent
}