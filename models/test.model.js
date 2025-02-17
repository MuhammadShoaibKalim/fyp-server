import mongoose from "mongoose";

// Test Model
const testSchema = new mongoose.Schema(
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
      bookedCount: {
        type: Number,
        default: 0,
      },
      feedbacks: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          review: {
            type: String,
            trim: true,
          },
          rating: {
            type: Number,
            min: 1,
            max: 5,
          },
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
      bookingDetails: {
        date: {
          type: Date,
          default: null,
        },
        time: {
          type: String,
          trim: true,
        },
      },
      lab: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Lab", 
        required: true 
      },
      
    },
    { timestamps: true }
  );
  



  const Test = mongoose.model("Test", testSchema);
  export default Test;
