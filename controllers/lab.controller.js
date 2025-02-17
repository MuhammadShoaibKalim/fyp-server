import Lab from "../models/lab.model.js";
import User from "../models/user.model.js";


// Create a new lab (Only Lab Admins)
export const createLab = async (req, res) => {
    try {
        const { name, address, image, location } = req.body;

        if (req.user.role !== "Lab Admin") {
            return res.status(403).json({ message: "Only Lab Admins can create labs." });
        }

        // Check if lab already exists for this admin
        const existingLab = await Lab.findOne({ createdBy: req.user._id });
        if (existingLab) {
            return res.status(400).json({ message: "You already have a lab." });
        }

        const lab = await Lab.create({
            name,
            address,
            image,
            location,
            createdBy: req.user._id,
        });

        await User.findByIdAndUpdate(req.user._id, { labId: lab._id }, { new: true });

        res.status(201).json({
            success: true,
            message: "Lab created successfully",
            lab,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating lab",
            error: error.message,
        });
    }
};


// Get all labs created by the logged-in Lab Admin
export const getLabsByLabAdmin = async (req, res) => {
    try {
        const labs = await Lab.find({ createdBy: req.user._id });

        if (!labs || labs.length === 0) {
            return res.status(404).json({ message: "No labs found for this admin." });
        }
        

        res.status(200).json({
            success: true,
            labs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving labs",
            error: error.message,
        });
    }
};

// Update a lab (Only Lab Admins who created the lab)
export const updateLab = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, image, location, isActive } = req.body;

        const lab = await Lab.findOne({ _id: id, createdBy: req.user._id });

        if (!lab) {
            return res.status(404).json({ message: "Lab not found or you're not authorized to update it." });
        }
       


        lab.name = name || lab.name;
        lab.address = address || lab.address;
        lab.image = image || lab.image;
        lab.location = location || lab.location;
        lab.isActive = isActive !== undefined ? isActive : lab.isActive;

        const updatedLab = await lab.save();

        res.status(200).json({
            success: true,
            message: "Lab updated successfully",
            lab: updatedLab
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating lab",
            error: error.message
        });
    }
};

// Delete a lab (Only Lab Admins who created the lab)
export const deleteLab = async (req, res) => {
    try {
        const { id } = req.params;

        const lab = await Lab.findOne({ _id: id, createdBy: req.user._id });

        if (!lab) {
            return res.status(404).json({ message: "Lab not found or you're not authorized to delete it." });
        }

        await lab.deleteOne();

        res.status(200).json({
            success: true,
            message: "Lab deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting lab",
            error: error.message
        });
    }
};



