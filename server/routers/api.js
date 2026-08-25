const router = require("express").Router();
const articleRouter = require("./articleRouter");
const Staff = require("../models/Staff");

router.use("/article", articleRouter);

// router.get("/:staff", async (req, res) => {
//   try {
//     let staffName = req.params.staff;
//     const staff = await Staff.find({ name: "Ankki Dong" }).select(
//       "name email slug created_at",
//     );

//     if (!staff) throw new Error("User does not exist");

//     res.json(staff);
//   } catch (error) {
//     console.error(error);
//     res.send(error);
//   }
// });

module.exports = router;
