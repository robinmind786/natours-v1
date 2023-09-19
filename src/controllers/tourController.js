const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// get all tours from database
const getAllTours = catchAsync(async (req, res, next) => {
  const query = Tour.find();

  const tours = await query;
  const count = await query.countDocuments();

  if (!count) {
    return next(new AppError('No tours data found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Tours data fetch successfully',
    results: count,
    data: {
      tours,
    },
  });
});

// get tour by ID
const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('Not tour found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Tour data fetch successfully',
    data: {
      tour,
    },
  });
});

// create tour data
const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    stats: 'sucess',
    message: 'Tour created successfully',
    data: {
      newTour,
    },
  });
});

// update tour data
const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('Not tour found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Tour data updated successfully',
    data: {
      tour,
    },
  });
});

// delete tour data
const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('Not tour found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'Tour data deleted successfully',
    data: null,
  });
});

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
