const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function validateToken(req, res, next) {
  try {
    const token = req.header("auth-token");
    if (!token) {
      res.status(400);
      throw new Error("Token cannot be found in header.");
    }

    const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userInDB = await User.findById(verify._id);

    if (!userInDB) {
      res.status(400);
      throw new Error("User cannot be found.");
    }

    if (!userInDB.isApproved) {
      res.status(401);
      throw new Error("User has not been approved.");
    }

    req.user = userInDB;
    next();
  } catch (error) {
    next(error);
  }
}

async function validateAdmin(req, res, next) {
  try {
    //Take information from the request and see if the user exists.
    const userInformation = req.user;
    if (!userInformation) {
      res.status(400);
      throw new Error("Inappropriate information has been given.");
    }

    //Look up user to make sure they exist on the database.
    const fetchedUser = await User.findById(userInformation._id);
    if (!fetchedUser) {
      res.status(400);
      throw new Error("User cannot be found.");
    }

    //Check if they are an admin
    if (!fetchedUser.isAdmin) {
      res.status(401);
      throw new Error("User is not an admin and cannot access this page..");
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateToken: validateToken,
  validateAdmin: validateAdmin,
};
