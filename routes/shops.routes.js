const checkShopOwner = require("../middleware/isShopOwner.middleware");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Questionnaire = require("../models/Questionnaire.model");
const Shop = require("../models/Shop.model");
const User = require("../models/User.model");
const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
const Pet = require("../models/Pet.model");

//POST

// Create a new shop
router.post(
  "/new",
  isAuthenticated,
  fileUploader.single("shopLogo"),
  async (req, res, next) => {
    try {
      const { shopName, website, location } = req.body;
      const newShop = await Shop.create({
        shopName,
        website,
        location,
        shopLogo: req.file.path,
        owner: req.payload._id,
      });

      res.status(201).json({
        message: "A new shop was successfully created",
        data: newShop,
      });
    } catch (err) {
      next(err);
    }
  }
);

// add pet to a shop
router.post(
  "/:shopId/pets/new",
  isAuthenticated,
  fileUploader.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "images" },
  ]),
  async (req, res, next) => {
    try {
      const { shopId } = req.params;
      const {
        typeOfAnimal,
        age,
        size,
        name,
        gender,
        isReported,
        description,
        breed,
      } = req.body;

      // Find the shop by ID to assign the pet
      const shop = await Shop.findById(shopId);

      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      // Create a new pet
      const newPet = await Pet.create({
        typeOfAnimal,
        age,
        size,
        breed,
        name,
        gender,
        isReported,
        description,
        profilePicture: req.files["profilePicture"][0]?.path,
        images: req.files["images"]?.map((data) => data?.path),
        shop: shop._id,
      });

      shop.pets.push(newPet._id);
      await shop.save();

      res.status(201).json({
        message: `A new pet was successfully added ${shop.shopName} shop`,
        data: newPet,
      });
    } catch (err) {
      next(err);
    }
  }
);

//GET
// Get all shops
router.get("/allShops", async (req, res, next) => {
  try {
    const allShops = await Shop.find();
    res.json(allShops);
  } catch (err) {
    next(err);
  }
});

// Get a specific shop by ID
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const oneShop = await Shop.findById(id).populate(["pets"]);
    if (!oneShop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.json(oneShop);
  } catch (err) {
    res.json(err);
  }
});

// Get shops by owner (user)
router.get("/user/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const userShops = await Shop.find({ owner: userId });

    if (userShops.length === 0) {
      return res.status(404).json({ message: "User has no shops" });
    }

    res.json(userShops);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//PUT
// Update a shop by ID
router.patch(
  "/:id",
  isAuthenticated,
  fileUploader.single("shopLogo"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { shopName, website } = req.body;

      const shopLogo = req.file?.path ?? req.body.shopLogo;

      const updatedShop = await Shop.findByIdAndUpdate(id, {
        shopName,
        website,
        shopLogo,
      });
      if (!updatedShop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      res.status(200).json({
        message: "Shop updated",
        data: updatedShop,
      });
    } catch (err) {
      next(err);
    }
  }
);

//DELETE

// Delete a shop by ID
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedShop = await Shop.findByIdAndDelete(id);
    if (!deletedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json({
      message: "Shop deleted",
    });
  } catch (err) {
    next(err);
  }
});

// Questionnaries routes

// Get all the questionnaries of a shop
router.get(
  "/:id/questionnaries",
  isAuthenticated,
  checkShopOwner,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const allQuestionnaries = await Questionnaire.find({ shop: id }).populate(
        ["shop", "pet", "user"]
      );
      res.json(allQuestionnaries);
    } catch (err) {
      next(err);
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
      const questionnarie = await Questionnaire.findById(
        questionnarieId
      ).populate(["pet", "shop", "user"]);
      if (!questionnarieId) {
        return res.status(404).json({ message: "Questionnaire not found" });
      }

      console.log(questionnarie);

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
      if (!questionnarie) {
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
