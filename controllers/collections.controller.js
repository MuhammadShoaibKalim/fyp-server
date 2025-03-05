import Collection from "../models/collections.model.js";
import Lab from "../models/lab.model.js";
import mongoose from "mongoose";


//Add a new test/package (Super Admin for any lab, Lab Admin for their own)
export const addCollection = async (req, res) => {
  try {
    const { name, description, price, rating, collectionType, labId } = req.body;
    const user = req.user; 

    let labToAssign;
    if (user.role === "Super Admin") {
      if (!mongoose.Types.ObjectId.isValid(labId)) {
        return res.status(400).json({ message: "Invalid Lab ID" });
      }
      labToAssign = labId;
    } else if (user.role === "Lab Admin") {
      labToAssign = user.labId; 
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const newCollection = new Collection({
      name,
      description,
      price,
      rating,
      collectionType,
      createdBy: user._id,
      lab: labToAssign, 
    });

    await newCollection.save();

    await Lab.findByIdAndUpdate(
      labToAssign,
      { $push: { tests: newCollection._id } }, 
      { new: true }
    );

    res.status(201).json({ message: "Collection added successfully!", collection: newCollection });
  } catch (error) {
    res.status(500).json({ message: "Error adding collection", error: error.message });
  }
};


//Update a test/package (Super Admin for any, Lab Admin for their own)
export const updateCollection = async (req, res) => {
  try {
    const { name, isPackage, description, price, includes } = req.body;
    const user = req.user;
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Validate Lab Admin ownership
    if (user.role === "Lab Admin" && collection.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this collection" });
    }

    // Update only provided fields
    if (name) collection.name = name;
    if (description) collection.description = description;
    if (price) collection.price = price;
    if (typeof isPackage !== "undefined") collection.isPackage = isPackage;
    if (isPackage && includes) collection.includes = includes;

    await collection.save();
    res.status(200).json({ message: "Collection updated successfully", collection });
  } catch (error) {
    res.status(500).json({ message: "Error updating collection", error: error.message });
  }
};

//Delete a test/package (Super Admin for any, Lab Admin for their own)
export const deleteCollection = async (req, res) => {
  try {
    const user = req.user;
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Validate Lab Admin ownership
    if (user.role === "Lab Admin" && collection.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this collection" });
    }

    await collection.deleteOne();
    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting collection", error: error.message });
  }
};


// Get all collections (Super Admin sees all, Lab Admin sees their own)
export const getCollections = async (req, res) => {
  try {
    const filter = req.user.role === "Super Admin" ? {} : { createdBy: req.user._id };
    const collections = await Collection.find(filter).populate("offeredBy");
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching collections", error: error.message });
  }
};


// Get a specific collection (Test/Package) by ID
export const getSpecificCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).populate("offeredBy");
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: "Error fetching collection", error: error.message });
  }
};



