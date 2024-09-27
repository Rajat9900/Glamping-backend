require("dotenv").config()
const connectDb = require("./database/connect")
const Product = require("./models/product")
const ProductJson = require("./products.json")

const start = async() =>{
  try {
    await connectDb(process.env.MONGODB_URL)
    //for deleting previous data
    await Product.deleteMany()
    await Product.create(ProductJson)
    console.log("success")
  } catch (error) {
    console.log(error)
  }  
}
start()