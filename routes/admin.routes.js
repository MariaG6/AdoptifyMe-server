const express = require("express");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const isAdminCheckMiddleware = require("../middleware/isAdmin.middleware");
const Shop = require("../models/Shop.model");
const Pet = require("../models/Pet.model");
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
router.get(
  "/create-admin",
  isAuthenticated,
  isAdminCheckMiddleware,
  (req, res, next) => {
    res.status(201).json("All good in here");
  }
);

// delete admin by id
router.delete(
  "/:id",
  isAuthenticated,
  isAdminCheckMiddleware,
  async (req, res, next) => {
    try {
      const admin = await User.findByIdAndDelete(req.params.id);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      res.status(204).json({ message: "Admin deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

// update admin info
router.put(
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
      res.status(201).json(updatedAdmin);
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

      delete admin.hashedPassword;

      res.status(201).json(admin);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
