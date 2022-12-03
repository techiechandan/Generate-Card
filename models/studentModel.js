const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({ 

    photo:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    birth:{
        type:String,
        required:true
    },
    bGroup:{
        type:String,
        required:true
    },
    course:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    startYear:{
        type:String,
        required:true
    },
    endYear:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },

    rollNo:{
        type:String,
        required:true
    },
    GuardianName:{
        type:String,
        required:true
    },
    District:{
        type:String,
        required:true
    },
    Village:{
        type:String,
        required:true
    },
    PinCode:{
        type:String,
        required:true
    },
    GeneratedBy:{
        type:String,
        required:true
    }
});
module.exports = mongoose.model('Student',studentSchema);
