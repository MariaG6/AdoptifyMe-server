const { isAuthenticated } = require("../middleware/jwt.middleware");
const Pet = require("../models/Pet.model");
const Questionnaire = require("../models/Questionnaire.model");
const router = require("express").Router();

//POST

// Create a new pet
router.post("/new", isAuthenticated, (req, res) => {
  // Check if profilePicture exits, if not add default image
  // if (!profilePicture) {
  //   profilePicture =
  //     "https://img.freepik.com/free-vector/flat-design-dog-cat-silhouette_23-2150283212.jpg?w=740&t=st=1697112348~exp=1697112948~hmac=8c585812ac327c2475bfd16aeaa1596e4f231468841d6c31707ca2bf55af89ab";
  // }

  // Handle images
  const imagesURL = req.files.map((element) => {
    return element.path;
  });
  console.log(imagesURL)
  return
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
      images: imagesURL,
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
router.post("/:id/adopt", isAuthenticated, async (req, res) => {
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
        res.status(200).json({ message: "Questionnarie successuffy created" });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
});

//GET

// Get all pets
router.get("/allPets", (req, res) => {
  Pet.find()
    .then((allPets) => {
      res.json(allPets);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Get a specific pet by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  Pet.findById(id)
    .then((onePet) => {
      if (!onePet) {
        return res.status(404).json({ message: "Pet not found." });
      } else {
        res.json(onePet);
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

//PUT

// Update a pet by ID
router.put(
  "/:id",
  isAuthenticated,
  (req, res) => {
    const { id } = req.params;
    // Handle images
    const imagesURL = req.files.map((element) => {
      return element.path;
    });

    const { shop, owner, description, breed, name, profilePicture, isAdopted, isReported } =
      req.body;

    Pet.findByIdAndUpdate(
      id,
      {
        shop,
        owner,
        description,
        images: imagesURL,
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
  }
);

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
