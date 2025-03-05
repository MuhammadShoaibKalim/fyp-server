import Collection from "../models/collections.model.js";
import Lab from "../models/lab.model.js";
import mongoose from "mongoose";

// Create a Lab (Super Admin or Lab Admin)
export const addLab = async (req, res) => {
  try {
    const { name, address, location, description, labAdminId,image } = req.body;

    if (!name || !address || !location || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let ownerId;

    if (req.user.role === "Lab Admin") {
      ownerId = req.user._id;
    } else if (req.user.role === "Super Admin") {
      if (!labAdminId) {
        return res.status(400).json({ message: "Lab Admin ID is required" });
      }
      ownerId = labAdminId;
    } else {
      return res.status(403).json({ message: "Unauthorized to create a lab" });
    }

    
    //Convert ownerId to ObjectId to match MongoDB storage
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    //Check if the Lab Admin already has a lab
    const existingLab = await Lab.findOne({ createdBy: ownerObjectId });

    if (existingLab) {
      console.log("Lab already exists for this Lab Admin:", ownerId);
      return res.status(400).json({ message: "This Lab Admin already has a lab. Cannot create another." });
    }

    //Create new lab
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

//  Get Labs (Super Admin sees all, Lab Admin sees only their own)
export const getLabs = async (req, res) => {
  try {
    let labs;
    if (req.user.role === "Super Admin") {
      // Super Admin can see all labs
      labs = await Lab.find();
    } else {
      // Lab Admin sees only their own labs
      labs = await Lab.find({ createdBy: req.user._id });
    }

    res.status(200).json(labs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching labs", error: error.message });
  }
};

// Update Lab (Super Admin can update all, Lab Admin can update only their own)
export const updateLab = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, location, description, image, isActive } = req.body;

    let lab = await Lab.findById(id);
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    // Check if Lab Admin owns the lab
    if (
      req.user.role === "Lab Admin" &&
      lab.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Access denied. You can only update your own lab." });
    }
    lab.name = name || lab.name;
    lab.address = address || lab.address;
    lab.location = location || lab.location;
    lab.image = image || lab.image;
    lab.description = description || lab.description;
    lab.isActive = isActive !== undefined ? isActive : lab.isActive;
    const updatedLab = await lab.save();
    res
      .status(200)
      .json({ message: "Lab updated successfully", lab: updatedLab });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating lab", error: error.message });
  }
};

//  Delete Lab (Only Super Admin)
export const deleteLab = async (req, res) => {
  try {
    const { id } = req.params;

    let lab = await Lab.findById(id);
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    if (req.user.role !== "Super Admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only Super Admins can delete labs." });
    }

    await lab.deleteOne();
    res.status(200).json({ message: "Lab deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting lab", error: error.message });
  }
};

// Add Test to Lab (Super Admin or Lab Admin can add tests to their lab)
export const addTestToLab = async (req, res) => {
  try {
    const { labId, testId } = req.body;

    let lab = await Lab.findById(labId);
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    // Lab Admin can only add tests to their own lab
    if (
      req.user.role === "labAdmin" &&
      lab.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({
          message: "Access denied. You can only add tests to your own lab.",
        });
    }

    lab.tests.push(testId);
    await lab.save();

    res.status(200).json({ message: "Test added successfully", lab });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding test", error: error.message });
  }
};

//see all test/package there
export const getCollectionsByLab = async (req, res) => {
  try {
    const labId = req.params.labId;
    console.log("Received Lab ID:", labId);  

    // Check if labId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(labId)) {
      return res.status(400).json({ message: "Invalid Lab ID format", receivedId: labId });
    }

    // Fetch the lab by ID
    const lab = await Lab.findById(labId).populate("tests");
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    res.status(200).json(lab);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lab details", error: error.message });
  }
};





