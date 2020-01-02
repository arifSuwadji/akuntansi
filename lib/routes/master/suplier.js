'use strict';

const express = require('express');
const router = express.Router();

const common = require('../../common');

const suplierControl = require('../../controllers/master/suplier');

router.route('/list').get(suplierControl.index).post(suplierControl.updateAkun);
router.get('/listJson', suplierControl.data);
router.get('/mutasi/:idSuplier/:namaSuplier', suplierControl.mutasi);
router.get('/mutasiJson/:idSuplier', suplierControl.mutasiJson);
router.get('/mutasi_hutang/:idSuplier/:namaSuplier', suplierControl.mutasi_hutang);
router.get('/mutasiHutangJson/:idSuplier', suplierControl.mutasiHutangJson);

module.exports = router;
