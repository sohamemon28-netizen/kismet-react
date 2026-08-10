import User from "./User.js";
import Product from "./Product.js";
import Order from "./Order.js";

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, {
    through: "OrderProducts"
});

Product.belongsToMany(Order, {
    through: "OrderProducts"
});

export { User, Product, Order };