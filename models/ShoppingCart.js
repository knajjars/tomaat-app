const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shoppingCartSchema = new Schema(
  {
    ingredients: [String],
    _user: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);
module.exports = ShoppingCart;
