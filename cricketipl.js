// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'ap-south-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-south-1:158382d7-ed74-4109-9599-6e2aa9be55f8',
});

AWS.config.credentials.get(function(err){
	
	if(err){
		alert("error retrieving credentials from identity pool");
		console.error(err);
		return;
	}
	//for kinesis service object
	//dont change api version
	var kinesis = new AWS.Kinesis({
		apiVersion:'2013-12-02'
	});
	
	var firehose = new AWS.Firehose();
	submitEntry=document.getElementById("submitEntry");
	submitEntry.addEventListener('click', function(event){
		
		var params = {
			DeliveryStreamName: 'IPLCricketContestStream',
			Record: {
				Data: JSON.stringify({
					first_name:document.getElementById("first_name").value,
					last_name:document.getElementById("last_name").value,
					phone:document.getElementById("phone").value,
					email:document.getElementById("email").value,
					gender:document.getElementById("gender").value,
					ip_address: document.getElementById("ip_address").value,
					time: new Date()
				})
			}
		};
		
		firehose.putRecord(params, function(err, data){
			if(err)
				console.log(err, err.stack);
			else{
				console.log(data);
				alert("Your entry has been submitted successfully. All the best !!");
			}
		});
	});
	
	sendBatch = document.getElementById('sendBatch');
	
	sendBatch.addEventListener('click', function(event){
		alert("sendBatch!!");
		var recordData=[];
		for(var i=0;i<100;i++)
		{	
			var record ={
				Data: JSON.stringify({
					first_name:data[i].first_name,
					last_name:data[i].last_name,
					phone:data[i].phone,
					email:data[i].email,
					gender:data[i].gender,
					ip_address:event.identity.sourceIP
				})
			};
			
			recordData.push(record);
		}
		
		var params = {
			DeliveryStreamName: 'IPLCricketContestStream',
			Records:recordData
		};
		
		firehose.putRecordBatch(params, function(err, data) { 
			if(err)
				console.log(err,err.stack);
			else{
				alert("Batch 100 records sending complete");
				console.log(data);
			}
		});
	});
});