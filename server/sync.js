import sequelize from "./sql-models/index.js";
import "./sql-models/associations.js";

await sequelize.sync({ force: true });

console.log("All PostgreSQL Tables Created");
