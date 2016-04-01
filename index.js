'use strict';

/*******************************************************************************
 EXTERNAL DEPENDENCIES
 ******************************************************************************/

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var stats = require('stats-lite');
var express = require('express');

/*******************************************************************************
 GLOBALS
 ******************************************************************************/

var app = express();

/*******************************************************************************
 STATIC ASSETS
 ******************************************************************************/

app.use('/', express.static('www'));
app.use('/node_modules', express.static('node_modules'));

/*******************************************************************************
 HTML ENDPOINTS
 ******************************************************************************/

app.get('/', function (req, res) {
    return res.sendFile('index.html');
});

/*******************************************************************************
 JSON ENDPOINTS
 ******************************************************************************/

app.get('/data/files', function (req, res) {
    fs.readdir('data', function (error, files) {
        if (error) {
            return res.status(500).json(error);
        } else {
            return res.status(200).json(files);
        }
    });
});

app.get('/data/file/:name', function (req, res) {
    fs.readFile(path.join('data', req.params.name), 'utf8', function (error, data) {
        if (error) {
            return res.status(500).json(error);
        } else {
            return res.status(200).json(_.map(mapFile(data)));
        }
    });
});

function mapFile(fileContents, fileIndex) {
    function isStringNotEmpty(string) {
        return string.length > 0;
    }

    // transform "number,number" to [ number, number ]
    var rawData = _.map(_.filter(fileContents.split('\n'), isStringNotEmpty), mapFileLine);

    // get the values in each dimension
    var xValues = _.map(rawData, '0');
    var yValues = _.map(rawData, '1');

    // get the allowable ranges
    var ranges = {
        x: {
            min: stats.percentile(xValues, 0.001),
            max: stats.percentile(xValues, 0.999)
        },
        y: {
            min: stats.percentile(yValues, 0.001),
            max: stats.percentile(yValues, 0.999)
        }
    };

    // filter out points outside the range
    return _.filter(rawData, function (point) {
        var x = point[0];
        var y = point[1];
        return ranges.x.min <= x && x <= ranges.x.max &&
               ranges.y.min <= y && y <= ranges.y.max;
    });
}

function mapFileLine(fileLine) {
    return _.map(fileLine.split(','), _.toNumber);  // [x,y]
}

/*******************************************************************************
 SERVE
 ******************************************************************************/

var server = app.listen(process.env.PORT || 8080, function () {
    console.log('Listening on port %d...', server.address().port);
});
