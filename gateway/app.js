const express = require("express");
const http = require("http");

const app = express();
const port = 80;

// Define a route for the root path, which just returns a plain text response
app.get("/", (req, res) => {
  res.send("Gateway Service");
});

// Define a route for the /api/data path, which retrieves data from the Data Service
app.get("/api/data", (req, res) => {
  // Define the options for the HTTP request to the Data Service
  const options = {
    hostname: "data",
    port: 3000,
    path: "/",
    method: "GET"
  };

  // Create a new HTTP request to the Data Service
  const request = http.request(options, (response) => {
    let data = "";

    // Collect the response data from the Data Service
    response.on("data", (chunk) => {
      data += chunk;
    });

    // When the response is finished, send the data to the client
    response.on("end", () => {
      res.json(JSON.parse(data));
    });
  });

  // If there is an error with the HTTP request, send a 500 response to the client
  request.on("error", (error) => {
    console.error("Error retrieving data:", error);
    res.status(500).send("Something went wrong!");
  });

  // Send the HTTP request to the Data Service
  request.end();
});

// Define a route for the /api/user path, which retrieves user data from the User Service
app.get("/api/user", (req, res) => {
  // Define the options for the HTTP request to the User Service
  const options = {
    hostname: "user",
    port: 4000,
    path: "/",
    method: "GET"
  };

  // Create a new HTTP request to the User Service
  const request = http.request(options, (response) => {
    let data = "";

    // Collect the response data from the User Service
    response.on("data", (chunk) => {
      data += chunk;
    });

    // When the response is finished, send the data to the client
    response.on("end", () => {
      res.json(JSON.parse(data));
    });
  });

  // If there is an error with the HTTP request, send a 500 response to the client
  request.on("error", (error) => {
    console.error("Error retrieving user data:", error);
    res.status(500).send("Something went wrong!");
  });

  // Send the HTTP request to the User Service
  request.end();
});

// Start the Express app listening on the specified port
app.listen(port, () => {
  console.log(`Gateway Service listening on port ${port}`);
});
