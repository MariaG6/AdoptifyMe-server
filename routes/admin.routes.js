const express = require("express");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const isAdminCheckMiddleware = require("../middleware/isAdmin.middleware");
const Shop = require("../models/Shop.model");
const Pet = require("../models/Pet.model");
const Questionnaire = require("../models/Questionnaire.model");
const router = express.Router();

// get all admins
router.get(
  "/",
  isAuthenticated,
  isAdminCheckMiddleware,
  async (req, res, next) => {
    try {
      const admins = await User.find({ isAdmin: true });
      res.status(200).json(admins);
    } catch (err) {
      next(err);
    }
  }
);

// gets all pets
router.get(
  "/pets",
  isAuthenticated,
  isAdminCheckMiddleware,
  async (req, res, next) => {
    try {
      const pets = await Pet.find().populate(["shop", "owner"]);
      res.status(200).json(pets);
    } catch (err) {
      next(err);
    }
  }
);

//   gets all users
router.get(
  "/users",
  isAuthenticated,
  isAdminCheckMiddleware,
  async (req, res, next) => {
    try {
      const users = await User.find({ isAdmin: false }).populate([
        "adoptedPets",
        "reportedPets",
      ]);
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
);

//   gets all shops
router.get(
  "/shops",
  isAuthenticated,
  isAdminCheckMiddleware,
  async (req, res, next) => {
    try {
      const shops = await Shop.find().populate(["pets", "owner"]);
      res.status(200).json(shops);
    } catch (err) {
      next(err);
    }
  }
);

// creates new admin
// router.get(
//   "/create-admin",
//   isAuthenticated,
//   isAdminCheckMiddleware,
//   (req, res, next) => {
//     res.status(201).json("All good in here");
//   }
// );

// delete admin by id
router.delete(
  "/:id",
  isAuthenticated,
  isAdminCheckMiddleware,
  async (req, res, next) => {
    try {
      const admin = await User.findByIdAndDelete(req.params.id);
      if (!admin) {
        return res.status(404).json({ error: "User does not exist" });
      }
      res.status(204).json({ message: "User deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

// update admin info
router.patch(
  "/:id",
  isAuthenticated,
  isAdminCheckMiddleware,
  async (req, res, next) => {
    const { fullName, phoneNumber, address } = req.body;
    try {
      const updatedAdmin = await User.findByIdAndUpdate(
        req.params.id,
        { fullName, phoneNumber, address },
        {
          new: true,
        }
      );
      if (!updatedAdmin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      const dataToReturn = updatedAdmin.toJSON();

      delete dataToReturn.hashedPassword;

      res.status(201).json(dataToReturn);
    } catch (err) {
      next(err);
    }
  }
);

// get admin by id
router.get(
  "/:id",
  isAuthenticated,
  isAdminCheckMiddleware,
  async (req, res, next) => {
    try {
      const admin = await User.findById(req.params.id);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      const dataToReturn = admin.toJSON();

      delete dataToReturn.hashedPassword;

      res.status(201).json(dataToReturn);
    } catch (err) {
      next(err);
    }
  }
);

// reset users password
router.patch(
  "/reset-user-password",
  isAuthenticated,
  isAdminCheckMiddleware,
  async (req, res, next) => {
    const { email, newPassword } = req.body;

    try {
      // Check if email or password or name are provided as empty strings
      if (email === "" || newPassword === "") {
        res
          .status(400)
          .json({ message: "Provide email and new password of user" });
        return;
      }

      // This regular expression check that the email is of a valid format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Provide a valid email address." });
        return;
      }

      // This regular expression checks password for special characters and minimum length
      const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if (!passwordRegex.test(password)) {
        res.status(400).json({
          message:
            "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
        });
        return;
      }

      const foundUser = await User.find({ email: email });
      if (!foundUser) {
        return res.status(404).json({ error: "User does not exist" });
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(process.env.SALT_ROUNDS);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);

      const updatedUser = await User.findByIdAndUpdate(
        foundUser._id,
        { hashedPassword },
        { new: true }
      );

      const dataToReturn = updatedUser.toJSON();

      delete dataToReturn.hashedPassword;

      res.status(201).json(dataToReturn);
    } catch (err) {
      next(err);
    }
  }
);

// get all questionnaires
router.get(
  "/applications",
  isAuthenticated,
  isAdminCheckMiddleware,
  async (req, res) => {
    try {
      const applications = await Questionnaire.find().populate([
        "pet",
        "shop",
        "user",
      ]);
      res.status(200).json({ applications });
    } catch (err) {
      next(err);
    }
  }
);

// check and add admin
router.get("/check-admin", async (req, res) => {
  try {
    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      return res.status(200).json({ message: "Admin already exists" });
    }

    // If email is unique, proceed to hash the password
    const salt = bcrypt.genSaltSync(process.env.SALT_ROUNDS);
    const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, salt);

    await User.create({
      email: process.env.ADMIN_EMAIL,
      hashedPassword,
      fullName: process.env.ADMIN_FULLNAME,
      phoneNumber: process.env.ADMIN_PHONE,
      address: process.env.ADMIN_EMAIL,
      isAdmin: true,
    });

    res.status(201).json({ message: "Admin added successfully!" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
