const express = require('express');
const router = express.Router();

const {
  getAllReviews,
  createReview,
} = require('../controllers/ReviewController');
const { protect, restrictTo } = require('../controllers/authController');

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

module.exports = router;
