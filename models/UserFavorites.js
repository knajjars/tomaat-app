const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userFavoritesSchema = new Schema(
  {
    _user: { type: Schema.Types.ObjectId, ref: "User" },
    _favorite: { type: Schema.Types.ObjectId, ref: "Favorite" }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const UserFavorites = mongoose.model("UserFavorite", userFavoritesSchema);
module.exports = UserFavorites;
