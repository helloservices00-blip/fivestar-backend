router.get("/profile", vendorAuth, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id).select("-password");
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
