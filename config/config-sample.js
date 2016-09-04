module.exports = {
    default_access_key: "",
    default_secret_key: "",
    default_timezone: "Asia/Manila",
    default_region: "us-east-1",
    scheduler: [
        {
            cron: "* * * * * *",
            instances: ['xxxxxx'],
            action: "start"
            region: "ap-southeast-1"
        }
    ]
};
