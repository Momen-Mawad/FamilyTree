const { Person, Family, User } = require("../models/models");
const { nanoid } = require("nanoid");
const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");

function buildFamilyTree(members) {
  const memberMap = new Map();
  members.forEach((member) => {
    const memberObj = member.toObject();
    memberObj.children = [];
    memberMap.set(memberObj._id.toString(), memberObj);
  });

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

  return rootMembers;
}

// load environment variables from environment
let sesClient;
let accessKeyId;
let secretAccessKey;
let region;
let senderEmail;

function initializeSesClient() {
  accessKeyId = process.env.AWS_ACCESS_KEY_ID
    ? process.env.AWS_ACCESS_KEY_ID.trim()
    : undefined;
  secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    ? process.env.AWS_SECRET_ACCESS_KEY.trim()
    : undefined;
  region = process.env.AWS_REGION
    ? process.env.AWS_REGION.trim()
    : "eu-central-1";
  senderEmail = process.env.ADMIN_EMAIL
    ? process.env.ADMIN_EMAIL.trim()
    : undefined;

  // Debug log before throwing error
  console.log("SES INIT DEBUG:", {
    accessKeyId,
    secretAccessKey,
    region,
    senderEmail,
  });
  // if (!accessKeyId || !secretAccessKey || !region || !senderEmail) {
  //   throw new Error(
  //     "AWS or ADMIN_EMAIL environment variables are not set or are invalid. Please check .env file."
  //   );
  // }

  if (sesClient) return;

  sesClient = new SESv2Client({
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
}

const sendSesEmail = async (userEmail, verifyUrl) => {
  initializeSesClient();

  const params = {
    FromEmailAddress: senderEmail,
    Destination: {
      ToAddresses: [userEmail],
    },
    Content: {
      Simple: {
        Subject: {
          Data: "Confirm your FamilyTree account",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `
              <h1>Welcome to FamilyTree!</h1>
              <p>Click the link below to verify your email and activate your account:</p>
              <a href="${verifyUrl}">${verifyUrl}</a>
              <p>This link will expire in 24 hours.</p>
            `,
            Charset: "UTF-8",
          },
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Email sent successfully. MessageId:", response.MessageId);
    return response;
  } catch (error) {
    console.error("Error sending email via SES API:", error);
    throw error;
  }
};

const contactForm = async (req, res) => {
  initializeSesClient();

  const params = {
    FromEmailAddress: senderEmail,
    Destination: {
      ToAddresses: [senderEmail],
    },
    ReplyToAddresses: [email],
    Content: {
      Simple: {
        Subject: {
          Data: `Message from ${name}`,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `<h1>You have a new message from a visitor!</h1><p>${message}</p>`,
            Charset: "UTF-8",
          },
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Contact form email sent. MessageId:", response.MessageId);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending contact form email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};

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

    // Build the nested tree structure using the utility function
    const rootMembers = buildFamilyTree(members);

    // 4. Return the family object with the nested member structure
    res.json({ ...family.toObject(), members: rootMembers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Family
const updateFamily = async (req, res) => {
  try {
    const { familyName, publicCode } = req.body;
    const update = {};
    if (familyName) update.familyName = familyName;

    if (publicCode) {
      // Ensure new code is unique (except for this family)
      const exists = await Family.findOne({
        publicCode,
        _id: { $ne: req.params.id },
      });
      if (exists) {
        return res.status(400).json({ error: "publicCode already exists" });
      }
      update.publicCode = publicCode;
    }

    const family = await Family.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
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

// Get family tree by public code (read-only)
const getFamilyByPublicCode = async (req, res) => {
  try {
    const { code } = req.body;

    const family = await Family.findOne({ publicCode: code });
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }

    // Populate members in the family
    const members = await Person.find({ family: family._id });
    const rootMembers = buildFamilyTree(members);

    res.json({ ...family.toObject(), members: rootMembers });
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
    const person = await Person.findByIdAndDelete(req.params.id);
    if (!person) return res.status(404).json({ error: "Person not found" });
    // Optionally, remove this person from any children's parents array
    await Person.updateMany(
      { parent: person._id },
      { $pull: { parent: person._id } }
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

const register = async (req, res) => {
  const { email, password, password2, family, publicCode } = req.body;
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

    // Generate or validate publicCode for the family
    let finalPublicCode = publicCode;
    if (!finalPublicCode) {
      // Generate a unique code
      let unique = false;
      while (!unique) {
        finalPublicCode = nanoid(8);
        const exists = await Family.findOne({ publicCode: finalPublicCode });
        if (!exists) unique = true;
      }
    } else {
      // Ensure provided code is unique
      const exists = await Family.findOne({ publicCode: finalPublicCode });
      if (exists) {
        return res
          .status(400)
          .json({ ok: false, message: "publicCode already exists" });
      }
    }

    // create family document for this user
    const familyDoc = new Family({
      familyName: family,
      publicCode: finalPublicCode,
    });
    await familyDoc.save();

    // create a root Person whose name is the family name
    const rootPerson = new Person({
      name: family,
      gender: null,
      birthDate: null,
      deathDate: null,
      photo: null,
      bio: `Root member for family ${family}`,
      parent: null,
      family: familyDoc._id,
    });
    await rootPerson.save();

    const newUser = {
      email,
      password: hash,
      family: familyDoc._id,
    };
    await User.create(newUser);

    // Generate a JWT token for email verification
    const emailToken = jwt.sign({ email }, jwt_secret, { expiresIn: "1d" });
    const verifyUrl = `${process.env.BACKEND_URL}/api/verify_email?token=${emailToken}`;

    // await sendSesEmail(email, verifyUrl);

    res.status(201).json({
      ok: true,
      message:
        "Successfully registered. An Admin will verify your email shortly.",
    });
  } catch (error) {
    if (error.name) {
      console.error("AWS SES Error:", error.name, error.message);
      // Return a clean 500 error to the client
      return res.status(500).json({
        ok: false,
        message: `Email service authentication failed: ${error.message}`,
      });
    }

    // Default error handling
    console.error(error);
    res
      .status(500)
      .json({ ok: false, error: "An unexpected server error occurred." });
  }
};

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

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        ok: false,
        message: "Please verify your email before logging in",
      });
    }

    const match = bcrypt.compareSync(password, user.password);
    if (match) {
      const token = jwt.sign(
        { userEmail: user.email, familyId: user.family },
        jwt_secret,
        {
          expiresIn: "1h",
        }
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

// Email verification endpoint
const verify_email = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ ok: false, message: "No token provided" });
  }

  try {
    // Decode and verify the token
    const decoded = jwt.verify(token, jwt_secret);
    const { email } = decoded;

    // Find the user and update their verification status
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { isVerified: true } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    // Optionally, redirect to frontend with a success message
    res.redirect(`${process.env.FRONTEND_URL}/login?verified=1`);

    return res.json({ ok: true, message: "Email verified successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ ok: false, message: "Invalid or expired token" });
  }
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
  // Public family tree by code
  getFamilyByPublicCode,
  // Auth
  register,
  login,
  verify_token,
  verify_email,
};
