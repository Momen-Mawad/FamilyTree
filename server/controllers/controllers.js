const { Person, Family, User } = require("../models/models");

// FAMILY CONTROLLERS
// Create Family
const createFamily = async (req, res) => {
  try {
    const { familyName } = req.body;
    const family = new Family({ familyName });
    await family.save();
    res.status(201).json(family);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Families
const getAllFamilies = async (req, res) => {
  try {
    const families = await Family.find();
    res.json(families);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single Family with nested members
const getFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) {
      return res.status(404).json({ error: "Family not found" });
    }

    // 1. Fetch all members of the family
    const members = await Person.find({ family: family._id });

    // 2. Create a map for quick access to members by their ID
    const memberMap = new Map();
    members.forEach((member) => {
      const memberObj = member.toObject();
      memberObj.children = [];
      memberMap.set(memberObj._id.toString(), memberObj);
    });

    // 3. Build the nested tree structure (Second Pass)
    const rootMembers = [];
    memberMap.forEach((member) => {
      // If a member has a parent, find the parent in the map and add the member as a child
      if (member.parent) {
        const parent = memberMap.get(member.parent.toString());
        // Make sure the parent exists in the map
        if (parent) {
          parent.children.push(member);
        } else {
          // This member's parent is not in the fetched list (e.g., they belong to another family)
          // so we treat them as a root for this specific family tree
          rootMembers.push(member);
        }
      } else {
        // If a member has no parent, they are a root of the family tree
        rootMembers.push(member);
      }
    });

    // 4. Return the family object with the nested member structure
    res.json({ ...family.toObject(), members: rootMembers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Family
const updateFamily = async (req, res) => {
  try {
    const { familyName } = req.body;
    const family = await Family.findByIdAndUpdate(
      req.params.id,
      { familyName },
      { new: true },
    );
    if (!family) return res.status(404).json({ error: "Family not found" });
    res.json(family);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Family
const deleteFamily = async (req, res) => {
  try {
    const family = await Family.findByIdAndDelete(req.params.id);
    if (!family) return res.status(404).json({ error: "Family not found" });
    // Optionally, set family to null for all persons in this family
    await Person.updateMany({ family: family._id }, { $unset: { family: "" } });
    res.json({ message: `Family ${family.familyName} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PERSON CONTROLLERS
// Create Person
const createPerson = async (req, res) => {
  try {
    const {
      name,
      gender,
      birthDate,
      deathDate,
      photo,
      bio,
      parentId,
      familyId,
    } = req.body;

    console.log(req.body);

    // parent: single ObjectId (one parent)
    const person = new Person({
      name,
      gender,
      birthDate,
      deathDate,
      photo,
      bio,
      parent: parentId ? parentId : null,
      family: familyId,
    });
    await person.save();
    res.status(201).json(person);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Persons
const getAllPersons = async (req, res) => {
  try {
    const persons = await Person.find().populate("parent").populate("family");
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single Person (with children)
const getPerson = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id)
      .populate("parent")
      .populate("family");
    if (!person) return res.status(404).json({ error: "Person not found" });
    // Find children (where this person is parent)
    const children = await Person.find({ parents: person._id });
    res.json({ ...person.toObject(), children });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Person
const updatePerson = async (req, res) => {
  try {
    const {
      name,
      gender,
      birthDate,
      deathDate,
      photo,
      bio,
      parentId,
      familyId,
    } = req.body;

    const update = {
      name,
      gender,
      birthDate,
      deathDate,
      photo,
      bio,
      parent: parentId ? parentId : null,
      family: familyId,
    };

    const person = await Person.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!person) return res.status(404).json({ error: "Person not found" });
    res.json(person);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Person
const deletePerson = async (req, res) => {
  try {
    console.log("id", req.params.id);
    const person = await Person.findByIdAndDelete(req.params.id);
    if (!person) return res.status(404).json({ error: "Person not found" });
    // Optionally, remove this person from any children's parents array
    await Person.updateMany(
      { parent: person._id },
      { $pull: { parent: person._id } },
    );
    res.json({ message: "Person deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// AUTH CONTROLLERS
const bcrypt = require("bcryptjs"); // https://github.com/dcodeIO/bcrypt.js#readme
const jwt = require("jsonwebtoken");
const validator = require("validator");
const jwt_secret = process.env.jwt_secret;
// the client is sending this body object
//  {
//     email: form.email,
//     password: form.password,
//     password2: form.password2
//  }
const register = async (req, res) => {
  const { email, password, password2, family } = req.body;
  if (!email || !password || !password2 || !family) {
    return res.status(400).json({ ok: false, message: "All fields required" });
  }
  if (password !== password2) {
    return res.status(400).json({ ok: false, message: "Passwords must match" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ ok: false, message: "Invalid email" });
  }
  try {
    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ ok: false, message: "User exists!" });

    // Generate a salt
    const salt = bcrypt.genSaltSync(10);
    // Hash the password with the salt
    const hash = bcrypt.hashSync(password, salt);

    // create family document for this user
    const familyDoc = new Family({ familyName: family });
    await familyDoc.save();

    const newUser = {
      email,
      password: hash,
      family: familyDoc._id,
    };
    await User.create(newUser);
    res.status(201).json({ ok: true, message: "Successfully registered" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, error });
  }
};
// the client is sending this body object
//  {
//     email: form.email,
//     password: form.password
//  }
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ ok: false, message: "All fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ ok: false, message: "Invalid email provided" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ ok: false, message: "Invalid user provided" });

    const match = bcrypt.compareSync(password, user.password);
    if (match) {
      const token = jwt.sign(
        { userEmail: user.email, familyId: user.family },
        jwt_secret,
        {
          expiresIn: "1h",
        },
      );
      res.status(200).json({ ok: true, message: "welcome back", token, email });
    } else {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid data provided" });
    }
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

const verify_token = (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, jwt_secret, (err, succ) => {
    err
      ? res.status(400).json({ ok: false, message: "Token is corrupted" })
      : res.status(200).json({ ok: true, succ });
  });
};

module.exports = {
  // Person CRUD
  createPerson,
  getAllPersons,
  getPerson,
  updatePerson,
  deletePerson,
  // Family CRUD
  createFamily,
  getAllFamilies,
  getFamily,
  updateFamily,
  deleteFamily,
  // Auth
  register,
  login,
  verify_token,
};
