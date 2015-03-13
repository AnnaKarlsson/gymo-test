module.exports = function(app) {
	app.get('/', function(req, res) {
		res.sendFile('./public/index.html');
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
		var mailOptions = {
		    from: 'Anna Karlsson, <gyrotion@gmail.com>',
		    to: 'Anna.Karlsson@cybercom.com',
		    /*bcc: 'Anna.Karlsson@cybercom.com',*/
		    subject: 'Gyrotion on '+ req.body.model,
		    html: '<strong>From: </strong>'+req.body.mailfrom +'<br><strong>Browser: </strong>'+req.body.browser, // plaintext body
		    attachments : [
		    	/*C{	
		    		filename: 'camera.' + req.body.filetype,
		    		streamSource: fs.createReadStream(req.files.file.path)
		    	},*/
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
        		console.log('ERROR: Email not sent');
        		res.end("error1");
   		 	}else{
        		console.log('SUCCESS: Email sent');
        		res.end("sent");
    		}
    		transporter.close();
		});
	});
	// authentication routes

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendFile('./public/index.html');
	});

};