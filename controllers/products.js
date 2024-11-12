const Product = require('../models/product')
const mongoDB = require('mongoose')

const getALLProducts = async (req ,res) => {
    const {rating , title} = req.query
    const queryObject = {}
    if(rating){
        queryObject.rating = rating;
    }
    if(title){
        queryObject.title = {$regex: title , $options: "i"}
    }

    const myData = await Product.find(queryObject)
    res.status(200).json({myData})
}
const getParticularPProducts = async (req ,res) => {
    Product.findById(req.params.id)
    .then(result => {
        res.status(200).json({student: result})
    })
    .catch(err =>{
        res.status(500).json({error: err})  
    })
}
    
const addProducts = async (req , res) => {
    Product.insertMany(req.body)
    .then(result => {
        res.status(200).json({ update: result})
    })
    .catch(err => {
        res.status(500).json({error : err})    
    })
}
const updateProducts = async (req, res) =>{
   Product.updateOne(
    {_id: req.params.id},
    {$set: req.body}
   )
   .then(result =>{
    res.status(200).json({updateDataResult : result})    
   })
    .catch(err => {
        res.status(500).json({error : err})    
    })
}
const deleteProducts = async(req, res)=>{
Product.deleteOne({_id: new mongoDB.Types.ObjectId(req.params.id)})
.then(result =>{
 res.status(200).json({ delete : `${result} product deleted`})
})
.catch(err => {
    res.status(500).json({error : err})   
})
}

module.exports = {getALLProducts , getParticularPProducts ,addProducts,updateProducts,deleteProducts}