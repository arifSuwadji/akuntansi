"use strict";

const express = require('express');
const router = express.Router();

const common = require('../../common');

const harian = require('./neraca/harian');
const bulanan = require('./neraca/bulanan');

router.use('/harian', harian);
router.use('/bulanan', bulanan);

module.exports = router;
