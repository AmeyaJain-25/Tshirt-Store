const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
} = require("../controllers/user.js");
const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
} = require("../controllers/auth.js");

//This is the way to define the parameters. The "userId" is the name or variable name in short for the param.
//This param when called will do a function of getting user data from database using it's Id.
//The getUserById method had an param of 'id', which is going from here as "userId"
router.param("userId", getUserById);

//Get request for User to get the page of user with param "userId" and then get the user method is called.
//Before getting the user data, we check whether the user is signed in and authenticated.
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

//To update route, we need to have a put request and the user should be authenticated and signed in too.
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

//Route for getting user's Purchase list
router.get(
  "/order/user/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);

module.exports = router;
