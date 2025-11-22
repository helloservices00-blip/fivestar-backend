import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Dummy response, replace with DB if needed
  if (email === "admin@gmail.com" && password === "123456") {
    return res.json({ success: true, message: "Login successful" });
  }

  res.status(400).json({ success: false, message: "Invalid credentials" });
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  return res.json({ success: true, message: "User Registered", user: { name, email } });
});

export default router;
