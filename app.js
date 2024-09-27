require("dotenv").config();
const cors = require('cors');
const express = require("express");
const app = express();
const connectDb = require("./database/connect");
const authRoutes = require("./routes/auth"); 

app.use(cors());
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());  

app.get("/", (req, res) => {
  res.send("Hello, Welcome to the home page!");
});

app.use("/api", authRoutes);  


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
