# Appointment Scheduler Google Calendar Backend

This repository contains the backend logic for the bot Appointment Scheduler Google Calendar.

## Getting started

Run the following commands:

```
git clone https://gitlab.com/unimib-chatbot-testing/appointments-scheduler-google-calendar-backend.git
cd appointments-scheduler-google-calendar-backend
```

Create a file called config.json using the content of config.json.example file contained in this repository.

## Local test

Run the following commands:

```
npm install
node index.js
```

Open your browser and load the following address: `http://localhost:8080`. If everything is set correctly, yuu should see the message `Hello World`.

## Deploy to Space (ex Deta)

Follow the instructions reported in [this page](https://deta.space/docs/en/introduction/first-app) of the documentation to create a Space project.

Finally, push the project to Space with the command `space push`.

After running the command, you should see the public address where the application has been deployed. If the address is not shown, open the [Space website](https://deta.space), and after the login, you will see a block associated with the app that you have just deployed. Click on the three dots, then open `Settings`, `Domains` and you will find the public domain of your application.

## More details

You can read the [Wiki](https://gitlab.com/unimib-chatbot-testing/appointments-scheduler-google-calendar-backend/-/wikis/Space,-Express,-and-DialogFlow) in order to understand how to use Express and Space with DialogFlow.