const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    confirmationCode: String,
    accountStatus: {type:String, enum:['Pending','Active'], default:'Pending'},
    preferences: {
      cuisines: [String],
      diets: [String],
      allergies: [String]
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
