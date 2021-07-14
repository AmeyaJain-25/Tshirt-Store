require("dotenv").config(); //Using ENV
//Connecting to the Database
const mongoose = require("mongoose");
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); //Helps to put or delete values in cookie
const cors = require("cors");

//Importing Routes
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
const categoryRoutes = require("./routes/category.js");
const productRoutes = require("./routes/product.js");
const orderRoutes = require("./routes/order.js");

//-----------------
//MIDDLEWARES

//app.use helps to use those as a middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//------------------
//ROUTES

//As we will be changing or handling routes and data with API's, hence for each route, we will be writing
//'/api' before each route
//This is the Basic route middleware for all the route
//All routes will come from auth.js and will be prefixed with /api
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

//------------------
//DATABASE CONNECTION
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED"); //Message for succesful connection of database only after its connected
  })
  .catch(() => {
    console.log("OOOOOOOPPS DB DISCONNECTED");
  });

//------------------
//PORT
const port = process.env.PORT || 8000; //For keeping secure.  //Take port value from environment OR(||) Take default as 8000

//------------------
//STARTING A SERVER
app.listen(port, () => console.log(`App is Running at ${port}`));
