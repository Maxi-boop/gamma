function validateJsonBody(req, res, next) {
  try {
    const jsonData = req.body;

    //Check to see if there is a body found in the json data.
    if (!jsonData) {
      res.status(400);
      throw new Error("Request does not have a body.");
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateJsonBody: validateJsonBody,
};
