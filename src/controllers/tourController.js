const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// top 5 tours
const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// get all tours from database
const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  if (!tours) {
    return next(new AppError('No tours data found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Tours data fetch successfully',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// get tour by ID
const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // const tour = await Tour.findById(req.params.id).populate('guides');

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

// tour stats
const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    message: 'Tour stats fetch successfully',
    results: stats.length,
    data: {
      stats,
    },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    message: 'Tour yearly plan fetch successfully',
    results: plan.length,
    data: {
      plan,
    },
  });
});

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
