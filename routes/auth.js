const express = require('express');
const router = express.Router();
const { googleLogin ,emailSignup , updateUserDetails, eMailLogin,forgotPassword, resetPassword} = require('../controllers/auth');


router.post('/google-login', googleLogin);
router.put('/users/:id', updateUserDetails);
router.post('/emailLogin' , eMailLogin)
router.post('/emailSignup' , emailSignup)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;


