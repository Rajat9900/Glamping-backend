const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
// const transporter = require('../config/nodemailer')

const JWT_SECRET = process.env.JWT_SECRET;
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createNewUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const user = new User(userData);
  await user.save();
  return user;
};

const handleServerError = (res, error) => {
  console.log(error);
  return res.status(500).json({ message: "Server error", error });
};

const handleDuplicateError = (res, error) => {
  return res
    .status(400)
    .json({ message: "UserName already exists, please choose another", error });
};

const eMailLogin = async (req, res) => {
  // const { email, password,activeUser } = req.body;
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email ${email} not found` });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid cridentail" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({user, token , redirect: "mainHomepage" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Google Login Function
const googleLogin = async (req, res) => {
  const { email, firstName, lastName } = req.body;

  try {
    let user = await findUserByEmail(email);

    if (user) {
      if (user.password) {
        return res.status(400).json({
          message: "This email is registered with email/password. Please log in with email and password.",
        });
      }
      return res
        .status(200)
        .json({ message: "User exists", user, redirect: "mainHomepage" });
    } else {
   
      const userData = {
        
        firstName: firstName || "",
        lastName: lastName || "",
        dateOfBirth: "",
        email,
      };
      try {
       let creatuser =  await createNewUser(userData); 
        return res.status(201).json({
          message: "New user created, please fill out your details",
          // redirect: "signupdetails",
          creatuser
        });
      } catch (error) {
        if (error.message === "User with this email already exists") {
          return res.status(400).json({ 
            message: "Email already registered, please log in or reset password",
            redirect: "login"
          });
        }
        throw error;
      }
    }
  } catch (error) {
    return handleDuplicateError(res, error);
  }
};

// Update User Details Function
const updateUserDetails = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, dateOfBirth, email } = req.body;

  try {
    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only if fields are provided
    const updatedFields = {};
    if (firstName) updatedFields.firstName = firstName;
    if (lastName) updatedFields.lastName = lastName;
    if (dateOfBirth) updatedFields.dateOfBirth = dateOfBirth;
    if (email) updatedFields.email = email;

    Object.assign(user, updatedFields);
    
    try {
      await user.save();
      res.status(200).json({ 
        message: "User updated successfully", 
        user,
        redirect: "mainHomepage"
      });
    } catch (saveError) {
      console.error("Error saving user update:", saveError);
      res.status(500).json({ message: "Failed to save user updates", error: saveError.message });
    }
  } catch (error) {
    console.error("Unexpected error updating user:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


const emailSignup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email, password  are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });

    try {
      await newUser.save();
      res.status(201).json({ message: `User registered with email ${email} ` , newUser });
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      res
        .status(500)
        .json({ message: "Failed to save user", error: saveError.message });
    }
  } catch (err) {
    console.error("Unexpected error in emailSignup:", err);
    res
      .status(500)
      .json({ message: "SOmething went wrong", error: err.message });
  }
};

// let testAccount = nodemailer.createTestAccount()
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  // service: "gmail",
  auth: {
    user: "verlie.bartoletti@ethereal.email",
    pass: "9CtGb5CgGbzMHQEcmf",
  },
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();
    console.log("Saved User with Token:", user);
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Ranjana Kralta" <ranjna@gmail.com"`,
      to: user.email,
      to: "ranjana.codeskape@gmail.com",
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error("Error during password reset", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token", decodedToken);
    const user = await User.findOne({
      _id: decodedToken.userId,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      // console.log("No user found with matching resetToken or token expired");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Error resetting password", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  googleLogin,
  emailSignup,
  updateUserDetails,
  eMailLogin,
  forgotPassword,
  resetPassword,
};
