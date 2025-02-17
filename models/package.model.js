import mongoose from "mongoose";



const packageSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
      },
      tests: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Test",
        },
      ],
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
      },
      isActive: {
        type: Boolean,
        default: true,
      },
     lab: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Lab", 
      required: true },
    },
    { timestamps: true }
  );
  
  
  const Package = mongoose.model("Package", packageSchema);
  export default Package;
