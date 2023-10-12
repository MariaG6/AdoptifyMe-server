const express = require("express");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");

// update user by id
router.patch(
  "/:id",
  isAuthenticated,
  fileUploader.single("profilePicture"),
  async (req, res, next) => {
    const { fullName, phoneNumber, address } = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { fullName, phoneNumber, address, profilePicture: req.file.path },
        {
          new: true,
        }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "Admin not found" });
      }

      const dataToReturn = updatedUser.toJSON();

      delete dataToReturn.hashedPassword;

      res.status(201).json(dataToReturn);
    } catch (err) {
      next(err);
    }
  }
);

// delete user by id
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }
    res.status(204).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// get user by id
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const dataToReturn = user.toJSON();

    delete dataToReturn.hashedPassword;

    res.status(200).json(dataToReturn);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
