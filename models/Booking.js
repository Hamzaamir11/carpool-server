const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  rider_id: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  driver_id: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
  origin_address: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  destination_address: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  origin_lat: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  origin_lng: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  destination_lat: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  destination_lng: {
    type: mongoose.SchemaTypes.String,
    require: true,
  },
  status: {
    type: mongoose.SchemaTypes.String,
    default: "Pending",
    required: false,
  },
  booking_date: {
    type: mongoose.SchemaTypes.Date,
    default: new Date(),
  },
  rating: {
    type:mongoose.SchemaTypes.Decimal128,
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
