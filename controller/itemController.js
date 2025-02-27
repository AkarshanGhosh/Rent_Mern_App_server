const Item = require("../models/Item");
const User = require("../models/User");

// **Create New Item (Provider Only)**
exports.createItem = async (req, res) => {
  try {
    const { title, description, category, rental_price, location, security_deposit, images } = req.body;

    const user = await User.findById(req.user.id);
    if (!user || user.role !== "provider") {
      return res.status(403).json({ message: "Only providers can upload items" });
    }

    const newItem = new Item({
      provider: req.user.id,
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
    res.status(500).json({ message: "Server error", error });
  }
};

// **Get All Available Items (Public)**
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find({ availability_status: "Available" });
    res.status(200).json(items);
  } catch (error) {
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
    res.status(500).json({ message: "Server error", error });
  }
};

// **Update Item (Provider Only)**
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.provider.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this item" });
    }

    const updates = req.body;
    Object.assign(item, updates);

    await item.save();
    res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Delete Item (Provider Only)**
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.provider.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this item" });
    }

    await item.remove();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
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
    res.status(500).json({ message: "Server error", error });
  }
};
