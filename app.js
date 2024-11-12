require("dotenv").config();
const cors = require('cors');
// app.use(cors({ origin: 'http://localhost:3000' }));
const express = require("express");
const nodemailer = require('nodemailer')
const protectRoutes = require('./routes/protectedRoutes');
const userRoutes = require('./routes/userRoutes')
const app = express();
const connectDb = require("./database/connect");
const authRoutes = require("./routes/auth"); 
const ProductsRoutes =  require("./routes/products") 

app.use(cors());
const PORT = process.env.PORT || 5000;


app.use(express.json());  


app.get("/", (req, res) => {
  res.send("Hello, Welcome to the home page!");
});

app.use("/api", authRoutes); 
app.use("/api/users" , userRoutes) 
app.use("/protected", protectRoutes); 
app.use("/hotels", ProductsRoutes);  

// function sendEmail({recipient_email , OTP}){
//   return new Promise((resolve, reject) =>{
//     let transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.MY_EMAIL,
//         pass: process.env.MY_PASSWORD
//       },
//     });
//     const mail_configs = {
//       form: process.env.MY_EMAIL,
//       to: recipient_email,
//       subject: "Password Recovery Mail",
//       html: `
//       <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title> CodePen - OTP Email Template</title>
// </head>
// <body>
//     <div>
//     <p> The otp is ${OTP}<p>
//     <div>Thankyou for choosing us</div>
// </body>
// </html>
//       `
//     }
//     transporter.sendMail(mail_configs , function (error , info){
//       if(error){
//         console.log(error , "errorMail")
//  return reject({msg: "An Error has occured"})
//       }
//       return resolve ("msg : Email sent succesfully")
//     })
//   })
// }

app.get('/api' , (req,res)=>{
  console.log(process.env.MY_EMAIL)
})
app.post("api/send_recovery_email" , (req,res) =>{
  console.log("recovery api hit ")
  sendEmail(req.body)
  .then((response) => res.send(response.message))
  .catch((error) => res.status(500).send(error.message))
})
const start = async () => {
  try {
    await connectDb(process.env.MONGODB_URL); 
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
