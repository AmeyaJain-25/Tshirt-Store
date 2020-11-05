const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  getCategory,
  getAllCategory,
  createCategory,
  updateCategory,
  removeCategory,
} = require("../controllers/category.js");
const {
  isAuthenticated,
  isAdmin,
  isSignedIn,
} = require("../controllers/auth.js");
const { getUserById } = require("../controllers/user.js");

//PARAMS
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//Creating Category in DB
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

//Get Category from body
router.get("/category/:categoryId", getCategory);
//Get all the categories from DB
router.get("/categories", getAllCategory);

//Update a category
router.put(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

//Delete a category
router.delete(
  "/category/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
