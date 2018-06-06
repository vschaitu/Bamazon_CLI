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
var queryProducts = "SELECT tb_products.product_id as product_id, tb_products.product_name as product_name, tb_products.product_price, tb_products.stock_quantity as stock_quantity, tb_department.department_name as department_name FROM tb_products LEFT JOIN tb_department on tb_products.department_id = tb_department.department_id";

// select from product table 
var querybyId = "SELECT product_id, stock_quantity, department_id, product_price, sold_quantity FROM tb_products WHERE ?";

// Update product table
var queryprodUpdate = "UPDATE tb_products SET ? WHERE ?";

// Select Dept table
var querydeptSelect = "SELECT product_sales FROM tb_department WHERE ?";

// Update product table
var querydeptUpdate = "UPDATE tb_department SET ? WHERE ?";


var buyinQuestions = [{
  name: "id",
  type: "input",
  message: "Enter the Product Id you wish to buy: "
}, {
  name: "quantity",
  type: "input",
  message: "How many you would like to buy today ?"
}];

// connect to the mysql server and sql database
con.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// at begining display current products details and promt user to choose product & quantity to buy
function start() {
  con.query(queryProducts, function (err, results) {
    if (err) throw err;
    // Display the avaialble products 
    console.log("\n--------------------------- Available Product Details ----------------------------------------");
    console.log("| Id | Product Name                  | Price     | Quantity  | Department Name               |");
    console.log("----------------------------------------------------------------------------------------------");
    results.forEach(obj => {
      console.log("| " + obj.product_id.toString().padEnd(3) + "| " + obj.product_name.padEnd(30) + "| " + obj.product_price.toString().padEnd(10) + "| " + obj.stock_quantity.toString().padEnd(10) + "| " + obj.department_name.padEnd(30) + "|");
    });
    console.log("----------------------------------------------------------------------------------------------\n");
    // Prompt user to enter the product ID & Quanity he wants to Buy
    buymethod();
  });
};

function buymethod() {
  // prompt using inquirer to get the id & quantity from user
  inquirer.prompt(buyinQuestions).then(function (answers) {
    var id = parseInt(answers.id);
    var quantity = parseInt(answers.quantity);
    // check if the user entered proper numberic values , if not log & ask question again
    if (isNaN(id) || isNaN(quantity)) {
      console.log("Invalid entries, try again!")
      buymethod();
    } else {
      // using item Id entered, get details from the products table
      con.query(querybyId, [{ product_id: id }], function (err, results) {
        if (err) throw err;
        console.log(results);
        // if no rows retruned , error out saying invalid product & reask questions
        if (results[0] === undefined) {
          console.log("Invalid Product ID, Doesn't exist! Please try again");
          buymethod();
        } else {
          // if the quantity is sufficient than what we have on the Database , if not error out and reask question
          if (quantity > results[0].stock_quantity) {
            console.log("Insufficient Quantity, please try again");
            buymethod();
          } else {
            var remQuantity = results[0].stock_quantity - quantity;
            var soldAmount = results[0].product_price * quantity;
            var soldQuantity = results[0].sold_quantity + quantity;
            var deptid = results[0].department_id;
            // Update product table to reduce stock Quantity & increment sold Quantity
            con.query(queryprodUpdate, [{ stock_quantity: remQuantity, sold_quantity: soldQuantity }, { product_id: id }], function (err, results) {
              if (err) throw err;
            });
            // Get department sales amount and add the buy amount to totals.
            con.query(querydeptSelect, [{ department_id: deptid }], function (err, results) {
              if (err) throw err;
              soldAmount += results[0].product_sales;
              con.query(querydeptUpdate, [{ product_sales: soldAmount }, { department_id: deptid }], function (err, results) {
                if (err) throw err;
                console.log(" Purchase Successful! Good Bye!")
                con.end();
              });
            });
          }
        };
      });
    };
  });
}