const express = require('express')
const router = express.Router()
const verifyToken = require("../middleWare/authMiddleWare")
const authorizeRoles = require("../middleWare/roleMiddleware")

//only admin can access this route
router.get("/admin" ,verifyToken , authorizeRoles("admin"), (req,res) => {
    res.json({message: "Welcome Admin"})
})

//only admin and manager can access this route
router.get("/manager" ,verifyToken, authorizeRoles("admin" ,"manager" ), (req,res) => {
    res.json({message: "Welcome /manager"})
})

//all can access this route
router.get("/user" ,verifyToken,  authorizeRoles("admin" ,"manager", "user"),(req,res) => {
    res.json({message: "Welcome User"})
})

module.exports = router;