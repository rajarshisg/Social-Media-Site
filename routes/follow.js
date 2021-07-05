const express = require('express');
const router = express.Router();

const followController = require('../controllers/follow_controller');


router.get('/toggle', followController.toggleFollow);
module.exports = router;