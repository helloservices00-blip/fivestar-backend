import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", default: null },
  price: { type: Number, required: true },
  variants: [{ type: String }]
});

export default mongoose.model("Product", productSchema);
