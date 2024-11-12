const express = require('express')
const router = express.Router()
const authMiddleware = require('../');

const {getALLProducts,addProducts, getParticularPProducts,deleteProducts,updateProducts} = require("../controllers/products");
router.route("/").get(getALLProducts)
router.route("/").post(addProducts)
router.route("/:id").get(getParticularPProducts)
router.route("/:id").put(updateProducts)
router.route("/:id").patch(updateProducts)
router.route("/:id").delete(deleteProducts)

module.exports = router;