module.exports = function(app) {
	app.get('/', function(req, res) {
		res.sendfile('./public/index.html');
	});

	// server routes ===========================================================
	var nodemailer = require('nodemailer');
	// create reusable transporter object using SMTP transport
	var transporter = nodemailer.createTransport("SMTP",{
	    service: 'Gmail',
	    auth: {
	        user: 'gyrotion@gmail.com',
	        pass: 'losenord12345'
	    }
	});

	app.post('/send',function(req,res){
		// setup e-mail data with unicode symbols
		var bcc; // Don't want two mail...
		if (req.body.emailTo == 'gyrotion@gmail.com') {
			bcc = '';
		}else{
			bcc = 'gyrotion@gmail.com';
		}
		var mailOptions = {
		    from: 'Anna Karlsson, <gyrotion@gmail.com>', // sender address
		    to: req.body.emailTo, // list of receivers
		    bcc: 'Anna.Karlsson@cybercom.com',
		    subject: 'Gyrotion on '+ req.body.model, // Subject line
		    html: 'From '+req.body.emailFrom +'<br>Browser:<br>'+ req.body.browser, // plaintext body
		    attachments : [
		    	{
		    		filename: 'motion.csv',
		    		contents: req.body.motion,
		    		contentType: 'text/plain'
		    	},
		    	{
		    		filename: 'gyro.csv',
		    		contents: req.body.gyro,
		    		contentType: 'text/plain'
		    	}]
		};
		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
    		if(error){
        		console.log(error);
        		res.end("error1");
   		 	}else{
        		console.log('Message 1 sent: ' + info.response);
        		res.end("sent");
    		}
    		transporter.close();
		});
	});

	var Motion = require('./models/motion');
	// handle things like api calls
	app.get('/api', function(req, res) {
		 res.json({ message: 'hooray! welcome to api!' });   
	});
	app.get('api/motions', function(req, res){
		Motion.find({name: req.param.motion}, function(err, motion){
			if (err) {throw err;};
		})
		console.log('GET motion of '+ motion);
	    res.send(req.params.motion);
	});
	app.post('api/motions', function(req, res) {
    	var newMotion = Motion({
    		name: req.body.name,
    		motionData : req.body.motionData
    	});
    	console.log(newMotion);
    	newMotion.save(function(err){
    		if (err) { throw err;};
    		console.log('New motion added to db');
    	});
    });



	app.get('/api/:version', function(req, res) {
    	res.send(req.params.version);
  	});

	// authentication routes

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};