import sequelize from "./sql-models/index.js";

try {

    await sequelize.authenticate();

    console.log("PostgreSQL Connected!");

} catch (err) {

    console.log(err);

}