import sequelize from "../sql-models/index.js";
import Product from "../sql-models/Product.js";
import { Op, fn, col } from "sequelize";

async function runQueries() {

    try {

        await sequelize.authenticate();

        console.log("PostgreSQL Connected\n");


        // QUERY 1
        // Find products with a price greater than £70

        const expensiveProducts = await Product.findAll({
            where: {
                price: {
                    [Op.gt]: 70
                }
            }
        });

        console.log("1. Products above £70:");
        console.log(
            expensiveProducts.map(product => product.toJSON())
        );


        // QUERY 2
        // Calculate the average product price

        const averagePrice = await Product.findOne({
            attributes: [
                [fn("AVG", col("price")), "averagePrice"]
            ],
            raw: true
        });

        console.log("\n2. Average product price:");
        console.log(averagePrice);


        // QUERY 3
        // Group products by category

        const productsByCategory = await Product.findAll({
            attributes: [
                "category",
                [fn("COUNT", col("id")), "count"]
            ],
            group: ["category"],
            raw: true
        });

        console.log("\n3. Products grouped by category:");
        console.log(productsByCategory);


    } catch (error) {

        console.error(error);

    } finally {

        await sequelize.close();

    }
}

runQueries();