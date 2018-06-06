DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE tb_department (
	department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    product_sales DECIMAL(10,2) DEFAULT 0.00
);

CREATE TABLE tb_products (
	product_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(30) NOT NULL,
    department_id INT NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    sold_quantity INT NOT NULL DEFAULT 0,
    INDEX parent_index (department_id),
    FOREIGN KEY (department_id) REFERENCES tb_department(department_id) ON DELETE RESTRICT
);

INSERT INTO tb_department (department_name,over_head_costs) VALUES ('Electronics', 1000);
INSERT INTO tb_department (department_name,over_head_costs) VALUES ('Clothing', 1200);
INSERT INTO tb_department (department_name,over_head_costs) VALUES ('Home furniture', 1100);


INSERT INTO tb_products(product_name,department_id,product_price,stock_quantity) VALUES ('Apple Pod', 1, 250.99, 30);
INSERT INTO tb_products(product_name,department_id,product_price,stock_quantity) VALUES ('Macbook', 1, 1050.99, 30);
INSERT INTO tb_products(product_name,department_id,product_price,stock_quantity) VALUES ('Iphone X', 1, 700.99, 30);

INSERT INTO tb_products(product_name,department_id,product_price,stock_quantity) VALUES ('Avengers T-Shirt', 2, 12, 175);
INSERT INTO tb_products(product_name,department_id,product_price,stock_quantity) VALUES ('Avengers Shorts', 2, 18.50, 100);
INSERT INTO tb_products(product_name,department_id,product_price,stock_quantity) VALUES ('Avengers Caps', 2, 10.0, 50);

INSERT INTO tb_products(product_name,department_id,product_price,stock_quantity) VALUES ('CraftMans Chair', 3, 24.7, 6);
INSERT INTO tb_products(product_name,department_id,product_price,stock_quantity) VALUES ('CraftMans Cofee Table', 3, 40.7, 5);
INSERT INTO tb_products(product_name,department_id,product_price,stock_quantity) VALUES ('CraftMans Dining Table', 3, 150.5, 3);


SELECT * FROM tb_department;

SELECT * FROM tb_products;

SELECT tb_products.product_id as product_id, tb_products.product_name as product_name, tb_products.product_price, tb_products.stock_quantity as stock_quantity, tb_department.department_name as department_name FROM tb_products LEFT JOIN tb_department on tb_products.department_id = tb_department.department_id;




