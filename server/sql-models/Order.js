import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Order = sequelize.define("Order", {
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

export default Order;