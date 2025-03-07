import Lab from "../models/lab.model.js";
import mongoose from "mongoose";

export const addLab = async (req, res) => {
  try {
    if (req.user.role !== "Lab Admin") {
      return res.status(403).json({ message: "Unauthorized to create a lab" });
    }

    const { name, address, location, description, image } = req.body;

    if (!name || !address || !location || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const ownerObjectId = new mongoose.Types.ObjectId(req.user._id);

    const existingLab = await Lab.findOne({ createdBy: ownerObjectId });
    if (existingLab) {
      return res.status(400).json({ message: "You already have a lab." });
    }

    const newLab = await Lab.create({
      name,
      address,
      location,
      description,
      image,
      isActive: true,
      createdBy: ownerObjectId,
      tests: [],
    });

    res.status(201).json({ message: "Lab created successfully", lab: newLab });
  } catch (error) {
    res.status(500).json({ message: "Error creating lab", error: error.message });
  }
};
export const getLab = async (req, res) => {
  try {
    const lab = await Lab.findOne({ createdBy: req.user._id });
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

    let lab = await Lab.findOne({ _id: id, createdBy: req.user._id });
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
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
    const lab = await Lab.findOne({ _id: id, createdBy: req.user._id });
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }
    await lab.remove();
    res.status(200).json({ message: "Lab deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lab", error: error.message });
  }
}