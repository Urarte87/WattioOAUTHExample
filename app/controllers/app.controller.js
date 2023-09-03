var request = require('request');
const service = require('../services/token.service')

exports.findAll = (req, res) => {
	
  service.getToken()
	  .then(response => {
          let token = response;
		  objetoFinal = {};
		
        service.getBody("https://api.wattio.com/test/v1/userinfo", token)
	    .then(response => {
			
		objetoFinal=service.treatUserObject(response,objetoFinal);
	
		service.getBody("https://api.wattio.com/test/v1/appliances", token)
		  .then(response => {
			  
		   objetoFinal=service.treatDevicesObject(response,objetoFinal);
		   
		   service.getBody("https://api.wattio.com/test/v1/appliances/status", token)
		  .then(response => {
		   
		   objetoFinal=service.treatStatusObject(response,objetoFinal);
		   
		   res.send(objetoFinal);	
	})
    .catch(err => 
		res.status(500).send({message: err}))
	})
    .catch(err => 
		res.status(500).send({message: err}))
	})
    .catch(err => 
		res.status(500).send({message: err}))
	})
   .catch(err => 
        res.status(500).send({message: err}))
};

