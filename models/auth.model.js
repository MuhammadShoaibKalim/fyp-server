import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
      match: [/^[a-zA-Z\s'-]+$/, "Please provide a valid first name"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
      match: [/^[a-zA-Z\s'-]+$/, "Please provide a valid last name"],
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },
    city: {
      type: String,
      trim: true,
      default: null,
    },
    state: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phoneNo: {
      type: String,
      match: [/^\d{10,15}$/, "Please provide a valid phone number"],
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "labAdmin", "superAdmin"],
      default: "user",
    },
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      default: null,
    },
    test_name: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

//hashed password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    console.log("Generated Salt:", salt);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Hashed Password:", this.password);
    next();
  } catch (error) {
    next(error);
  }
});


//Matched user entered password to hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
