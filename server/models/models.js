const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"] },
  birthDate: { type: Date },
  deathDate: { type: Date },
  photo: { type: String }, // URL to photo
  bio: { type: String },
  parent: { type: Schema.Types.ObjectId, ref: "Person" }, // Single parent reference
  family: { type: Schema.Types.ObjectId, ref: "Family", required: true }, // Reference to Family
  created: { type: Date, default: Date.now },
});

const FamilySchema = new Schema({
  familyName: { type: String, required: true },
  created: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    family: { type: Schema.Types.ObjectId, ref: "Family", required: true },
    created: { type: Date, default: Date.now },
  },
  { strictQuery: false },
);

const Person = mongoose.model("Person", PersonSchema);
const Family = mongoose.model("Family", FamilySchema);
const User = mongoose.model("User", UserSchema);

module.exports = { Person, Family, User };
