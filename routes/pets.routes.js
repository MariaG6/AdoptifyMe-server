const { isAuthenticated } = require("../middleware/jwt.middleware");
const Pet = require("../models/Pet.model");
const Questionnaire = require("../models/Questionnaire.model");
const Shop = require("../models/Shop.model");
const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");

//GET
// Get all pets
router.get("/allPets", (req, res) => {
  Pet.find({ isAdopted: false })
    .populate(["shop"])
    .then((allPets) => {
      res.status(200).json(allPets);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Search for pets
router.get("/search", async (req, res, next) => {
  try {
    const { gender, typeOfAnimal, size } = req.query;

    // Create a query object to filter pets
    const query = {};

    if (gender) {
      query.gender = gender;
    }

    if (typeOfAnimal) {
      query.typeOfAnimal = typeOfAnimal;
    }

    if (size) {
      query.size = size;
    }

    const matchingPets = await Pet.find({ $or: [query] });

    console.log(matchingPets);

    res.status(200).json(matchingPets);
  } catch (err) {
    next(err);
  }
});

//POST
// Create a new pet
router.post("/new", isAuthenticated, (req, res) => {
  const {
    typeOfAnimal,
    shop,
    owner,
    breed,
    age,
    size,
    name,
    gender,
    dateOfBirth,
    description,
    profilePicture,
    images,
    isAdopted,
    isReported,
  } = req.body;

  // Check if desccription is empty string
  // Create a new Pet on the database
  if (!description) {
    return res
      .status(400)
      .json({ message: "Please add some description to know it more!" });
  } else {
    Pet.create({
      typeOfAnimal,
      shop,
      owner,
      breed,
      age,
      size,
      name,
      gender,
      dateOfBirth,
      profilePicture,
      description,
      images,
      isAdopted,
      isReported,
    })
      .then((newPet) => {
        res.status(200).json({
          message: "A new pet was successfully join to the Adoptify family!",
          data: newPet,
        });
      })
      .catch((err) => {
        res.json(err);
      });
  }
});

// Create a quesstionare of a specific pet by id
router.post("/:id/adopt", isAuthenticated, async (req, res, next) => {
  const {
    designatedArea,
    landlordAware,
    whereStaysWhenNotHome,
    familyInfo,
    childrenCharacteristics,
    annualExpenses,
    employed,
    vacationPlans,
    timeAloneAtHome,
    expenses,
    suitableFood,
    previousAnimals,
    whyAdopt,
    walkingFrequency,
    willingnessToTrain,
    behaviorResponse,
    preAdoptionFollowUps,
    observations,
  } = req.body;
  const { id } = req.params;

  const adoptedPet = await Pet.findById(id);

  const { _id } = req.payload;

  // Check if pet exists and create questionnaire on the database
  if (!adoptedPet) {
    return res.status(404).json({ message: "Pet not found." });
  } else {
    Questionnaire.create({
      pet: id,
      shop: adoptedPet.shop,
      user: _id,
      designatedArea,
      landlordAware,
      whereStaysWhenNotHome,
      familyInfo,
      childrenCharacteristics,
      annualExpenses,
      employed,
      vacationPlans,
      timeAloneAtHome,
      expenses,
      suitableFood,
      previousAnimals,
      whyAdopt,
      walkingFrequency,
      willingnessToTrain,
      behaviorResponse,
      preAdoptionFollowUps,
      observations,
    })
      .then((createdQue) => {
        res.status(201).json({ message: "Questionnarie successully created" });
      })
      .catch((err) => {
        next(err);
      });
  }
});

// Get a specific pet by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  Pet.findById(id)
    .populate(["shop"])
    .then((onePet) => {
      if (!onePet) {
        return res.status(404).json({ message: "Pet not found." });
      } else {
        res.status(200).json(onePet);
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//PUT

// Update a pet by ID
router.patch(
  "/:id",
  isAuthenticated,
  fileUploader.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "images" },
  ]),
  (req, res, next) => {
    const { id } = req.params;
    try {
      let { description, breed, name, isAdopted, isReported } = req.body;

      let profilePicture = null;

      if (
        req.files["profilePicture"] &&
        req.files["profilePicture"][0] &&
        req.files["profilePicture"][0].path
      ) {
        profilePicture = req.files["profilePicture"][0].path;
      } else {
        profilePicture = req.body.profilePicture;
      }

      let images =
        req.files["images"]?.map((data) => data?.path) || req.body.images;

      Pet.findByIdAndUpdate(
        id,
        {
          description,
          images: images,
          profilePicture,
          breed,
          name,
          isAdopted,
          isReported,
        },
        { new: true }
      )
        .then((updatedPet) => {
          if (!updatedPet) {
            return res.status(404).json({ message: "Pet not found." });
          } else {
            res.status(201).json({
              message: "Pet updated",
              data: updatedPet,
            });
          }
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  }
);

//DELETE

// Delete a pet by ID
router.delete("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;

  Pet.findByIdAndDelete(id)
    .then(async (deletedPet) => {
      if (!deletedPet) {
        return res.status(404).json({ message: "Pet not found." });
      } else {
        await Shop.updateMany({ pets: id }, { $pull: { pets: id } });
        res.json({ message: "Pet deleted" });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
