const { Router } = require("express");
const Checklist = require("../models/checklist.model.js");
const Activity = require("../models/activity.model.js");
const { Op } = require("sequelize");
const { from } = require("rxjs");

class ChecklistController {
  constructor() {
    this.router = Router();
    this.router.post("/create", this.create.bind(this));
    this.router.get("/all", this.all.bind(this));
    this.router.get("/pending", this.retrievePendingChecklist.bind(this));
    this.router.put("/update", this.update.bind(this));
    this.router.delete("/delete", this.delete.bind(this));
  }

  getRouter() {
    return this.router;
  }

  async create(req, res) {
    const newChecklist = req.body;

    if (!newChecklist) res.status(400).send("Missing checklist");

    const checklist = new Checklist(newChecklist);

    await checklist.save().then(() => {
      res.json(checklist);
    });
  }

  async all(req, res) {
    const startDate = req.query["start_date"];
    const endDate = req.query["end_date"];

    if (!startDate || !endDate)
      return res.status(400).send("Missing start_date or end_date");

    await Checklist.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    }).then((checklists) => res.json(checklists));
  }

  async retrievePendingChecklist(req, res) {
    const shiftWork = req.query["shift_work"];

    if (!shiftWork) return res.status(400).send("Missing shift work");

    const todayChecklists = await this.getTodaysChecklists(
      shiftWork.toString()
    );
    const activities = await this.getPendingActivities(todayChecklists);

    res.json(activities);
  }

  async getTodaysChecklists(shiftWork) {
    return await Checklist.findAll({
      where: {
        shift_work: shiftWork,
        createdAt: {
          [Op.gte]: new Date().setHours(0, 0, 0, 0),
          [Op.lt]: new Date().setHours(23, 59, 59, 999),
        },
      },
    });
  }

  async getPendingActivities(checklists) {
    return await Activity.findAll({
      where: {
        activity_id: {
          [Op.notIn]: checklists.map((checklist) => checklist.activity_id),
        },
      },
      order: [["activity_id", "ASC"]],
    });
  }

  async update(req, res) {
    const id = req.body["checklist_id"];
    const checklistToUpdate = req.body;

    if (!id) res.status(400).send("Missing checklist id");

    if (!checklistToUpdate) res.status(400).send("Missing checklist");

    await Checklist.findOne({ where: { checklist_id: id } }).then(
      (checklist) => {
        if (!checklist) {
          res.status(400).send("Checklist not found");
        } else {
          checklist.update(checklistToUpdate).then(() => {
            res.json(checklist);
          });
        }
      }
    );
  }

  async delete(req, res) {
    const id = req.query["checklist_id"];

    if (!id) res.status(400).send("Missing checklist_id");

    await Checklist.destroy({ where: { checklist_id: id } }).then(() => {
      res.json({ message: "Checklist deleted" });
    });
  }
}

module.exports = { ChecklistController };
