# Oengus webhook application
A sample application that listens for oengus webhooks

## setup instructions
1. Set your bot credential and text channel id in the `config.js` file
2. Make sure the port of the application is visible to the public (default is `3000`)
3. edit your marathon's settings for the webhook, this is most likely `http://YOUR_SERVER_IP:3000/MARATHON_SLUG`
4. replace `MARATHON_SLUG` with your marathon slug, e.g. `UKSGw2021` for `https://oengus.io/marathon/UKSGw2021`
