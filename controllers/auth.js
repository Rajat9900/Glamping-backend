const User = require('../models/user');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createNewUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

const handleServerError = (res, error) => {
  console.log(error);
  return res.status(500).json({ message: 'Server error', error });
};

const handleDuplicateError = (res, error) => {
  return res.status(400).json({ message: 'UserName already exists, please choose another', error });
};

const eMailLogin = async (req, res) => {
  // const { email, password,activeUser } = req.body;
  try {
    const {email , password} = req.body
    const user = await User.findOne({email})
    if(!user){
      return res.status(404).json({message:`User with email ${email} not found`})
    }
    const isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch){
      return res.status(400).json({message:"invalid cridentail"})
    }
    const token = jwt.sign(
      {id: user._id, role: user.role},
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    )
    res.status(200).json({token})
  } catch (error) {
    res.status(500).json({message:"Something went wrong"})
  }

  // try {
  //   let user = await findUserByEmail(email);
  //   if (user) {
  //     if (user.email) {
  //    return res.status(200).json({ message: 'User already exists', user, redirect: 'mainHomepage' });

  //     }
  //   } else {
  //     user = await createNewUser({ email, password });
  //     return res.status(201).json({ message: 'New user created, please fill in your other signup details', user, redirect: 'signupdetails' });
  //   }

  //   const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

  //   res.status(200).json({ message: "Login successful", token });
  // } catch (error) {
  //   return error.code === 11000 ? handleDuplicateError(res, error) : handleServerError(res, error);
  // }
};

// Google Login Function
const googleLogin = async (req, res) => {
  const { email, firstName, lastName } = req.body;

  try {
    let user = await findUserByEmail(email);

    if (user) {
      if (user.password) {
        return res.status(400).json({ message: 'This email is registered with email/password. Please log in with email and password.' });
      }
      return res.status(200).json({ message: 'User exists', user, redirect: 'mainHomepage' });
    } else {
      const userData = { firstName: firstName || "", lastName: lastName || "", dateOfBirth: "", email };
      user = await createNewUser(userData); // No password for Google login users
      return res.status(201).json({ message: 'New user created, please fill out your details', user, redirect: 'signupdetails' });
    }
  } catch (error) {
    return error.code === 11000 ? handleDuplicateError(res, error) : handleServerError(res, error);
  }
};

// Update User Details Function
const updateUserDetails = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, dateOfBirth, email } = req.body;

  try {
    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.assign(user, { firstName, lastName, dateOfBirth, email });
    await user.save();

    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    return handleServerError(res, error);
  }
};

// Email Signup Function
const emailSignup = async (req, res) => {
  try{
  const { email, password, role} = req.body;
  const hashedPassword =  await bcrypt.hash(password , 10)
  const newUser = new User({email , password:hashedPassword , role})
  await newUser.save()
  res.status(201).json({message: `User registered with email ${email}`}) 
  } catch(err){
    res.status(500).json({message: "SOmething went wrong"})
  }

//   try {
//     let user = await findUserByEmail(email);

//     if (user) {
//       return res.status(400).json({ message: 'User already exists. Please log in.' ,redirect: 'loginPage' });
//     }
// else{
//     const newUser = await createNewUser({ email, password, firstName, lastName });
//     return res.status(201).json({ message: 'User created successfully. Please complete your signup.', user: newUser  });
// }
// const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

// res.status(200).json({ message: "Login successful", token });
//   } catch (error) {
//     return error.code === 11000 ? handleDuplicateError(res, error) : handleServerError(res, error);
//   }
};

module.exports = { googleLogin, emailSignup, updateUserDetails, eMailLogin };





// register: async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
    
//     if (user) {
//       return res.json(
//         helper.showValidationErrorResponse("User Alredy exist")
//       );
//     }

//     const addUserData = await createUser(req.body)
//     console.log(addUserData)
//     return res.json(
//       helper.showSuccessResponse("User added successfully.")
//     );

//   } catch (error) {
//     console.log(error);
//     return res.json(
//       helper.showInternalServerErrorResponse("Internal server error")
//     );
//   }
// },

// // send otp after login
// const login = (req, res) => {
//   try {
//     const userRecord = await User.findOne({
//       email: req.body.email
//     });
//     if (!userRecord) {
//       return res.json(helper.showValidationErrorResponse("User not found."));
//     }
//     // Generate token
//     const token = generateToken(userRecord);
//     // Return success response with token
//     return res.json(
//       helper.showSuccessResponse("User fetched successfully", token)
//     );
//   } catch (error) {
//     console.error(error);
//     return res.json(
//       helper.showInternalServerErrorResponse("Internal server error")
//     );
//   }
// }
