import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Product = sequelize.define("Product", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  }
});

export default Product;