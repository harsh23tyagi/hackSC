/**
 *
 * ~ Created By @HarshTyagi
 *
 *
 * This file is the main publisher file
 * We have created only one URL for now to allow publishing to a topic
 * more routes can be added in the similar fashion as done below
 * The router variable is exported as this route will be used from the main server.js
 * The connection to the mqtt server is via client variable, which is declared in ../config/mqttKeys as a singleton
 *
 * While calling the URL:
 * mention the following in the json body of the url request:
 *
 * topic: mqtt/demo
 * paylod: 1  ------ 1 for switch on and 0 for off and any other to kill the app on raspberry pi
 *
 * I am using postman to send the post request
 *
 *
 */

const express = require("express");
const router = express.Router();

//using singleton client nstane
const client = require("../config/mqttKeys").client;
router.post("/test", (req, res) => {
  //var obj = JSON.stringify(req.body);
  var topic;
  var payload;

  if (req.body.topic != null) {
    try {
      topic = String(req.body.topic);
      payload = String(req.body.payload);
    } catch {}
  } else {
    var obj = JSON.parse(Object.keys(req.body)[0]);
    topic = String(obj.topic);
    payload = String(obj.payload);
  }

  // var obj = JSON.parse(Object.keys(req.body)[0]);
  // topic = String(obj.topic);
  // payload = String(obj.payload);
  console.log(topic);
  console.log(payload);

  try {
    client.publish(topic, payload);
    res.status(200).json({
      topic: "Published"
    });
  } catch (err) {
    res.status(400).json({
      topic: err
    });
  }
});

module.exports = router;
