const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');

//@desc add appointment
//@route POST /api/v1/hospitals/:hospitalId/appointment
//@access Private
exports.addAppointment= async(req,res,next)=>{
    try{
        req.body.hospital = req.params.hospitalId;

        const hospital = await Hospital.findById(req.params.hospitalId);

        if(!hospital){
            return res.status(404).json({success:false,
                message:`no hospital with the id of ${req.params.hospitalId}`});
        }

        req.body.user = req.user.id;
        const existedAppointments = await Appointment.find({user:req.user.id});
        if (existedAppointments.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false,message:`the user with ID ${req.user.id} has already mad 3 appointment`});
        }

        const appointment = await Appointment.create(req.body);
        res.status(200).json({
            success:true,
            data:appointment
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot create Appointment"});
    }
};



//@desc Get all appointments
//@route GET /api/v1/appointments
//@access Private
exports.getAppointments= async (req,res,next)=>{
    let query;
    // general user can see only their appointments!
    if(req.user.role !== 'admin'){
        query = Appointment.find({user:req.user.id}).populate({
            path:'hospital',
            select: 'name province tel'
        });
    }
    else{ //if admin , can see all appoiontments
        if (req.params.hospitalId){
            query= Appointment.find({hospital:req.params.hospitalId}).populate({
                path:'hospital',
                select:'name province tel'
            });
        }
        else {
            query = Appointment.find().populate({
            path:'hospital',
            select: 'name province tel'
        });
        }
    }
    try{
        const appointments = await query;
        res.status(200).json({
            success:true,
            count: appointments.length,
            data:appointments
        });     
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({
            success:false,
            message:"cannot find appointment"
        });

    }
};

//@desc add single appointments
//@route GET /api/v1/hospitals/:hospitalId/appointments/
//@access Private

exports.getAppointment = async (req,res,next)=> {
    try{
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'hospital',
            select: 'name description tel'
        });
        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`});
        }
        res.status(200).json({
            success:true,
            data:appointment
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find appointment"});
    }
};


//@desc Update appointment
//@route PUT /api/v1/appointments/:id
//@access Private

exports.updateAppointment = async (req,res,next)=>{
    try{
        let appointment = await Appointment.findById(req.params.id);
        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`});
        }

        if (appointment.user.toString()!==req.user.id && req.user.role !=='admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorize to update this appointment`});
        }
        appointment = await Appointment.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            data:appointment
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot update Appointment"});
    }
};

//@desc Update appointment
//@route PUT /api/v1/appointments/:id
//@access Private

exports.deleteAppointment = async (req,res,next)=>{
    try{
        const appointment = await Appointment.findById(req.params.id);
        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`});
        }

        if (appointment.user.toString()!==req.user.id && req.user.role !=='admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorize to delete this appointment`});
        }

        await appointment.remove();

        res.status(200).json({
            success:true,
            data:{}
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot delete Appointment"});
    }
};

