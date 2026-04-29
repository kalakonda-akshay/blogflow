const express = require('express');
const { deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const r = express.Router();
r.delete('/:id', protect, deleteComment);
module.exports = r;
