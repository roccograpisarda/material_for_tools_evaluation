const express = require('express');
const bodyParser = require('body-parser');
const {WebhookClient} = require('dialogflow-fulfillment');
const CONFIG = require('./config.json');

// Enter your calendar ID below and service account JSON below
const calendarId = CONFIG.calendarId;
const serviceAccount = {
  "type": "service_account",
 "project_id": CONFIG.project_id,
 "private_key_id": CONFIG.private_key_id,
 "private_key": CONFIG.private_key,
 "client_email": CONFIG.client_email,
 "client_id": CONFIG.client_id,
 "auth_uri": "https://accounts.google.com/o/oauth2/auth",
 "token_uri": "https://oauth2.googleapis.com/token",
 "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
 "client_x509_cert_url": CONFIG.client_x509_cert_url}; // Starts with {"type": "service_account", ...

const {google} = require('googleapis');

// Set up Google Calendar Service account credentials
const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');
process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

const timeZoneOffset = '+02:00';

const app = express()
app.use(bodyParser.json())

const port = parseInt(process.env.PORT) || 8080;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.get('/', async (req, res) => {
  res.send('Hello World')
});

// Endpoint to be used with the fullfillment on DialogFlow
app.post('/dialogflow-fulfillment', (request, response) => {
    console.log("Call to create an event on Google Calendar")
    dialogflowFulfillment(request, response)
})


const dialogflowFulfillment = (request, response) => {
  const agent = new WebhookClient({ request, response });
  const appointment_type = agent.parameters.AppointmentType
  
  function makeAppointment (agent) {
    // Calculate appointment start and end datetimes (end = +1hr from start)
    const AppointmentDate = agent.parameters.date.split('T')[0];
    const AppointmentTime = agent.parameters.time.split('T')[1].substr(0,8);
    const dateTimeStart = new Date(AppointmentDate + 'T' + AppointmentTime+timeZoneOffset);
    const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));

    // Check the availibility of the time, and make an appointment if there is time on the calendar
    return createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type).then(() => {
      agent.add(`Let me see if we can fit you in on ${AppointmentDate} at ${AppointmentTime}! Yes It is fine!.`);
    }).catch(() => {
      agent.add(`I'm sorry, there are no slots available for ${AppointmentDate} at ${AppointmentTime}.`);
    });
  }

  let intentMap = new Map();
  intentMap.set('Schedule Appointment', makeAppointment);
  agent.handleRequest(intentMap);
}

function createCalendarEvent (dateTimeStart, dateTimeEnd, appointment_type) {
  return new Promise((resolve, reject) => {
    calendar.events.list({
      auth: serviceAccountAuth, // List events for time period
      calendarId: calendarId,
      timeMin: dateTimeStart.toISOString(),
      timeMax: dateTimeEnd.toISOString()
    }, (err, calendarResponse) => {
      // Check if there is a event already on the Calendar
      if (err || calendarResponse.data.items.length > 0) {
        reject(err || new Error('Requested time conflicts with another appointment'));
      } else {
        // Create event for the requested time period
        calendar.events.insert({ auth: serviceAccountAuth,
          calendarId: calendarId,
          resource: {summary: appointment_type +' Appointment', description: appointment_type,
            start: {dateTime: dateTimeStart},
            end: {dateTime: dateTimeEnd}}
        }, (err, event) => {
          err ? reject(err) : resolve(event);
        }
        );
      }
    });
  });
}
