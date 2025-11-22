import jwt from "jsonwebtoken";

export const vendorAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token. Unauthorized." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.vendor = decoded; // now vendor id is accessible
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

