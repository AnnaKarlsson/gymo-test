// grab the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define our motion model
var MotionSchema = new Schema({
	name : String,
	created_at: { type: Date, default: Date.now },
	motionData : [{ 
		x: Number, 
		y: Number, 
		z: Number}]
});

// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Motion', MotionSchema);
