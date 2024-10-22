const { sequelize } = require("./database-config.js");
const User = require("../models/user.model.js");
const Activity = require("../models/activity.model.js");
const Checklist = require("../models/checklist.model.js");

async function connect() {
  await sequelize
    .authenticate()
    .then(async () => {
      console.log("Connection has been established successfully.");

      // Create User table
      await User.sync({ force: false })
        .then(() => {
          console.log("User table has been created successfully.");
        })
        .catch((error) => {
          console.error("Unable to create User table  :", error);
        });

      // Create Activity table
      await Activity.sync({ force: false })
        .then(() => {
          console.log("Activity table has been created successfully.");
        })
        .catch((error) => {
          console.error("Unable to create Activity table  :", error);
        });

      // Create Checklist table
      await Checklist.sync({ force: false })
        .then(() => {
          console.log("Checklist table has been created successfully.");
        })
        .catch((error) => {
          console.error("Unable to create Checklist table  :", error);
        });
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
    });
}

async function createTables() {
  await sequelize
    .sync({ force: false })
    .then(() => {
      console.log("Tables have been created successfully.");
    })
    .catch((error) => {
      console.error("Unable to create tables:", error);
    });
}

module.exports = { connect, createTables };
