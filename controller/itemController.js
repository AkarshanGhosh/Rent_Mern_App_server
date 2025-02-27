const Item = require("../models/Item");
const User = require("../models/User");

// **Create New Item (Provider Only)**
exports.createItem = async (req, res) => {
  try {
    console.log("User from req.user:", req.user); // Debugging

    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized request. User data is missing." });
    }

    const { title, description, category, rental_price, location, security_deposit, images } = req.body;

    if (req.user.role !== "provider") {
      return res.status(403).json({ message: "Only providers can upload items" });
    }

    const newItem = new Item({
      provider: req.user._id, // Ensure ObjectId is used
      title,
      description,
      category,
      rental_price,
      location,
      security_deposit,
      images,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", newItem });
  } catch (error) {
    console.error("Create Item Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// **Get All Available Items (Public)**
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find({ availability_status: "Available" });
    res.status(200).json(items);
  } catch (error) {
    console.error("Get All Items Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// **Get Item by ID**
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.status(200).json(item);
  } catch (error) {
    console.error("Get Item By ID Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// **Update Item (Provider Only)**
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Ensure ObjectId comparison is done properly
    if (item.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this item" });
    }

    Object.assign(item, req.body);
    await item.save();

    res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    console.error("Update Item Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// **Delete Item (Provider Only)**
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Ensure ObjectId comparison is done properly
    if (item.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this item" });
    }

    await item.deleteOne();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete Item Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// **Filter Items by Category**
exports.getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const items = await Item.find({ category, availability_status: "Available" });

    res.status(200).json(items);
  } catch (error) {
    console.error("Get Items By Category Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// **Search Items by Title**
exports.searchItems = async (req, res) => {
  try {
    const { keyword } = req.query;
    const items = await Item.find({
      title: { $regex: keyword, $options: "i" },
      availability_status: "Available",
    });

    res.status(200).json(items);
  } catch (error) {
    console.error("Search Items Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
