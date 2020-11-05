const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product.js");
const {
  isAuthenticated,
  isAdmin,
  isSignedIn,
} = require("../controllers/auth.js");
const { getUserById } = require("../controllers/user.js");

//PARAMS
router.param("userId", getUserById);
router.param("productId", getProductById);

//Creating Product
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

//Get Product:
//Get Product details
router.get("/product/:productId", getProduct);
//Get Product's Photo
router.get("/product/photo/:productId", photo);

//Delete Product
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

//Update Product
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//Listing Product(Getting products on Home Page)
router.get("/products", getAllProducts);

//Get All the Unique Categories
router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
