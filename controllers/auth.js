const User = require('../models/user');

const googleLogin = async (req, res) => {
  const { email, firstName, lastName } = req.body;

  try {

    let user = await User.findOne({ email });

    if (user) {
   
      return res.status(200).json({ message: 'User exists', user, redirect: 'mainHomepage' });
    } else {

      const userName = firstName ? firstName.toLowerCase() + Math.floor(Math.random() * 1000) : "user" + Math.floor(Math.random() * 1000);

      user = new User({
        email,
        firstName: firstName || "",
        lastName: lastName || "",
        userName: userName, 
        dateOfBirth: "" 
      });

      await user.save();
      return res.status(201).json({ message: 'New user created, please fill out your details', user, redirect: 'signupdetails' });
    }
  } catch (error) {
    if (error.code === 11000) {
      // Handle unique constraint error
      return res.status(400).json({
        message: 'UserName already exists, please choose another',
        error
      });
    }
    console.log(error);
    return res.status(500).json({ message: 'Server error', error });
  }
};


const updateUserDetails = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, dateOfBirth, email } = req.body;

  try {
    let user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.dateOfBirth = dateOfBirth;
    user.email = email;

    await user.save();
    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error updating user details', error });
  }
};

module.exports = { googleLogin, updateUserDetails };
