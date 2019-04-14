const Diagnostics = require("Diagnostics");
const Scene = require("Scene");
const FaceTracking = require("FaceTracking");
const HandTracking = require("HandTracking");
const Networking = require("Networking");

const url = "https://428195ae.ngrok.io/mqtt/test";

//if you want to unlock tesla-- call the following urls in request functions
const urlLock = "https://428195ae.ngrok.io/smart/lock";
const urlUnlock = "https://428195ae.ngrok.io/smart/unlock";
//else call the url function for raspberry pi

// rpi requests
const request = {
  // The HTTP Method of the request
  // (https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
  method: "POST",

  // The HTTP Headers of the request
  // (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
  headers: { "Content-type": "application/json; charset=UTF-8" },

  // The data to send, in string format
  //var obj = J{"topic":"mqtt/demo", "payload":1};
  body: JSON.stringify({ topic: "mqtt/demo", payload: 1 })
};

const requestLow = {
  // The HTTP Method of the request
  // (https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
  method: "POST",

  // The HTTP Headers of the request
  // (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
  headers: { "Content-type": "application/json; charset=UTF-8" },

  // The data to send, in string format
  //var obj = J{"topic":"mqtt/demo", "payload":1};
  body: JSON.stringify({ topic: "mqtt/demo", payload: 0 })
};

//--rpi requests end

//--tesla requests

//--tesla requests end

var Patches = require("Patches");

var x = Patches.getVectorValue("input").x;
var y = Patches.getVectorValue("input").y;
// const Reactive = require("Reactive");

Diagnostics.watch("X: ", x);
Diagnostics.watch("Y: ", y);
var flagOne = true;
var flagTwo = false;

Patches.getVectorValue("input")
  .x.monitor()
  .subscribe(function() {
    if (x.pinLastValue() > 8 && x.pinLastValue() < 15 && flagOne) {
      Networking.fetch(url, request) // just change the url to urlLock to lock tesla
        .then(function(result) {
          // Check the status of the result
          // (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
          if (result.status == 200) {
            // If the request was successful, chain the JSON forward
            Diagnostics.log("Success");
            return result.json();
          } else {
            Diagnostics.log("failure");
          }

          // If the request was not successful, throw an error
          throw new Error("HTTP status code - " + result.status);
        })
        .then(function(json) {
          // Log the JSON obtained by the successful request
          Diagnostics.log("Successfully sent - " + json.topic);
        })
        .catch(function(error) {
          // Log any errors that may have happened with the request
          Diagnostics.log("Error - " + error);
        });
      flagOne = false;
      flagTwo = true;
    }

    if (x.pinLastValue() < 5 && x.pinLastValue() > 1 && flagTwo) {
      Networking.fetch(url, requestLow) //just change the url to urlUnlock for unlocking tesla- we are using hard coded tokens for now
        .then(function(result) {
          // Check the status of the result
          // (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
          if (result.status == 200) {
            // If the request was successful, chain the JSON forward
            Diagnostics.log("Success");
            return result.json();
          } else {
            Diagnostics.log("failure");
          }

          // If the request was not successful, throw an error
          throw new Error("HTTP status code - " + result.status);
        })
        .then(function(json) {
          // Log the JSON obtained by the successful request
          Diagnostics.log("Successfully sent - " + json.topic);
        })
        .catch(function(error) {
          // Log any errors that may have happened with the request
          Diagnostics.log("Error - " + error);
        });
      flagTwo = false;
      flagOne = true;
    }
  });

// Patches.getVectorValue("input")
//   .y.monitor()
//   .subscribe(function() {
//     if (y.pinLastValue() < -12 && x.pinLastValue() > -15) {
//       Networking.fetch(url, requestLow)
//         .then(function(result) {
//           // Check the status of the result
//           // (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
//           if (result.status == 200) {
//             // If the request was successful, chain the JSON forward
//             Diagnostics.log("Success");
//             return result.json();
//           } else {
//             Diagnostics.log("failure");
//           }

//           // If the request was not successful, throw an error
//           throw new Error("HTTP status code - " + result.status);
//         })
//         .then(function(json) {
//           // Log the JSON obtained by the successful request
//           Diagnostics.log("Successfully sent - " + json.topic);
//         })
//         .catch(function(error) {
//           // Log any errors that may have happened with the request
//           Diagnostics.log("Error - " + error);
//         });
//     }
//   });

// //Diagnostics.watch("b:", b);
// // Patches.getVectorValue("input").subscribe(function(e) {
// //   Diagnostics.log("Tap!");
// // });

// //Diagnostics.log("Hn",hand.center);
// //Diagnostics.watch("Position - ", hand.cameraTransform);

//==============================================================================
// Create the request
//==============================================================================
