import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
});

export default mongoose.model("Category", categorySchema);
