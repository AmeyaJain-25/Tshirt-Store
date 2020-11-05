const Product = require("../models/product.js");

const formidable = require("formidable"); //For accessing data(Photos and all type od data)
const _ = require("lodash"); //For easy JavaScrpt Methods
const fs = require("fs"); //Accessing File Systems in Code
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category") //Popuating the product based on categories. Used for getting product by category
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not Found in DB",
        });
      }
      req.product = product;
      next();
    });
};

//Creating a product
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm(); //Creating the form

  form.keepExtensions = true; //For saying whether the data is in jpg or png, etc

  //Parsing form as an req(incoming message) and callback as 2 parameters.
  //The callback can have 3 parameters: error, fields(name, count, etc), files
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem in Image by creating a Product",
      });
    }

    //Fields
    //All the fields should come while creating a product.
    //So, if any of the fields is not there, then return error.
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "All fields are required. Fill all of them",
      });
    }

    //Creating product's object by getting fields of it from frontend
    let product = new Product(fields);

    //Handling File

    //If there is a file, then check it's size
    if (file.photo) {
      //3*1024*1024 = 3MB =~ 3000000
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is tooooo BIG",
        });
      }
      //If there is no error, then we can save photo to DB

      //Add photo image to product object.
      //Read the path from file coming as a parameter and store it in the data of product in productSchema
      product.photo.data = fs.readFileSync(file.photo.path);
      //Also save the image's type as jpg or png, etc.
      product.photo.contentType = file.photo.type;
    }

    //Saving to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to save product in DB",
        });
      }
      res.json(product);
    });
  });
};

//Get single Product
exports.getProduct = (req, res) => {
  //Don't get photo, as it's large in size and take greater time to load.
  //Get other details, except photo.
  //Photo can be get by another route so as to decrease the slow loading.
  req.product.photo = undefined;
  //Get product details from body
  return res.json(req.product);
};

//Getting photo only
exports.photo = (req, res, next) => {
  //If there is photo data, then only get the photo.
  if (req.product.photo.data) {
    //If there is data, then set the photo in the response.
    //The response will set Content-Type as key and photo's data contentType as value.
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  //Get product detail from request.
  let product = req.product;
  //Delete that product from DB using the details coming from request.
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete Product",
      });
    }
    res.json({
      message: `Product:  ${product} Succesfull deleted`,
      deletedProduct,
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm(); //Creating the form

  form.keepExtensions = true; //For saying whether the data is in jpg or png, etc

  //Parsing form as an req(incoming message) and callback as 2 parameters.
  //The callback can have 3 parameters: error, fields(name, count, etc), files
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem in Image by creating a Product",
      });
    }

    //get the product details, by getting fields of it from frontend
    let product = req.product;

    //Update the product object
    //(field to be updated, the data to be updated)
    //(product is the field where to update, fields is the data object coming from frontend as updated form)
    product = _.extend(product, fields);

    //Handling File

    //If there is a file, then check it's size
    if (file.photo) {
      //3*1024*1024 = 3MB =~ 3000000
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is tooooo BIG",
        });
      }
      //If there is no error, then we can save photo to DB

      //Add photo image to product object.
      //Read the path from file coming as a parameter and store it in the data of product in productSchema
      product.photo.data = fs.readFileSync(file.photo.path);
      //Also save the image's type as jpg or png, etc.
      product.photo.contentType = file.photo.type;
    }

    //Saving to DB
    product.save((err, updatedProduct) => {
      if (err) {
        return res.status(400).json({
          error: "Not able to Update product in DB",
        });
      }
      res.json(updatedProduct);
    });
  });
};

exports.getAllProducts = (req, res) => {
  //Limit is the no of products to be displayed in the list.
  //The value will be coming from the query from frontend.
  //If value is coming from frontend, then take that value, else take default as 8
  let limit = req.query.limit ? parseInt(req.query.limit) : 9;

  //Sort from parameters coming from frontend, or else by the product's id.
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  //Get All the products from DB
  //Don't take  photo's, as it will take time. Photo's can be taken by the middleware photo
  Product.find()
    .select("-photo") //The - sign gives to deselect the photo.
    .populate("category") //Also populate product by category
    .sort([[sortBy, "asc"]]) //It has 2 bracket pair. //"asc" is sort by ascending //Sorting the result based on different parameters. E.g: sort by updated value, or name or etc.
    .limit(limit) //Get only limit no. of products
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No Product found from DB",
        });
      }
      res.json(products);
    });
};

//Get all categories that are availale from the products
exports.getAllUniqueCategories = (req, res) => {
  //Distinct gets all the unique values
  //distinct will take parameters of fields, options and a callback
  //It returns a query according to the callback.
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No Category found from DB",
      });
    }
    res.json(category);
  });
};

//Updating the stock and sold name when the product is purchased.
//This is a middleware
exports.updateStock = (req, res, next) => {
  //Loop through the products in the order or the cart and then  update the stock and sold fpr that product.
  let myOperation = req.body.order.products.map((prod) => {
    //Loop over the products in the order.
    return {
      //Return an object ofupdated part.
      updateOne: {
        filter: { _id: prod._id }, //Filter or find the product in cart by Id.
        update: { $inc: { stock: -prod.count, sold: +prod.count } }, //Update the stock and sold by - & + of count coming from the frontend
      },
    };
  });
  //Write or update the quantities in a bulk.
  //Parameters: operation, options, callback.
  Product.bulkWrite(myOperation, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Blk Operation Failed",
      });
    }
  });
};
