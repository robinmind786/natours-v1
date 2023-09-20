const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !!passwordConfirm) {
    return next(new AppError("Input field must not be empty", 400));
  }

  const newUser = await User.create({ name, email, password, passwordConfirm });

  res.status(200).json({
    status: "success",
    messsage: "User created successfully",
    data: {
      newUser,
    },
  });
});

module.exports = {
  signup,
};
