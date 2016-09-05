(function() {
    "use strict";
    var cron    = require('cron');
    var Logger  = require('logger');
    var logger  = new Logger('ec2-scheduler');
    var _       = require('lodash')._;
    var Promise = require('bluebird');
    var AWS     = require('aws-sdk');


    var EC2Control = function(config) {
        var self = this;
        self.config = config;
        self.ec2 = new AWS.EC2({
            accessKeyId: config.access_key,
            secretAccessKey: config.secret_key,
            region: config.region
        });

        self.stop = function() {
            logger.info('stopping instances', self.config.instances);
            var params = {
                InstanceIds: self.config.instances
            };

            self.ec2.stopInstances(params, function(err, data) {
                if (err) {
                    logger.warn("could not stop instances", err.message); // an error occurred
                } else {
                    logger.info('stopped instances', self.config.instances);
                }
            });
        };

        self.start = function() {
            logger.info('starting instances', self.config.instances);
            var params = {
                InstanceIds: self.config.instances
            };

            self.ec2.startInstances(params, function(err, data) {
                if (err) {
                    logger.warn("could not start instances", err.message); // an error occurred
                } else {
                    logger.info('started instances', self.config.instances);
                }
            });
        };
    };
    var Scheduler = function(config) {
        var self = this;
        self.config = config;



        self.start = function() {
            logger.info('config', self.config);

            if(!self.config.scheduler || self.config.scheduler.length <= 0) {
                logger.warn("nothing to schedule");
                return;
            }

            _.each(self.config.scheduler, function(sched) {
                var conf = {
                    access_key : sched.access_key || self.config.default_access_key,
                    secret_key : sched.secret_key || self.config.default_secret_key,
                    region     : sched.region || self.config.default_region,
                    timezone   : sched.timezone || self.config.default_timezone,
                    cron       : sched.cron,
                    instances  : sched.instances,
                    action     : sched.action
                };

                self.schedule(conf);

            });
        };


        self.schedule = function(config) {
            logger.info('scheduling ', config.cron, config.instances);
            var job = new cron.CronJob(config.cron, function() {
                var control = new EC2Control(config);
                control[config.action]();
            },null, true, config.timezone);
        };
    };

    module.exports = Scheduler;
})();
