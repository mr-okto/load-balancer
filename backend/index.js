const codes = require('http-status-codes');
const express = require('express');
const fetch = require("node-fetch")
const prom_api_metrics = require('prometheus-api-metrics');
const prom_client = require('prom-client');

const APP_PORT = 8000;
const METRICS_PORT = 8080;


const registry = new prom_client.Registry();

const reqCounter = new prom_client.Counter({
    name: 'request_counter',
    help: 'Node requests counter',
});

registry.registerMetric(reqCounter);

const metrics = express();
metrics.use(prom_api_metrics());

metrics.listen(METRICS_PORT, function() {
    console.log(`Metrics server starting on :${METRICS_PORT}`);
});

const app = express();

let nodeActive = true;

app.get('/activate', function(req, res, next) {
    nodeActive = true;
    res.sendStatus(codes.StatusCodes.OK);
});

app.get('/deactivate', function(req, res, next) {
    nodeActive = false;
    res.sendStatus(codes.StatusCodes.INTERNAL_SERVER_ERROR);
});

app.get('/', function(req, res, next) {
    reqCounter.inc(1);
    fetch('https://thatcopy.pw/catapi/rest/')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (nodeActive) {
                res.send(data);
            } else {
                res.sendStatus(codes.StatusCodes.INTERNAL_SERVER_ERROR);
            }
        });
});


app.listen(APP_PORT, function () {
    console.log(`App server starting on :${APP_PORT}`);
});

