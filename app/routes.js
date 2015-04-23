module.exports = function(app) {
	var __dirname = './public';
	app.get('/', function(req, res) {
		res.sendFile('index.html', { root: __dirname });
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
		console.log('Files:' + req.files);
		if (req.files.file != undefined) {
			var attach = [
		    	{	
		    		filename: 'camera.' + req.body.filetype,
		    		streamSource: fs.createReadStream(req.files.file.path)
		    	},
		    	{
		    		filename: 'recordning.csv',
		    		contents: req.body.recordning,
		    		contentType: 'text/plain'
		    	}];

		}else {
			var attach = [
		    	{
		    		filename: 'recordning.csv',
		    		contents: req.body.recordning,
				}];
		}
		var mailOptions = {
		    from: 'Anna Karlsson, <gyrotion@gmail.com>',
		    to: 'Anna.Karlsson@cybercom.com',
		    subject: 'Sensor-data from '+ req.body.model,
		    html: '<strong>From: </strong>'+req.body.mailfrom +'<br><strong>userAnget: </strong>'+req.body.browser, // plaintext body
		    attachments : attach
		}
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
		res.sendFile('index.html', { root: __dirname });
	});

};