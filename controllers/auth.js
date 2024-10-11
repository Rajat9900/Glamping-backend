const User = require('../models/user');

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
  const { email, password } = req.body;

  try {
    let user = await findUserByEmail(email);

    if (user) {
      if (user.password) {
        // Handle email/password login
        return res.status(200).json({ message: 'User already exists', user, redirect: 'mainHomepage' });
      } else {
        return res.status(400).json({ message: 'This email is registered via Google. Please log in with Google.' });
      }
    } else {
      // Create a new user
      user = await createNewUser({ email, password });
      return res.status(201).json({ message: 'New user created, please fill in your other signup details', user, redirect: 'signupdetails' });
    }
  } catch (error) {
    return error.code === 11000 ? handleDuplicateError(res, error) : handleServerError(res, error);
  }
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
  const { email, password, firstName, lastName } = req.body;

  try {
    let user = await findUserByEmail(email);

    if (user) {
      return res.status(400).json({ message: 'User already exists. Please log in.' ,redirect: 'loginPage' });
    }

    const newUser = await createNewUser({ email, password, firstName, lastName });
    return res.status(201).json({ message: 'User created successfully. Please complete your signup.', user: newUser  });
  } catch (error) {
    return error.code === 11000 ? handleDuplicateError(res, error) : handleServerError(res, error);
  }
};

module.exports = { googleLogin, emailSignup, updateUserDetails, eMailLogin };


