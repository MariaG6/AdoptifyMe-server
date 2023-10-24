const { isAuthenticated } = require("../middleware/jwt.middleware");
const Pet = require("../models/Pet.model");
const Questionnaire = require("../models/Questionnaire.model");
const router = require("express").Router();

//GET
// Get all pets
router.get("/allPets", (req, res) => {
  Pet.find()
    .populate(["shop"])
    .then((allPets) => {
      res.status(200).json(allPets);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
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
  } = req.body;
  const { id } = req.params;

  const adoptedPet = await Pet.findById(id);

  const { _id } = req.payload;

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
    })
      .then((createdQue) => {
        res.status(201).json({ message: "Questionnarie successully created" });
      })
      .catch((err) => {
        next(err)
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
router.put("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;

  const {
    shop,
    owner,
    description,
    breed,
    name,
    profilePicture,
    images,
    isAdopted,
    isReported,
  } = req.body;

  Pet.findByIdAndUpdate(
    id,
    {
      shop,
      owner,
      description,
      images,
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
        res.status(200).json({
          message: "Pet updated",
          data: updatedPet,
        });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

//DELETE

// Delete a pet by ID
router.delete("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;

  Pet.findByIdAndDelete(id)
    .then((deletedPet) => {
      if (!deletedPet) {
        return res.status(404).json({ message: "Pet not found." });
      } else {
        res.json({ message: "Pet deleted" });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
