import mongoose from "mongoose";

const labSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    image: {
        type: String, 
        required: false 
    },
    location: {
        type: String, 
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }] 

});

const Lab = mongoose.model("Lab", labSchema);

export default Lab;
