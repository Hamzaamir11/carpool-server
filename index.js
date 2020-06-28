const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const config = require("config");
const bodyParser = require("body-parser");
const users = require("./routes/users");
const bookings = require("./routes/bookings");
const User = require("./models/User");

app.use(bodyParser.json());

mongoose.connect(
  config.get("mongooseUrl"),
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => {
    console.log("connected to mongodb");
  }
);

io.sockets.on("connection", (socket) => {
  console.log("A User Connected");
  socket.on("disconnect", () => {
    console.warn("A User Disconnected");
  });
  socket.on("echo", (data) => {
    console.warn(data);
  });
  socket.on("update_lat_lng", async (data) => {
    console.warn(data);
    let { lat, lng, user_id } = data;
    if (lat && lng && user_id) {
      console.log(`Got new Lat=${lat} Lng=${lng} for User=${user_id}`);
      try {
        await User.findByIdAndUpdate(user_id, {
          lat,
          lng,
        });
        const user = await User.findById(user_id);
        io.emit("new_lat_lng", { user });
      } catch (error) {
        console.warn(error.message);
      }
    }
  });
});

app.use(function (req, res, next) {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.send("working");
});

app.use("/api/users", users);

app.use("/api/bookings", bookings);

const port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log(`Server Started at port ${port}`);
});
