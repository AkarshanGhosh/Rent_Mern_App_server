const Booking = require("../models/Booking");
const Item = require("../models/Item");
const User = require("../models/User");

// **Create Booking (Renter)**
exports.createBooking = async (req, res) => {
  try {
    const { itemId, start_date, end_date } = req.body;
    const renter = req.user.id;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.provider.toString() === renter) {
      return res.status(400).json({ message: "You cannot book your own item" });
    }

    const rentalDays = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24));
    const total_price = rentalDays * item.rental_price;

    const newBooking = new Booking({
      renter,
      provider: item.provider,
      item: itemId,
      rental_period: { start_date, end_date },
      total_price,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking request sent", newBooking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Get Bookings for Renter**
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ renter: req.user.id }).populate("item");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Get Bookings for Provider**
exports.getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user.id }).populate("item renter");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Approve or Decline Booking (Provider Only)**
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.provider.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this booking" });
    }

    booking.status = status;
    await booking.save();
    res.status(200).json({ message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// **Cancel Booking (Renter)**
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.renter.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to cancel this booking" });
    }

    booking.status = "Canceled";
    await booking.save();
    res.status(200).json({ message: "Booking canceled", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
