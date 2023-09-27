const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(`No ${Model.modelName} found with this ID`, 404),
      );
    }

    res.status(204).json({
      status: 'success',
      message: `${Model.modelName} data deleted successfully.`,
      doc: null,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      new AppError(`No ${Model.modelName} found with this ID`, 404);
    }

    res.status(200).json({
      status: 'success',
      message: `${Model.modelName} data updated successfully`,
      data: {
        doc,
      },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Tour.create(req.body);

    res.status(201).json({
      stats: 'sucess',
      message: `${Model.modelName} created successfully`,
      data: {
        doc,
      },
    });
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      new AppError(`No ${Model.modelName} found with this ID`, 404);
    }

    res.status(200).json({
      status: 'success',
      message: `${Model.modelName} data fetch successfully`,
      data: {
        doc,
      },
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    if (!doc) {
      return next(new AppError(`No ${Model.modelName}s data found`, 404));
    }

    res.status(200).json({
      status: 'success',
      message: `${Model.modelName}s data fetch successfully`,
      results: doc.length,
      data: {
        doc,
      },
    });
  });

module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
};
