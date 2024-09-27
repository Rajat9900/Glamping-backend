const express = require('express');
const router = express.Router();
const { googleLogin , updateUserDetails} = require('../controllers/auth');


router.post('/google-login', googleLogin);
router.put('/users/:id', updateUserDetails);

module.exports = router;


