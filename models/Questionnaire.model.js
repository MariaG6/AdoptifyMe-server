const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const questionnaireSchema = new mongoose.Schema({
  designatedArea: {
    type: String,
    enum: ["all the house", "pat of it", "Its not clear yet"],
    required: [true, "This field is required."],
  },
  landlordAware: {
    type: String,
    enum: ["yes", "no"],
  },
  whereStaysWhenNotHome: {
    type: String,
    required: [true, "This field is required."],
  },
  familyInfo: {
    type: String,
    required: [true, "This field is required."],
  },
  childrenCharacteristics: {
    type: String,
    required: [true, "This field is required."],
  },
  annualExpenses: {
    type: String,
    required: [true, "This field is required."],
  },
  employed: {
    type: String,
    enum: ["yes", "no"],
  },
  vacationPlans: {
    type: String,
    required: [true, "This field is required."],
  },
  timeAloneAtHome: {
    type: String,
    required: [true, "This field is required."],
  },
  expenses: {
    type: String,
    required: [true, "This field is required."],
  },
  suitableFood: {
    type: String,
    required: [true, "This field is required."],
  },
  previousAnimals: {
    type: String,
    required: [true, "This field is required."],
  },
  whyAdopt: {
    type: String,
    required: [true, "This field is required."], 
  },
  walkingFrequency: {
    type: String,
    required: [true, "This field is required."],
  },
  willingnessToTrain: {
    type: String,
    required: [true, "This field is required."],
  },
  behaviorResponse: {
    type: String,
    required: [true, "This field is required."],
  },
  preAdoptionFollowUps: {
    type: String,
    required: [true, "This field is required."],
  },
  pet: { type: Schema.Types.ObjectId, ref: "Pet" },
  shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  isAccepted:{ type: Boolean, default: false },
});

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);

module.exports = Questionnaire;
