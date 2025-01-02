// Import dependencies and set up http server
const express = require("express"),
bodyParser = require("body-parser"),
{ urlencoded, json } = require("body-parser"),
config = require('./config');
const dotenv = require('dotenv');

// const fetch = require('node-fetch'); // Ensure you have node-fetch installed: npm install node-fetch
const fs = require('fs');

dotenv.config();

app = express().use(bodyParser.json());

// app.post("/messaging-webhook", (req, res) => {
//     let body = req.body;
  
//     console.log(`\u{1F7EA} Received webhook:`);
//     console.dir(body, { depth: null });

//     // Send a 200 OK response if this is a page webhook

//   if (body.object === "page") {
//     // Returns a '200 OK' response to all requests
//     res.status(200).send("EVENT_RECEIVED");

//     // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
//     // Iterate over each entry - there may be multiple if batched
//     body.entry.forEach(function(entry) {

//       // Get the webhook event. entry.messaging is an array, but 
//       // will only ever contain one event, so we get index 0
//       let webhook_event = entry.messaging[0];
//       console.log(webhook_event);

//       // Get the sender PSID
//       let sender_psid = webhook_event.sender.id;
//       console.log('Sender PSID: ' + sender_psid);
      
//     });

//   } else {
//     // Return a '404 Not Found' if event is not from a page subscription
//     res.sendStatus(404);
//   }
// });

app.post("/messaging-webhook", function (request, response) {
  console.log(request.body);
  console.log('Incoming webhook: ' + JSON.stringify(request.body));

  // for text
  // console.log('Message contents: ' + JSON.stringify(request.body.entry[0].changes[0].value.messages[0].text.body));

  // for image
  console.log('Message contents: ' + JSON.stringify(request.body.entry[0].changes[0].value.messages[0].image));

  const accessToken = process.env.ACCESS_TOKEN;

  const headers = {
    'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
  };

  const imageUrl = `https://graph.facebook.com/v11.0/${request.body.entry[0].changes[0].value.messages[0].image.id}?access_token=${accessToken}`;
  console.log('Image URL: ' + imageUrl);

  getMediaUrl(imageUrl, headers);
  response.sendStatus(200);
});

// Function to get the media URL
async function getMediaUrl(mediaUrl, headers) {
  try {
    const response = await fetch(mediaUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const actualMediaUrl = data.url; 
    console.log('Media URL:', actualMediaUrl);

    // Dynamically import the open module
    const open = (await import('open')).default;

    
    downloadMedia(actualMediaUrl, headers, './media_file.jpeg');

    // Open the media URL in the default web browser
    // await open(actualMediaUrl);
  } catch (error) {
    console.error('Error retrieving media URL:', error.message);
    if (error.response) {
      const errorData = await error.response.json();
      console.error('Error details:', errorData);
    }
  }
}

// Function to download the media file
async function downloadMedia(url, headers, filePath) {
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const buffer = await response.buffer();
    fs.writeFileSync(filePath, buffer);
    console.log('Media file downloaded successfully');
  } catch (error) {
    console.error('Error downloading media file:', error.message);
  }
}

// Add support for GET requests to our webhook
app.get("/messaging-webhook", (req, res) => {
  
  // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    // Check if a token and mode is in the query string of the request
    if (mode && token) {
      // Check the mode and token sent is correct
      if (mode === "subscribe" && token === config.verifyToken) {
        // Respond with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        console.log()
        res.status(200).send(challenge);
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
});


// Verify that the callback came from Facebook.
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature-256"];

  if (!signature) {
    console.warn(`Couldn't find "x-hub-signature-256" in headers.`);
  } else {
    var elements = signature.split("=");
    var signatureHash = elements[1];
    var expectedHash = crypto
      .createHmac("sha256", config.appSecret)
      .update(buf)
      .digest("hex");
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

// Handles messages events
function handleMessage(sender_psid, received_message) {

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  
}

// Add this code to start the server and listen on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

console.log('hello world')
// const accessToken = process.env.ACCESS_TOKEN;
// console.log('Access token: ' + accessToken);