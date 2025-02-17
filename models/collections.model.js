import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    image: {
      type: String,
      default: null, 
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    offeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab", 
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    feedback: {
      type: [String], 
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    bookedCount: {
      type: Number,
      default: 0, 
    },
    description: {
      type: String,
      default: null, 
    },
    isPackage: {
      type: Boolean,
      default: false, 
    },
    includes: {
      type: [String], 
      default: [],
    },
  },
  { timestamps: true }
);

const Collection = mongoose.model("Collection", CollectionSchema);
export default Collection;

