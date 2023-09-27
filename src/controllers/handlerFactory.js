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

module.exports = {
  deleteOne,
};
