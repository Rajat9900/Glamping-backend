const express = require('express');
const router = express.Router();
const { googleLogin ,emailSignup , updateUserDetails, eMailLogin} = require('../controllers/auth');


router.post('/google-login', googleLogin);
router.put('/users/:id', updateUserDetails);
router.post('/emailLogin' , eMailLogin)
router.post('/emailSignup' , emailSignup)

module.exports = router;


