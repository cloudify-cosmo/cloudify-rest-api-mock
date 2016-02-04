'use strict';

var proxy = require('express-http-proxy');
var express = require('express');
var logger = require('log4js').getLogger('server');
var app = express();
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var url = require('url');

var delay = process.env.CFY_DELAY || 1500; //ms

var endpointString = process.env.CFY_ENDPOINT || 'http://10.10.1.10/'; //no need for /api/v2/, this will come as part of the backend's request from meConf.js
if (endpointString[endpointString.length - 1] !== '/') {
    endpointString = endpointString + '/'; //must end with slash;
}
var endpoint = url.parse(endpointString);
logger.info('expecting to find cloudify rest at [', endpoint.href, ']');

var mocksDir = path.join(__dirname, '../data', '/');
logger.info('expecting mocks json files to be in [', mocksDir, ']');


app.use(function findFile(req, res, next) {
    //slicing off backend prefix, query parameters and / in the beginning
    var reqUrl = req.url
        .replace('/backend/cloudify-api/', '')
        .replace(/\?.*/, '')
        .replace(/^\//, '');

    var path = mocksDir + reqUrl + '.json';
    var exists;

    //try to find a mock file for such request
    try {
        exists = fs.statSync(path);
    } catch (e) { }

    if (exists) {
        logger.info('~~~!!! found mock file: ', path, '!!!~~~');
        setTimeout(function() {
            res.send(JSON.parse(fs.readFileSync(path)));
        }, delay);
    } else {
        next();
    }
});

app.use(function proxyRequestToCloudify(req, res, next) {
    try {
        proxy(endpoint.host, {
            forwardPath: function(req) {
                var fPath = url.resolve(endpoint.path, url.parse(req.url).path.substring(1));
                logger.info('forwarding request to', fPath);
                return fPath;
            }
        })(req, res, next);
    } catch (e) {
        logger.error('unable to proxy', e);
        next(e);
    }
});

app.use(function error(errorObj, req, res/*, next */) {
    logger.error(errorObj);
    res.status(500).send({'key': 'proxy_error', stack: errorObj.stack.split('\n'), reason: errorObj.toString()});
});

var server = app.listen(3333, function() {
    var host = server.address().address;
    var port = server.address().port;

    logger.info('app is listening at http://%s:%s', host, port);
});
