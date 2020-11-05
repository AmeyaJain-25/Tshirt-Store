const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trime: true,
      required: true,
      maxlength: 32,
    },
    description: {
      type: String,
      trime: true,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      trime: true,
      required: true,
      maxlength: 32,
    },
    //Each product will be associated with some category or such as winter collection,etc
    category: {
      type: ObjectId, //Getting the schema from other schema
      ref: "Category", //reference to schema is Category. //NOTE: Write the name same as there written in exporting the schema
      required: true,
    },
    stock: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer, //Photo for each product is Buffer type
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
