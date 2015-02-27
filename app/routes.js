module.exports = function(app) {
	app.get('/', function(req, res) {
		res.sendfile('./public/index.html');
	});
	
	// server routes ===========================================================
	var nodemailer = require('nodemailer');
	var fs = require('fs');
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
		console.log(req.body);
		var mailOptions = {
		    from: 'Anna Karlsson, <gyrotion@gmail.com>', // sender address
		    to: req.body.emailTo, // list of receivers
		    bcc: 'Anna.Karlsson@cybercom.com',
		    subject: 'Gyrotion on '+ req.body.model, // Subject line
		    html: '<strong>From: </strong>'+req.body.emailFrom +'<br><strong>Browser: </strong>'+ req.body.browser, // plaintext body
		    attachments : [
		    	{	
		    		filename: req.body.file.name,
		    		contents: fs.createReadStream(req.body.file)
		    	},
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
		/*transporter.sendMail(mailOptions, function(error, info){
    		if(error){
        		console.log(error);
        		res.end("error1");
   		 	}else{
        		console.log('Sensor-data sent from: ' + req.body.emailFrom);
        		res.end("sent");
    		}
    		transporter.close();
		});*/
	});
	// authentication routes

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};