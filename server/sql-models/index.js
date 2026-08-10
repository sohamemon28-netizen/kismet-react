import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "kismet",
  "postgres",
  "Caution!28",
  {
    host: "localhost",
    dialect: "postgres"
  }
);

export default sequelize;