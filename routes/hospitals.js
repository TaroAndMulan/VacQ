const express = require('express');
const {getHospitals,getHospital,createHospitals,updateHospital,deleteHospital} = require('../controllers/hospitals');
//include other resource routers
const appointmentRouter = require('./appointments');
const router = express.Router();
const {protect,authorize} = require('../middleware/auth');

//Re-route into other resource routeres
router.use('/:hospitalId/appointments/',appointmentRouter);

router.route('/').get(getHospitals).post(protect,authorize('admin'),createHospitals);
router.route('/:id').get(getHospital).put(protect,authorize('admin'),updateHospital).delete(protect,authorize('admin'),deleteHospital);


module.exports = router;