const express = require('express');
const {getHospitals,getHospital,createHospitals,updateHospital,deleteHospital} = require('../controllers/hospitals');
const router = express.Router();
const {protect,authorize} = require('../middleware/auth');

router.route('/').get(getHospitals).post(protect,authorize('admin'),createHospitals);
router.route('/:id').get(getHospital).put(protect,authorize('admin'),updateHospital).delete(protect,authorize('admin'),deleteHospital);


module.exports = router;