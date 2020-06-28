const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController");

router.get("/", BookingController.get_bookings);
router.post("/", BookingController.create_booking);
router.post(
  "/get-active-booking-by-user/",
  BookingController.getActiveBookingByUserId
);
router.post(
  "/get-completed-booking-by-user/",
  BookingController.getCompletedBookingByUserId
);
router.post("/:booking_id/accept/", BookingController.accept_booking);
router.post("/:booking_id/arrived/", BookingController.arrived_booking);
router.post("/:booking_id/start/", BookingController.start_booking);
router.post("/:booking_id/complete/", BookingController.complete_booking);
router.post("/:booking_id/rate",BookingController.rate_booking);

module.exports = router;
