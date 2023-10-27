const express = require("express");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");

// Update user by id
router.patch(
  "/:id",
  isAuthenticated,
  fileUploader.single("profilePicture"),
  async (req, res, next) => {
    const { fullName, phoneNumber, address } = req.body;

    const profilePicture = req.file?.path || req.body.profilePicture;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { fullName, phoneNumber, address, profilePicture },
        {
          new: true,
        }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const dataToReturn = updatedUser.toJSON();

      delete dataToReturn.hashedPassword;

      res.status(201).json({ message: "Profile Updated!", data: dataToReturn });
    } catch (err) {
      next(err);
    }
  }
);

// Delete user by id
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

// Get user by id
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
