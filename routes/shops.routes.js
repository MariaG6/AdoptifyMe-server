const checkShopOwner = require("../middleware/isShopOwner.middleware");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Pet = require("../models/Pet.model");
const Questionnaire = require("../models/Questionnaire.model");
const Shop = require("../models/Shop.model");
const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
let fileURL;

//POST

// Create a new shop
router.post(
  "/new",
  isAuthenticated,
  fileUploader.single("shopLogo"),
  async (req, res) => {
    // Check if shopLogo exits, if not add default image
    if (!shopLogo) {
      fileURL =
        "https://img.freepik.com/free-photo/image-icon-front-side-white-background_187299-40166.jpg?w=740&t=st=1697111573~exp=1697112173~hmac=e548437457784e86b30facfb1354d67713af48795a5e947c031295e863870727";
    } else {
      fileURL = req.file.path;
    }

    try {
      const { shopName, website, pets, owner } = req.body;
      const newShop = await Shop.create({
        shopName,
        website,
        shopLogo: fileURL,
        pets,
        owner,
      });
      res.status(200).json({
        message: "A new shop was successfully created",
        data: newShop,
      });
    } catch (err) {
      res.json(err);
    }
  }
);

//GET

// Get all shops
router.get("/allShops", isAuthenticated, async (req, res) => {
  try {
    const allShops = await Shop.find();
    res.json(allShops);
  } catch (err) {
    res.json(err);
  }
});

// Get a specific shop by ID
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const oneShop = await Shop.findById(id);
    if (!oneShop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.json(oneShop);
  } catch (err) {
    res.json(err);
  }
});

//PUT

// Update a shop by ID
router.put(
  "/:id",
  isAuthenticated,
  fileUploader.single("shopLogo"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { shopName, website, pets } = req.body;
      const updatedShop = await Shop.findByIdAndUpdate(id, {
        shopName,
        website,
        shopLogo: req.file.path,
        pets,
      });
      if (!updatedShop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.status(200).json({
        message: "Shop updated",
        data: updatedShop,
      });
    } catch (err) {
      res.json(err);
    }
  }
);

//DELETE

// Delete a shop by ID
router.delete("/:id", isAuthenticated, (req, res) => {
  try {
    const { id } = req.params;
    const deletedShop = Shop.findByIdAndDelete(id);
    if (!deletedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.status(200).json({
      message: "Shop deleted",
    });
  } catch (err) {
    res.json(err);
  }
});

// Questionnaries routes

// Get all the questionnaries of a shop
router.get(
  "/:id/questionnaries",
  isAuthenticated,
  checkShopOwner,
  async (req, res) => {
    try {
      const allQuestionnaries = await Questionnaire.find({ shop: id });
      res.json(allQuestionnaries);
    } catch (err) {
      res.json(err);
    }
  }
);

// Get one questionnarie by ID
router.get(
  "/:id/questionnaries/:questionnarieId",
  isAuthenticated,
  checkShopOwner,
  async (req, res) => {
    const { questionnarieId } = req.params;
    try {
      const questionnarie = await Questionnaire.findById(questionnarieId);
      if (!questionnarieId) {
        return res.status(404).json({ message: "Questionnaire not found" });
      }
      res.json(questionnarie);
    } catch (err) {
      res.json(err);
    }
  }
);

// Put to accept the application
router.put(
  "/:id/questionnaries/:questionnarieId/accept",
  isAuthenticated,
  checkShopOwner,
  async (req, res) => {
    const { questionnarieId } = req.params;
    try {
      const questionnarie = await Questionnaire.findById(questionnarieId);
      if (!questionnarieId) {
        return res.status(404).json({ message: "Questionnaire not found" });
      }
      questionnarie.pet.isAdopted = true;
      questionnarie.isAccepted = true;
      res
        .status(200)
        .json({ message: "Application to adopt accepted successfully" });
    } catch (err) {
      res.json(err);
    }
  }
);

// Put to reject the application

router.put(
  "/:id/questionnaries/:questionnarieId/reject",
  isAuthenticated,
  checkShopOwner,
  async (req, res) => {
    const { questionnarieId } = req.params;
    try {
      const questionnarie = await Questionnaire.findById(questionnarieId);
      if (!questionnarieId) {
        return res.status(404).json({ message: "Questionnaire not found" });
      }
      res
        .status(200)
        .json({ message: "Application to adopt rejected successfully" });
    } catch (err) {
      res.json(err);
    }
  }
);

module.exports = router;
