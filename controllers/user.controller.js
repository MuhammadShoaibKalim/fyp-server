import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateToken } from "../utils/auth.util.js";

//  User Registration
// const userRegister = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, confirmPassword } = req.body;

//     // Check for missing fields
//     if (!firstName || !firstName || !email || !password || !confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter all fields"
//       });
//     }

//     // Check if password and confirmPassword match
//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Password and confirm password do not match"
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const user = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword
//     });

//     await user.save();
//     res.status(201).json({
//       message: "User registered successfully",
//       user
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Something went wrong",
//       error: error.message
//     });
//   }
// };

//  User Login
// export const userLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     //match password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }


//     const token = generateToken(user);


//     res
//       .status(200)
//       .cookie("accessToken", token, {
//         httpOnly: true,
//         sameSite: "strict",
//         maxAge: 24 * 60 * 60 * 1000
//       })
//       .json({
//         success: true,
//         message: "Login successful",
//         user: {
//           id: user._id,
//           fullName: `${user.firstName} ${user.lastName}`,
//           email: user.email,
//           role: user.role
//         }
//       });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Something went wrong", error: error.message });
//   }
// };
//  Register a new user
// User Registration
export const userRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password and confirm password do not match" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: trimmedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: trimmedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        firstname: newUser.firstName,
        lastname: newUser.lastName,
        email: newUser.email,
      },
      token: generateToken(newUser._id, newUser.email),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// User Login
export const userLogin = async (req, res) => {
  try {
    // console.log("Login Request Body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    

    const isPasswordCorrect = await bcrypt.compare(password.trim(), user.password);
    // console.log(" Password :",isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }


    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id, user.email),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

//  User Logout
export const userLogout = (req, res) => {
  try {
    res.status(200).cookie("accessToken", "", { maxAge: 0 }).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
  }
};

//  Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNo, address, city, state } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email, phoneNo, address, city, state },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Change Password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Refresh Token (Optional)
export const refreshToken = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const newToken = generateToken({ id: decoded.id });

    res.cookie("accessToken", newToken, { httpOnly: true, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({ success: true, token: newToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

//  Delete User Account
export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.clearCookie("accessToken").status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




