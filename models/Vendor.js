import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }]
});

export default mongoose.model("Vendor", vendorSchema);
