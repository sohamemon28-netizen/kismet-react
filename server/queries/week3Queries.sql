-- ============================================================
-- WEEK 3 ASSIGNMENT
-- PostgreSQL Queries
-- E-commerce Domain: Users, Products, Orders
-- ============================================================


-- ============================================================
-- QUERY 1
-- Find all products with a price greater than 70
-- ============================================================

SELECT *
FROM "Products"
WHERE price > 70;


-- ============================================================
-- QUERY 2
-- Find the average product price
-- ============================================================

SELECT AVG(price) AS average_price
FROM "Products";


-- ============================================================
-- QUERY 3
-- Count products in each category
-- ============================================================

SELECT
    category,
    COUNT(*) AS product_count
FROM "Products"
GROUP BY category
ORDER BY product_count DESC;