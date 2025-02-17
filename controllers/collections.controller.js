import Collection from "../models/collections.model.js";


export const addCollection = async (req, res) => {
  try {
    const { name, status, image, price, offeredBy, description, isPackage, includes } = req.body;
    if (!name || !price || !offeredBy) {
      return res.status(400).json({ message: "Name, price, and offeredBy are required" });
    }
    
    const newCollection = await Collection.create({
      name,
      status,
      image,
      price,
      offeredBy,
      createdBy: req.user._id,  
      description,
      isPackage,
      includes,
    });

    res.status(201).json({ message: "Collection created successfully", collection: newCollection });
  } catch (error) {
    console.error("Error creating collection:", error.message); 
    res.status(500).json({ message: "Error creating collection", error: error.message });
  }
};

//Get all collections (tests and packages)
export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().populate("offeredBy createdBy", "name email");
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching collections", error: error.message });
  }
};

//Get a specific collection by ID
export const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findById(id).populate("offeredBy createdBy", "name email");

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: "Error fetching collection", error: error.message });
  }
};

//Update a specific collection by ID
export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, image, price, description, isPackage, includes } = req.body;

    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      { name, status, image, price, description, isPackage, includes },
      { new: true }
    );

    if (!updatedCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json({ message: "Collection updated successfully", collection: updatedCollection });
  } catch (error) {
    res.status(500).json({ message: "Error updating collection", error: error.message });
  }
};


// Delete a specific collection by ID
export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCollection = await Collection.findByIdAndDelete(id);

    if (!deletedCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json({ message: "Collection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting collection", error: error.message });
  }
};
