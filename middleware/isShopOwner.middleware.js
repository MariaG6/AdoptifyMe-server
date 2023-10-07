// Middleware to check if the user is the owner of the shop
const checkShopOwner = async (req,res,next) =>{
    try{
        const { id } = req.params;
        // Find the shop and check if the shop exists
    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
        // If the owner is the user, return a 403 Forbidden status
    if (req.payload.id === shop.owner) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next()
    } catch (err) {
      res.json(err);
    }
  }
  
  module.exports = checkShopOwner;


  
