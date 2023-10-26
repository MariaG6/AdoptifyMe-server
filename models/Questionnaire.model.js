const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const questionnaireSchema = new mongoose.Schema(
  {
    designatedArea: {
      type: String,
      enum: ["all the house", "part of it", "It's not clear yet"],
      required: [true, "This field is required."],
    },
    landlordAware: {
      type: String,
      enum: ["yes", "no"],
      required: [true, "This field is required."],
    },
    whereStaysWhenNotHome: {
      type: String,
      enum: [
        "outside the house",
        "all the house",
        "part of it",
        "with family/friends",
        "It's not clear yet",
      ],
      required: [true, "This field is required."],
    },
    familyInfo: {
      type: String,
      enum: ["yes", "no"],
      required: [true, "This field is required."],
    },
    childrenCharacteristics: {
      type: String,
      enum: ["I dont have", "calm", "energetic", "responsable"],
      required: [true, "This field is required."],
    },
    annualExpenses: {
      type: String,
      enum: ["yes", "no"],
      required: [true, "This field is required."],
    },
    employed: {
      type: String,
      enum: ["yes", "no"],
      required: [true, "This field is required."],
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
      enum: ["leftovers", "bread", "dry food", "homemade food"],
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
    observations: {
      type: String,
    },
    pet: { type: Schema.Types.ObjectId, ref: "Pet" },
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    isAccepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);

module.exports = Questionnaire;
