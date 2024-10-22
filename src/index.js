const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server: HttpServer } = require("http");
const multer = require("multer");
const { fileUpload } = require("./controllers/uploads.controller");
const { UsersController } = require("./controllers/users.controller");
const { ActivityController } = require("./controllers/activities.controller");
const { ChecklistController } = require("./controllers/checklist.controller");
const { connect, createTables } = require("./database/database");

// The Express app is exported so that it can be used by serverless Functions.
function app() {
  const server = express();
  server.use(cors());
  server.use(express.json({ limit: "50mb" }));
  server.use(express.urlencoded({ limit: "50mb", extended: true }));
  server.use(bodyParser.json());

  server.use(express.urlencoded({ extended: true }));

  const serverDistFolder = __dirname;

  // Enable parsing of application/json and application/x-www-form-urlencoded
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Database connection
  connect().then(() => {
    // Create tables after successful connection
    createTables();
  });

  // File upload
  const upload = multer({ dest: "uploads/" });
  fileUpload(server, upload, serverDistFolder);

  // Handle users
  const usersController = new UsersController();
  server.use("/api/users", usersController.getRouter());

  // Handle activities
  const activityController = new ActivityController();
  server.use("/api/activities", activityController.getRouter());

  // Handle checklists
  const checklistController = new ChecklistController();
  server.use("/api/checklists", checklistController.getRouter());

  return { app: server };
}

function run() {
  const port = process.env["PORT"] || 4000;

  // Start up the Express server
  const { app: expressApp } = app();

  // Create a HTTP server instance with the Express app
  const server = new HttpServer(expressApp);
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
