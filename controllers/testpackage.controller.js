import Test from "../models/test.model.js";
import Package from "../models/package.model.js";
import mongoose from "mongoose";
import Lab from "../models/lab.model.js";

// Test
export const createTest = async (req, res) => {
  try {
    const { name, price, description, lab } = req.body;

    if (!name || !price || !lab) {
      return res.status(400).json({ error: "Name, price, and lab are required." });
    }

    const test = new Test({ 
      name, 
      price, 
      description, 
      createdBy: req.user._id, 
      lab:new mongoose.Types.ObjectId(lab) ,
      labAdmin: req.user._id
    });

    await test.save();

    await Lab.findByIdAndUpdate(lab, { $push: { tests: test._id } });


    res.status(201).json({
      test,
      message: "Test created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!test) return res.status(404).json({ error: "Test not found" });
    res.status(200).json(
      {
        test,
        message: "Test updated successfully",
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });
    res.status(204).send(
      {
        message: "Test deleted successfully",
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find().populate("createdBy", "name email").populate("lab", "name location");
    res.status(200).json(
      {
        tests,
        message: "All tests fetched successfully",
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



//packages
export const createPackage = async (req, res) => {
  try {
    const { name, price, tests, lab } = req.body;

    if (!name || !price || !tests || !lab) {
      return res.status(400).json({ error: "Name, price, tests, and lab are required." });
    }

    const packageItem = new Package({ 
      name, 
      price, 
      tests, 
      createdBy: req.user._id, 
      lab:new mongoose.Types.ObjectId(lab),
      labAdmin: req.user._id 
    });

    await packageItem.save();

    await Lab.findByIdAndUpdate(lab, { $push: { packages: packageItem._id } });

    res.status(201).json({
      packageItem,
      message: "Package created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updatePackage = async (req, res) => {
  try {
    const packageItem = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!packageItem) return res.status(404).json({ error: "Package not found" });
    res.status(200).json({
      packageItem,
      message: "Package updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deletePackage = async (req, res) => {
  try {
    const packageItem = await Package.findByIdAndDelete(req.params.id);
    if (!packageItem) return res.status(404).json({ error: "Package not found" });
    res.status(204).send(
      {
        message: "Package deleted successfully",
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate("tests", "name price")
      .populate("createdBy", "name email")
      .populate("lab", "name location");
      
    res.status(200).json(
      {
        packages,
        message: "All packages fetched successfully",
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





