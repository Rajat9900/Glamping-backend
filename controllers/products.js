const Product = require('../models/product')


const getALLProducts = async (req ,res) => {
    const {rating , title} = req.query
    const queryObject = {}
    if(rating){
        queryObject.rating = rating;
    }
    if(title){
        queryObject.title = {$regex: title , $options: "i"}
// queryObject.title = title
    }
    //you can find any key by paasing find  method provided by mongodb
    // const myData = await Product.find({rating: 4.3})
    //we can also fine the data by pading req.query 
    const myData = await Product.find(queryObject)
    res.status(200).json({myData})
}
const getALLProductsTesting = async (req ,res) => {
    res.status(200).json({msg: "I am getAllProductsTesting"})
}

module.exports = {getALLProducts , getALLProductsTesting}