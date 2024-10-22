const { DataTypes, Model, QueryTypes } = require("sequelize");
const { sequelize } = require("../database/database-config.js");
const User = require("./user.model.js");
const Activity = require("./activity.model.js");

class Checklist extends Model {}

Checklist.init(
  {
    checklist_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    shift_work: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.CHAR(2),
      allowNull: false,
      defaultValue: "KO",
    },
    action_plan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    time_spent: {
      type: "INTERVAL",
      allowNull: false,
      defaultValue: "00:00:00",
    },
  },
  {
    sequelize,
    modelName: "Checklist",
    tableName: "checklists",
    createdAt: true,
    updatedAt: true,
  }
);

User.hasMany(Checklist, {
  foreignKey: "user_id",
  as: "checklists",
});

Checklist.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Activity.hasMany(Checklist, {
  foreignKey: "activity_id",
  as: "checklists",
});

Checklist.belongsTo(Activity, {
  foreignKey: "activity_id",
  as: "activity",
});

Checklist.afterCreate(async (checklist, options) => {
  console.log("AfterCreate hook called");
  const activityId = checklist.activity_id;

  try {
    await sequelize.query(
      `UPDATE activities
        SET estimated_time = (
          SELECT date_trunc('second', make_interval(secs => AVG(EXTRACT(EPOCH FROM time_spent))))
            FROM checklists
            WHERE activity_id = :activityId
        )
        WHERE activity_id = :activityId`,
      {
        replacements: { activityId },
        type: QueryTypes.UPDATE,
        transaction: options.transaction,
      }
    );
    console.log("Update executed");
  } catch (error) {
    console.error("Error during update:", error);
    throw error;
  }
});

module.exports = Checklist;
