const express = require("express");
const router = express.Router();
const smartcar = require("smartcar");
const request = require("request");
const client = new smartcar.AuthClient({
  clientId: "6b6b5806-6938-40bd-bbe3-c99671a3f36f",
  clientSecret: "4ed147ec-9195-4a31-9b7a-4c351ecb89d8",
  redirectUri: "http://localhost:8000/exchange",
  scope: [
    "read_vehicle_info",
    "control_security",
    "control_security:unlock",
    "control_security:lock"
  ],
  testMode: true
});

router.get("/login", function(req, res) {
  const link = client.getAuthUrl();

  // redirect to the link
  res.redirect(link);
});

router.get("/callback", function(req, res, next) {
  let access;

  if (req.query.error) {
    // the user denied your requested permissions
    return next(new Error(req.query.error));
  }

  // exchange auth code for access token
  return client
    .exchangeCode(req.query.code)
    .then(function(_access) {
      // in a production app you'll want to store this in some kind of persistent storage
      access = _access;
      // get the user's vehicles
      return smartcar.getVehicleIds(access.accessToken);
    })
    .then(function(res) {
      // instantiate first vehicle in vehicle list
      const vehicle = new smartcar.Vehicle(res.vehicles[0], access.accessToken);
      // get identifying information about a vehicle
      return vehicle.info();
    })
    .then(function(data) {
      console.log(data);
      // {
      //   "id": "36ab27d0-fd9d-4455-823a-ce30af709ffc",
      //   "make": "TESLA",
      //   "model": "Model S",
      //   "year": 2014
      // }

      // json response will be sent to the user
      res.json(data);
    });
});

var vehicle;

router.post("/info", (req, res) => {
  smartcar
    .getVehicleIds("c0a05cc0-f312-4002-aeae-a4488d664c31") //1daceecf-666e-4b37-b368-1342261fa211
    .then(function(response) {
      vehicle = new smartcar.Vehicle(
        response.vehicles[0],
        "c0a05cc0-f312-4002-aeae-a4488d664c31"
      );
      console.log(vehicle);
      //console.log(response);

      res.json({ vehicle: vehicle });
    });
});

router.post("/lock", (req, res) => {
  smartcar
    .getVehicleIds("c0a05cc0-f312-4002-aeae-a4488d664c31") //1daceecf-666e-4b37-b368-1342261fa211
    .then(function(response) {
      vehicle = new smartcar.Vehicle(
        response.vehicles[0],
        "c0a05cc0-f312-4002-aeae-a4488d664c31"
      );
      console.log(vehicle);
      //console.log(response);
      vehicle.lock().then(function(response) {
        console.log(response);
        res.json({ status: response });
      });
      //res.json({ vehicle: vehicle });
    });
});

router.post("/unlock", (req, res) => {
  smartcar
    .getVehicleIds("c0a05cc0-f312-4002-aeae-a4488d664c31")
    .then(function(response) {
      vehicle = new smartcar.Vehicle(
        response.vehicles[0],
        "c0a05cc0-f312-4002-aeae-a4488d664c31"
      );
      console.log(vehicle);
      //console.log(response);
      vehicle.unlock().then(function(response) {
        console.log(response);
        res.json({ status: response });
      });
      //res.json({ vehicle: vehicle });
    });
});
module.exports = router;
