var express = require('express');
var router = express.Router();
var app = express();
var APP_CONSTANTS = require('./constants');

// var proxy = require('express-http-proxy');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
var modifyResponse = require('node-http-proxy-json');
var jwt = require('jsonwebtoken');

app.use(router);
let port = 6700;

let isAuthorized = (req, res, next) => {
	const authorizationHeaader = req.headers.authorization;
    let result;
    if (authorizationHeaader) {
      const token = req.headers.authorization.split(' ')[1]; // Bearer <token>

      const options = {
        expiresIn: '1h'
      };
      try {
        result = jwt.verify(token, APP_CONSTANTS.SECRET_KEY, options);
        console.log("[JWT Verify]", result);
        return next();
      } catch (err) {
      	console.log("[JWT Error]", err);
        result = {
	        error: `Authorization failed`,
	        status: 401
	    };
	    res.status(401).json(result);
      }
    } else {
      result = {
        error: `Authentication error. Token required.`,
        status: 401
      };
      res.status(401).send(result);
    }
	return next();
};

// app.use(isAuthorized);

router.post('/auth',(req, res, next) => {
	var option = {
		target: APP_CONSTANTS.AUTH_URL
	};
	proxy.web(req, res, option);

	proxy.on('proxyRes', function (proxyRes, req, res) {
	    modifyResponse(res, proxyRes, async function (body) {
	    	let statuscode = proxyRes.statusCode;
	    	let authToken = "";
	    	let signToken = await jwt.sign({ auth: '1098' },APP_CONSTANTS.SECRET_KEY,{ algorithm: 'HS256' , expiresIn: '1h'},
	    		function(err, token) {
			  		authToken = token;
				}
			);
	    	console.log("[AUTHTOKEN]", authToken)
	        if (body) {
	            if(statuscode == 200){
	            	body.authToken = authToken;
	            }
	        }
	        return body;
	    });
	});
});



router.all('/services*', isAuthorized ,(req, res, next) => {
	// console.log("[REQ]",req);
	var option = {
		target: APP_CONSTANTS.SERVICE_PATH
	};
	console.log("[Proxying Services] with path ", option.target);
	proxy.web(req, res, option);
});

app.listen(port, () => {
	console.log("[Service started at port ] " + port);
})