import mongoose from "mongoose";
import Test from "../models/test.model.js";
import Lab from "../models/lab.model.js"; 

export const addTest = async (req, res) => {
  try {
    const { name, price } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (req.user.role !== "Lab Admin") {
      return res.status(403).json({ message: "Only Lab Admin can add tests" });
    }

    const lab = await Lab.findOne({ createdBy: req.user._id });
    if (!lab) {
      return res.status(404).json({ message: "No lab found for this admin" });
    }

    const duplicateTest = await Test.findOne({ name, lab: lab._id });
    if (duplicateTest) {
      return res.status(400).json({ message: "Test with this name already exists in this lab" });
    }


    const newTest = new Test({
      name,
      price,
      // lab: lab._id, 
      lab: new mongoose.Types.ObjectId(lab._id), // Ensure ObjectId format

      createdBy: req.user._id,
    });

    await newTest.save();

    res.status(201).json({
      success: true,
      message: "Test added successfully",
      test: newTest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add test",
      error: error.message,
    });
  }
};

export const updateTest = async (req, res) => {
  try {
    const testId = req.params.id;
    const { name, price } = req.body;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    if (req.user.role !== "Lab Admin") {
      return res.status(403).json({ message: "Only Lab Admin can update tests" });
    }

    test.name = name || test.name;
    test.price = price || test.price;
    await test.save();

    res.status(200).json({
      success: true,
      message: "Test updated successfully",
      test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update test",
      error: error.message,
    });
  }
};

export const deleteTest = async (req, res) => {
  try {
    const testId = req.params.id;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    if (req.user.role !== "Lab Admin") {
      return res.status(403).json({ message: "Only Lab Admin can delete tests" });
    }

    await test.remove();

    res.status(200).json({
      success: true,
      message: "Test deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete test",
      error: error.message,
    });
  }
};

export const getAllTests = async (req, res) => {
  try {
    console.log("User details:", req.user);
    
    const labId = req.user.labId.toString(); 
    console.log("Fetching tests for Lab ID:", labId);

    const tests = await Test.find({ lab: labId });

    console.log("Tests fetched:", tests);
    
    if (!tests.length) {
      return res.status(404).json({ message: "No tests found for this lab." });
    }

    res.status(200).json({
      success: true,
      tests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tests",
      error: error.message,
    });
  }
};

export const getTestDetails = async (req, res) => {
  try {
   
    const testId = req.params.id;

   
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({
      success: true,
      test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test details",
      error: error.message,
    });
  }
};
