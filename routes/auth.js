const express = require("express");
const Users = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchUser");
const JWT_SECRET = "Nishantisawebdeveloper";

//Route 1: Create a User using: POST "/api/auth/signup.
router.post(
  "/signup",
  body("name", "Name must be of atleast 3 characters").isLength({ min: 3 }),
  body("email", "Please enter a valid Email").isEmail(),
  body("password", "Password must be of atleast 5 characters").isLength({
    min: 5,
  }),
  body("phone", "Phone must be of 10 numbers").isLength({ min: 10, max: 10 }),
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await Users.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exists",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await Users.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        domain: req.body.domain,
        type: req.body.type,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);

//Route 2: Authenticate a User using: POST "/api/auth/login". Doesn't require auth
router.post(
  "/login",
  body("email", "Please enter a valid Email").isEmail(),
  body("password", "Password cannot be blank").exists(),
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await Users.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }
      const passComp = await bcrypt.compare(password, user.password);
      if (!passComp) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch {
      res.status(500).send("Some error occurred");
    }
  }
);

// ROUTE 3: Get loggedin User Details using: GET "/api/auth/getuser". Login required
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE4: Fetch all users: GET "/api/auth/allusers". Login required
router.get("/allusers", async (req, res) => {
  try {
    const user = await Users.find({ body: req.body }).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
