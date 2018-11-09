const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
  {
    recipeName: String,
    cuisine: String,
    thumbnail: String,
    apiURL: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
