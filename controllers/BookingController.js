const Booking = require("../models/Booking");
const User = require("../models/User");

exports.get_bookings = async (req, res) => {
  try {
    let data = [];
    let bookings = await Booking.find();
    if(bookings){
      bookings.map(async (booking, index) => {
      let bookingg = {
        booking,
        rider: null,
        driver: null,
      };
      let rider = await User.findById(booking.rider_id);
      let driver = await User.findById(booking.driver_id);
      bookingg.rider = rider;
      bookingg.driver = driver;
      data.push(bookingg);
      if (bookings.length - 1 == index) {
        res.json({ status: true, message: "Bookings Found", data: data });
      }
    });
    }
    else{
      return res.json({status:true,message:'No Bookings Found',data:[]});
    }
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

exports.create_booking = async (req, res) => {
  const io = req.io;
  let {
    origin_address,
    origin_lat,
    origin_lng,
    destination_address,
    destination_lat,
    destination_lng,
    rider_id,
  } = req.body;
  if (
    origin_address &&
    origin_lat &&
    origin_lng &&
    destination_address &&
    destination_lat &&
    destination_lng &&
    rider_id
  ) {
    try {
      let data = {
        booking: null,
        rider: null,
        driver: null,
      };
      data.booking = await Booking.create({
        rider_id,
        origin_address,
        origin_lat,
        origin_lng,
        destination_address,
        destination_lat,
        destination_lng,
      });
      data.rider = await User.findById(rider_id);
      io.emit("new_booking", data);
      res.json({ status: true, message: "Booking Added", data: data });
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  } else {
    res.json({ status: false, message: "All fields are Required" });
  }
};

exports.accept_booking = async (req, res) => {
  const io = req.io;
  let { driver_id } = req.body;
  let { booking_id } = req.params;
  if (driver_id && booking_id) {
    try {
      await Booking.findByIdAndUpdate(booking_id, {
        driver_id,
        status: "Accepted",
      });
      let data = {
        booking: null,
        rider: null,
        driver: null,
      };
      data.booking = await Booking.findById(booking_id);
      data.driver = await User.findById(driver_id);
      data.rider = await User.findById(data.booking.rider_id);
      io.sockets.emit("booking_accepted", data);
      res.send({ status: true, message: "Booking Accepted", data: data });
    } catch (error) {
      res.json({ status: false, message: "Server Error: " + error.message });
    }
  } else {
    res.json({ status: false, message: "All Fields are Required" });
  }
};

exports.arrived_booking = async (req, res) => {
  const io = req.io;
  let { booking_id } = req.params;
  if (booking_id) {
    try {
      await Booking.findByIdAndUpdate(booking_id, {
        status: "Arrived",
      });
      let data = {
        booking: null,
        driver: null,
        rider: null,
      };
      data.booking = await Booking.findById(booking_id);
      data.driver = await User.findById(data.booking.driver_id);
      data.rider = await User.findById(data.booking.rider_id);
      io.sockets.emit("driver_arrived", data);
      res.send({
        status: true,
        message: "Arrived Successfully!",
        data: data,
      });
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  } else {
    res.json({ status: false, message: "All Fields are Required" });
  }
};

exports.start_booking = async (req, res) => {
  const io = req.io;
  let { booking_id } = req.params;
  if (booking_id) {
    try {
      await Booking.findByIdAndUpdate(booking_id, {
        status: "Started",
      });
      let data = {
        booking: null,
        driver: null,
        rider: null,
      };
      data.booking = await Booking.findById(booking_id);
      data.driver = await User.findById(data.booking.driver_id);
      data.rider = await User.findById(data.booking.rider_id);
      io.sockets.emit("booking_started", data);
      res.send({
        status: true,
        message: "Started Successfully!",
        data: data,
      });
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  } else {
    res.json({ status: false, message: "All Fields are Required" });
  }
};

exports.complete_booking = async (req, res) => {
  const io = req.io;
  let { booking_id } = req.params;
  if (booking_id) {
    try {
      await Booking.findByIdAndUpdate(booking_id, {
        status: "Completed",
      });
      let data = {
        booking: null,
        rider: null,
        driver: null,
      };
      data.booking = await Booking.findById(booking_id);
      data.driver = await User.findById(data.booking.driver_id);
      data.rider = await User.findById(data.booking.rider_id);
      io.sockets.emit("booking_completed", data);
      res.send({
        status: true,
        message: "Completed Successfully!",
        data: data,
      });
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  } else {
    res.json({ status: false, message: "All Fields are Required" });
  }
};

exports.getActiveBookingByUserId = async (req, res) => {
  let { user_id, userType } = req.body;
  if (user_id && userType) {
    try {
      let data = {
        booking: null,
        rider: null,
        driver: null,
      };
      if (userType == "Driver") {
        data.booking = await Booking.findOne({
          status: { $ne: "Completed" },
          driver_id: user_id,
        });
      } else if (userType == "User") {
        data.booking = await Booking.findOne({
          status: { $ne: "Completed" },
          rider_id: user_id,
        });
      } else {
        return res.json({ status: false, message: "Invalid User Type" });
      }
      if (data.booking) {
        data.rider = await User.findById(data.booking.rider_id);
        data.driver = data.booking.driver_id
          ? await User.findById(data.booking.driver_id)
          : null;
        res.json({ status: true, message: "Booking", data: data });
      } else {
        res.json({ status: true, message: "No Booking Found", data: data });
      }
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  } else {
    res.json({ status: false, message: "User ID or User Type is Missing" });
  }
};

exports.getCompletedBookingByUserId = async (req, res) => {
  let { user_id, userType } = req.body;
  if (user_id && userType) {
    try {
      let data = [];
      let bookings = null;
      if (userType == "Driver") {
        bookings = await Booking.find({
          status: "Completed",
          driver_id: user_id,
        });
      } else if (userType == "User") {
        bookings = await Booking.find({
          status: "Completed",
          rider_id: user_id,
        });
      } else {
        return res.json({ status: false, message: "Invalid User Type" });
      }
      if (bookings) {
        bookings.map(async (booking, index) => {
          let singleBooking = {
            booking: booking,
            rider: null,
            driver: null,
          };
          singleBooking.rider = await User.findById(booking.rider_id);
          singleBooking.driver = booking.driver_id
            ? await User.findById(booking.driver_id)
            : null;
          data.push(singleBooking);
          if (data.length - 1 == index) {
            return res.json({ status: true, message: "Booking", data: data });
          }
        });
      } else {
        res.json({ status: true, message: "No Booking Found", data: data });
      }
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  } else {
    res.json({ status: false, message: "User ID or User Type is Missing" });
  }
};

exports.rate_booking = async (req,res) => {
  let {booking_id} = req.params;
  let {rating} = req.body;
  if(booking_id && rating){
    try {
      await Booking.findByIdAndUpdate(booking_id,{rating: rating});
      return res.json({status:true,message:'Rated Successfully!'});
    } catch (error) {
      return res.json({status:false,message:error.message});
    }
  }
  else{
    return res.json({status:false,message:"All Fields are Required"});
  }
}