const { isAuthenticated } = require("../middleware/jwt.middleware");
const Pet = require("../models/Pet.model");
const router = require("express").Router();

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
    profilePicture,
    description,
    images,
    isAdopted,
    isReported,
  } = req.body;

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

//GET

// Get all pets
router.get("/allPets", isAuthenticated, (req, res) => {
  Pet.find()
    .then((allPets) => {
      res.json(allPets);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Get a specific pet by ID
router.get("/:id", isAuthenticated, (req, res) => {
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
router.put("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const {
    shop,
    owner,
    description,
    images,
    profilePicture,
    breed,
    name,
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
