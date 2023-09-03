var request = require('request');
const config = require('../config/config.js')


function treatUserObject(response, objetoFinal) {
	objetoFinal.user=response;
    objetoFinal.user.status = undefined;
	return objetoFinal
}

function treatDevicesObject(response, objetoFinal) {
	objetoFinal.devices=response;
	for (var key in objetoFinal.devices) {
         objetoFinal.devices[key].id = undefined;
    }
	 return objetoFinal;
}

function treatStatusObject(response, objetoFinal) {
	Object.keys(response).forEach(function(key) {
      //console.log(key, response[key].ieee);
	  let index = objetoFinal.devices.findIndex(p => p.ieee == response[key].ieee)
	  objetoFinal.devices[index].status=response[key].status;
	});
	return objetoFinal;
}


function getBody(url, token) {
	
   return new Promise(function(resolve, reject) {
   request({
	  url: url,
	  auth: {
		'bearer': token
	  }
	}, function(err, res) {
		if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(res.body));
      }
	});
  })
}


function getCodeAuth() {
	
	return new Promise(function(resolve, reject) {
	
		request({
		url: 'https://api.wattio.com/public/oauth2/authorize?response_type=code&state=&client_id=pruebaenddevices&redirect_uri=%2F',
		headers: {
		  Cookie: "connect.sid=s%3APt3Fr_F1qfgTxuUOXG9VOTzUVKgzBB-6.4TTGSH%2BLDH81Irea27LwUDLk3zW5gLCTs2DIYyEUZcY"
	  },
	}, function(err, res) {
		
	  if (err) reject(err);

	  let tokenauth=getCodeToken(res.body);
	  
	  request({
	  url: 'https://api.wattio.com/public/oauth2/authorize/decision',
	  method: 'POST',
	  form: {
		"transaction_id": tokenauth,
	  },
	   headers:{
			 Cookie: "connect.sid=s%3APt3Fr_F1qfgTxuUOXG9VOTzUVKgzBB-6.4TTGSH%2BLDH81Irea27LwUDLk3zW5gLCTs2DIYyEUZcY"
		 }, 
	}, function(err, res) {
		
	  if (err) reject(err);
	  var bodysplit = res.body.split("code=");
	  resolve(bodysplit[1]);
	})
	});
 })
	
}


function getToken() {
	
		return new Promise(function(resolve, reject) {
			  
		getCodeAuth().then(tokencode => {
			
		  request({
		  url: 'https://api.wattio.com/test/oauth2/token',
		  method: 'POST',
		  auth: {
			user: config.USER,
			pass: config.PASS
		  },
		  form: {
			'grant_type': 'authorization_code',
			'client_id': config.CLIENT_ID,
			'client_secret': config.CLIENT_SECRET,
			'redirect_uri': '/',
			'code': tokencode,
		  }
		}, function(err, res) {
			if (err) {
			  reject(err);
			} 
			else {
				try {
				   var json = JSON.parse(res.body);
				   resolve(json.access_token);
			  }
			  catch (err) {
				  reject(err);
			  }
			}
		  });
	   })
	});

}


function getCodeToken(body) {
  let value = body.indexOf("value");
  value = body.substring(value, value+15);
  value = value.replace("value=","");
  return value.substring(1);
}


module.exports = {
  getBody,
  getToken,
  treatUserObject,
  treatDevicesObject,
  treatStatusObject,
}