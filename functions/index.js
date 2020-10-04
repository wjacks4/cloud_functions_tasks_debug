const functions = require('firebase-functions');
const app = require('express')();
const cors = require('cors');
const dotenv = require('dotenv').config();

//THIS IS CRUCIAL - sets access-control-allow-origin header to *
app.use(cors());

// Test Handlers
const {
	manuallyCreateCloudTask
	, testEndpoint
} = require('./handlers/test');

// Test routes
app.post('/manuallyCreateCloudTask', manuallyCreateCloudTask)
app.post('/testEndpoint', testEndpoint)

// create api
exports.api = functions.https.onRequest(app);