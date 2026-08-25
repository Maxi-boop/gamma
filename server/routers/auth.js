const router = require("express").Router();
const User = require("../models/User");
const userSchema = require("../schemas/UserSchema").userSchema;
const { nameSchema, emailSchema, passwordSchema } =
  require("../schemas/UserSchema").otherSchemas;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const z = require("zod");

router.post("/register", async (req, res, next) => {
  try {
    ///Check the request body
    const jsonData = req.body;
    if (!jsonData) {
      res.status(400);
      throw new Error("Request body does not exist.");
    }
    // Validate the information given by the request body.
    const registerSchema = z.object({
      name: nameSchema,
      email: emailSchema,
      password: passwordSchema,
    });

    if (!registerSchema.safeParse(jsonData).success) {
      res.status(400);
      throw new Error("Sent data does not include the proper information.");
    }

    //Validate that the email does not exist in the system.
    const checkIfEmailExists = await User.findOne({ email: jsonData.email });
    if (checkIfEmailExists) {
      res.status(400);
      throw new Error("Email is already in use.");
    }

    //Encrypt the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(jsonData.password, salt);

    //Create a new entry on the db.
    const newUser = new User({
      name: jsonData.name,
      email: jsonData.email,
      password: hashedPassword,
    });
    let savedUser = await newUser.save();

    const token = jwt.sign(
      { _id: savedUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3h" },
    );

    res
      .header("auth-token", token)
      .send({ token: token, loggedIn: true, uid: savedUser._id });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const jsonData = req.body;

    if (!jsonData) {
      throw new Error("Request body does not exist.");
    }

    const loginSchema = z.object({
      email: emailSchema,
      password: passwordSchema,
    });

    if (!loginSchema.safeParse(jsonData).success) {
      throw new Error("Sent data does not include the proper information.");
    }

    const user = await User.findOne({ email: jsonData.email });

    if (!user) {
      throw new Error("User does not exist.");
    }

    const validPassword = await bcrypt.compare(
      jsonData.password,
      user.password,
    );

    if (!validPassword) {
      throw new Error("Password is invalid.");
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3h",
      },
    );

    res.header("auth-token", token).json({
      token: token,
      logged_in: true,
      uid: user._id,
      is_admin: user.isAdmin,
      isApproved: user.isApproved,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
