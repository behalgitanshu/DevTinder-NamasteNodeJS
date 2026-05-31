const adminAuth = (req, res, next) => {
  const token = "ABC";
  if (req.body?.token !== token) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "ABC";
  if (req.body?.token !== token) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };