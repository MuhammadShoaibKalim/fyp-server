import Package from "../models/package.model.js";
import Lab from "../models/lab.model.js";


export const addPackage = async (req, res) => {
  try {
    const { name, price, tests } = req.body;
   
    if( !name || !price || !tests){
         console.log("Please provide name, price and test..")
    }
   
    if (req.user.role !== "Lab Admin") {
      return res.status(403).json({ message: "Only Lab Admin can add packages" });
    }

  
    const lab = await Lab.findOne({ createdBy: req.user._id });
    if (!lab) {
      return res.status(404).json({ message: "No lab found for this admin" });
    }

  
    const invalidTests = await Test.find({ _id: { $in: tests }, lab: { $ne: lab._id } });
    if (invalidTests.length > 0) {
      return res.status(400).json({ message: "All tests must belong to the same lab" });
    }

    
    const newPackage = new Package({
      name,
      price,
      tests, 
      createdBy: req.user._id, 
      lab: lab._id, 
    });

    await newPackage.save();

    res.status(201).json({
      success: true,
      message: "Package added successfully",
      package: newPackage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add package",
      error: error.message,
    });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const { name, description, tests } = req.body;

    const packageItem = await Package.findById(packageId); 
    if (!packageItem) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (req.user.role !== "Lab Admin") {
      return res.status(403).json({ message: "Only Lab Admin can update packages" });
    }

    packageItem.name = name || packageItem.name;
    packageItem.description = description || packageItem.description;
    packageItem.tests = tests || packageItem.tests;
    await packageItem.save();

    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      packageItem,  
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update package",
      error: error.message,
    });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    const packageItem = await Package.findById(packageId); 
    if (!packageItem) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (req.user.role !== "Lab Admin") {
      return res.status(403).json({ message: "Only Lab Admin can delete packages" });
    }

    await packageItem.remove();

    res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete package",
      error: error.message,
    });
  }
};

export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find({ lab: req.user.labId }).populate("lab");
    console.log("Fetched packages with labs:", packages);
    
    res.status(200).json({
      success: true,
      packages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch packages",
      error: error.message,
    });
  }
};



export const getPackageDetails = async (req, res) => {
  try {
    const packageId = req.params.id;

    const packageItem = await Package.findById(packageId); 
    if (!packageItem) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json({
      success: true,
      packageItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch package details",
      error: error.message,
    });
  }
};
