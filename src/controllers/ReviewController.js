const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const { deleteOne } = require('./handlerFactory');

const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

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

const deleteReview = deleteOne(Review);

module.exports = {
  getAllReviews,
  createReview,
  deleteReview,
};
