const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    message: 'Reviews fetch successfully',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

const createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    statsu: 'success',
    message: 'Review Created successfully',
    data: {
      newReview,
    },
  });
});

module.exports = {
  getAllReviews,
  createReview,
};
