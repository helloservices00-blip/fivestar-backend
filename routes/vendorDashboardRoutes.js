router.put("/profile", vendorAuth, async (req, res) => {
  try {
    const updated = await Vendor.findByIdAndUpdate(
      req.vendor.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
