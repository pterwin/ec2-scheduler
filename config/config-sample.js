module.exports = {
    // aws access key
    default_access_key: "",
    // aws secret key
    default_secret_key: "",
    default_timezone: "Asia/Manila",
    default_region: "us-east-1",

    // default settings can be overridden in the
    // actual job
    scheduler: [
        {
            cron: "* * * * * *",
            instances: ['instace-id'],
            //available actions are stop and start
            action: "start",

            access_key: "",
            secret_key: "",
            region: "ap-southeast-1",
        }
    ]
};
