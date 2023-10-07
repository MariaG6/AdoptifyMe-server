const { isAuthenticated } = require("../middleware/jwt.middleware");
const Shop = require("../models/Shop.model");
const router = require("express").Router();

//POST

// Create a new shop
router.post("/new", isAuthenticated, async (req, res) => {
  try {
    const { shopName, website, shopLogo, pets, owner } = req.body;
    const newShop = await Shop.create({ shopName, website, shopLogo, pets, owner });
    res.status(200).json({
      message: "A new shop was successfully created",
      data: newShop,
    });
  } catch (err) {
    res.json(err);
  }
});

//GET

// Get all shops
router.get("/allShops", isAuthenticated, async (req, res) => {
  try {
    const allShops = await Shop.find();
    res.json(allShops)
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
  }
  catch (err) {
    res.json(err);
  }
});

//PUT

// Update a shop by ID
router.put(('/:id'),isAuthenticated, async (req,res)=>{
  try{
    const {id} = req.params
    const {shopName,website,shopLogo,pets} = req.body
    const updatedShop = await Shop.findByIdAndUpdate(id,{shopName,website,shopLogo,pets})
    if(!updatedShop) {
      return res.status(404).json({message:"Shop not found"})
    }
    res.status(200).json({
      message: "Shop updated",
      data: updatedShop,
    });

  }  catch (err) {
    res.json(err);
  }
})

//DELETE

// Delete a shop by ID
router.delete(('/:id'),isAuthenticated,(req,res)=>{
  try{
      const {id} = req.params
      const deletedShop = Shop.findByIdAndDelete(id)
      if(!deletedShop) {
        return res.status(404).json({message:'Shop not found'})
      }
      res.status(200).json({
        message:"Shop deleted"
      })
  }  catch (err) {
    res.json(err);
  }
})

module.exports = router;