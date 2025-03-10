import Lab from "../models/lab.model.js";
import mongoose from "mongoose";
import User from "../models/auth.model.js";

export const addLab = async (req, res) => {
  try {
    if (req.user.role !== "Super Admin") {
      return res.status(403).json({ message: "Access denied. Only Super Admin can create labs." });
    }

    const { name, address, location, description, image, labAdminId } = req.body;

    if (!name || !address || !location || !description || !labAdminId) {
      return res.status(400).json({ message: "All fields, including labAdminId, are required." });
    }

    const labAdmin = await User.findById(labAdminId);
    if (!labAdmin || labAdmin.role !== "Lab Admin") {
      return res.status(404).json({ message: "Lab Admin not found or invalid role." });
    }

    const newLab = await Lab.create({
      name,
      address,
      location,
      description,
      image: image || "",
      isActive: true,
      createdBy: new mongoose.Types.ObjectId(req.user._id),
      labAdmin: new mongoose.Types.ObjectId(labAdminId),
    });

    await User.findByIdAndUpdate(labAdminId, { labId: newLab._id });

    res.status(201).json({ message: "Lab created successfully", lab: newLab });
  } catch (error) {
    res.status(500).json({ message: "Error creating lab", error: error.message });
  }
};

export const getLab = async (req, res) => {
  try {
    console.log("User ID:", req.user._id);
    const lab = await Lab.findOne({
      $or: [{ createdBy: req.user._id }, { labAdmin: req.user._id }]
    }).populate("createdBy", "name email").populate("labAdmin", "name email");

    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }
    res.status(200).json(lab);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lab", error: error.message });
  }
};

export const updateLab = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, location, description, image, isActive } = req.body;

    let lab = await Lab.findOne({ _id: id });
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    if (req.user._id.toString() !== lab.createdBy.toString() && req.user._id.toString() !== lab.labAdmin.toString()) {
      return res.status(403).json({ message: "Access denied. You are not authorized to update this lab." });
    }

    lab.name = name || lab.name;
    lab.address = address || lab.address;
    lab.location = location || lab.location;
    lab.image = image || lab.image;
    lab.description = description || lab.description;
    lab.isActive = isActive !== undefined ? isActive : lab.isActive;

    const updatedLab = await lab.save();
    res.status(200).json({ message: "Lab updated successfully", lab: updatedLab });
  } catch (error) {
    res.status(500).json({ message: "Error updating lab", error: error.message });
  }
};

export const deleteLab = async (req, res) => {
  try {
    const { id } = req.params;

    const lab = await Lab.findOne({ _id: id });
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    if (req.user.role !== "Super Admin") {
      return res.status(403).json({ message: "Access denied. Only Super Admin can delete labs." });
    }

    await User.findByIdAndUpdate(lab.labAdmin, { $unset: { labId: "" } });

    await lab.deleteOne();
    res.status(200).json({ message: "Lab deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lab", error: error.message });
  }
};
