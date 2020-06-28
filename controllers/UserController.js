const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    if (
      req.body.name &&
      req.body.email &&
      req.body.password &&
      req.body.userType
    ) {
      const user = await User.findOne({ email: req.body.email }).exec();
      if (user) {
        res.json({ status: false, message: "User Already Exists!" });
      } else {
        User.create(
          {
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 12),
            userType: req.body.userType,
          },
          (err, newUser) => {
            if (err) {
              return res.json({ status: false, message: err.message });
            }
            res.json({
              status: true,
              message: "Register Success",
              data: newUser,
            });
          }
        );
      }
    } else {
      res.status(400).json({
        status: false,
        message: "Name,Email,Password and User Type is Required",
      });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password, userType } = req.body;
  if (email && password && userType) {
    const user = await User.findOne({ email, userType })
      .select(["name", "userType", "email", "password"])
      .exec();
    if (user) {
      const valid = bcrypt.compareSync(password, user.password);
      if (valid) {
        res.json({ status: true, message: "Login Successful", data: user });
      } else {
        res.json({ status: false, message: "Incorrect Password" });
      }
    } else {
      res.status(404).json({ status: false, message: "User not Found" });
    }
  } else {
    res
      .status(400)
      .json({ status: false, message: "Email and Password is Required" });
  }
};

exports.updateLatLng = async (req, res) => {
  const { lat, lng, user_id, io } = req.body;
  if (lat && lng && user_id) {
    try {
      await User.findByIdAndUpdate(user_id, {
        lat,
        lng,
      });
      let data = {
        user: null,
      };
      data.user = await User.findById(user_id);
      io.emit("new_lat_lng", data.user);
      res.json({ status: true, message: "Lat Lng Updated", data });
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  } else {
    res.json({ status: false, message: "Need all fields!" });
  }
};
