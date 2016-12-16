#!/usr/bin/env node

'use strict'

const restClient = require('request-promise')
const express = require('express')
const morgan = require('morgan')
const _ = require('underscore')
const bodyParser = require('body-parser')
const session = require('express-session')
const moment = require('moment')
const Q = require('q')
const bluebird = require('bluebird')


module.exports = (() => {

    let port = process.env.PORT || 5000

    let apiBase = 'http://192.168.1.210:8083/ZAutomation/api/v1/devices/'

    let app = express()

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, contentType");
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
        next();
    });

    app.use(express.static('.'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }))

    let auth = new Buffer("admin:jerome").toString('base64')
    let headers = {
        Authorization: 'Basic ' + auth
    }

    let setState = (req, res) => {
        console.log('QUERY', req.query)
        let setStateRequest = {
            uri: apiBase + req.query.buttonName + '/command/' + req.query.state,
            qs: {},
            headers: headers,
            json: true
        }

        console.log('uri', setStateRequest.uri)

        restClient(setStateRequest)
            .then(setStateResponse => {
                console.log('RESPONSE', setStateResponse)
                res.json(setStateResponse)
            })
            .catch(err => {
                console.log('caught error setting state', err)
                res.status(500).json({
                    error: err
                })
            })

    }

    let getState = (req, res) => {

        let getStateRequest = {
            uri: apiBase + req.query.buttonName,
            qs: {},
            headers: headers,
            json: true
        }

        restClient(getStateRequest)
            .then(getStateResponse => {
                console.log('RESPONSE', getStateResponse)
                res.json(getStateResponse)
            })
            .catch(err => {
                console.log('caught error getting state', err)
                res.status(500).json({
                    error: err
                })
            })

    }

    app.get('/setState', setState)
    app.get('/getState', getState)

    app.listen(port, '0.0.0.0', () => {
        console.log(`listening on ${port}`)
    })

})()
