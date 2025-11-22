import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  module: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Module", 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
