// mysql npm
var mysql = require('mysql');

// inquirer npm
var inquirer = require('inquirer');


// dbconfig object
var dbconfig = {
    //hot
    host: "localhost",
    //port
    port: 3306,
    //username
    user: "root",
    //password
    password: "",
    //DB
    database: "bamazon_db"
};

// create the DB connection for the sql database
var con = mysql.createConnection(dbconfig);

// sql gets all products with the department name from department table
var queryProducts = "SELECT tb_products.product_id as product_id, tb_products.product_name as product_name, tb_products.product_price, tb_products.stock_quantity as stock_quantity, tb_products.sold_quantity as sold_quantity, tb_department.department_name as department_name FROM tb_products LEFT JOIN tb_department on tb_products.department_id = tb_department.department_id";


// sql gets all products deatils when stock is less than or equal to 5
var queryLowinventory = "SELECT tb_products.product_id as product_id, tb_products.product_name as product_name, tb_products.product_price, tb_products.stock_quantity as stock_quantity, tb_products.sold_quantity as sold_quantity, tb_department.department_name as department_name FROM tb_products JOIN tb_department on tb_products.department_id = tb_department.department_id AND tb_products.stock_quantity <= 5 ";

// Update product table
var queryprodUpdate = "UPDATE tb_products SET stock_quantity = (stock_quantity + ?) WHERE product_id = ?";

// insert into Product table
var queryprodInsert = "INSERT INTO tb_products(product_name, department_id, product_price, stock_quantity) VALUES ?";

var listOptions = [{
    name: "options",
    type: "list",
    message: "Please choose from following options:",
    choices: ["A. View Products for Sale",
        "B. View Low inventory",
        "C. Add to Inventory",
        "D. Add New Product"
    ]
}]

var prodQuestions = [{
    name: "product_name",
    type: "input",
    message: "Enter the name of the Product: "
}, {
    name: "department_id",
    type: "input",
    message: "Enter Department Id of the Product: "
},
{
    name: "product_price",
    type: "input",
    message: "Enter Price of the Product: "
},
{
    name: "stock_quantity",
    type: "input",
    message: "Enter quantity of Product: "
}
];

var inventoryQuestions = [{
    name: "id",
    type: "input",
    message: "Enter the Product Id you wish to add to Inventory: "
}, {
    name: "quantity",
    type: "input",
    message: "How many you would like to add today ?"
}];

// connect to the mysql server and sql database
con.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});


// At begining display options available
function start() {
    // prompt using inquirer list of options for manager
    inquirer.prompt(listOptions).then(function (option) {
        switch (option.options.slice(0, 1)) {
            case "A":
                displayProducts(queryProducts);
                break;
            case "B":
                displayProducts(queryLowinventory);
                break;
            case "C":
                addInventory();
                break;
            case "D":
                addProduct()
                break;
        }
    });
};

// Display products details 
function displayProducts(inputsql) {
    con.query(inputsql, function (err, results) {
        if (err) throw err;
        // Display the avaialble products 
        console.log("\n------------------------------------- Product Details ----------------------------------------------------");
        console.log("| Id | Product Name                  | Price     | Quantity  | Sold      |Department Name                |");
        console.log("----------------------------------------------------------------------------------------------------------");
        results.forEach(obj => {
            console.log("| " + obj.product_id.toString().padEnd(3) + "| " + obj.product_name.padEnd(30) + "| " + obj.product_price.toString().padEnd(10) + "| " + obj.stock_quantity.toString().padEnd(10) + "| " + obj.sold_quantity.toString().padEnd(10) + "| " + obj.department_name.padEnd(30) + "|");
        });
        console.log("----------------------------------------------------------------------------------------------------------\n");
        con.end();
    });
};


// Function to add inventory 
function addInventory() {
    inquirer.prompt(inventoryQuestions).then(function (answers) {
        var id = parseInt(answers.id);
        var quantity = parseInt(answers.quantity);
        // check if the user entered proper numberic values , if not log & ask question again
        if (isNaN(id) || isNaN(quantity) || quantity <= 0) {
            console.log("Invalid entries, try again!\n")
            addInventory();
        } else {
            // update the prodcut row to increment the quantity
            con.query(queryprodUpdate, [quantity, id], function (err, results) {
                if (err) throw err;
                if (results.affectedRows === 0) {
                    console.log("No inventory found, try again!\n")
                    addInventory();
                }
                console.log("Add inventory Successful! Good Bye!\n")
                con.end();
            });
        }
    });
}


// Function to add inventory 
function addProduct() {
    inquirer.prompt(prodQuestions).then(function (answers) {
        console.log(answers);
        var price = 1.00;
        var id = parseInt(answers.department_id);
        var name = answers.product_name;
        var floatprice = parseFloat(answers.product_price);
        var quantity = parseInt(answers.stock_quantity);
        price = price * floatprice;
        console.log(name, id, price, quantity);
        // check if the user entered proper values , if not log & ask question again
        if (isNaN(id) || isNaN(quantity) || quantity <= 0 || isNaN(price) || name.length < 1 || price <= 0) {
            console.log("Invalid entries, try again!\n")
            addProduct();
        } else {
            // Insert into prodcut row 
            con.query(queryprodInsert, [name, id, price, quantity], function (err, results) {
                if (err) throw err;
                if (results.affectedRows === 0) {
                    console.log("Insert unsucessful, try again with valid values!\n")
                    addProduct();
                }
                console.log("Add Product Successful! Good Bye!\n")
                con.end();
            });
        }
    });
}