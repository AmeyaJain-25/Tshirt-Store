const Category = require("../models/category.js");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Category not Found in DB",
      });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  //Object of category schema from user details from front end from req.body.
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to Save Category in DB",
      });
    }
    //Send data of category in Body of response
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  //Get that category from body
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "No Category found in DB",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  //Getting the category from body
  const category = req.category;

  //Give the name from body to category variable object.
  category.name = req.body.name;

  //Now save to database with updated name
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update Category",
      });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  //Remove will give two parameters. Error or category which is removed
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete Category",
      });
    }
    res.json({
      message: `Category:  ${category} Succesfull deleted`,
      category,
    });
  });
};
