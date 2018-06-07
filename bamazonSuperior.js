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
var queryDepartment = "SELECT * FROM tb_department ORDER by department_id";

// insert into Product table
var querryDeptInsert = "INSERT INTO tb_department SET ?";

var listOptions = [{
    name: "options",
    type: "list",
    message: "Please choose from following options:",
    choices: ["A. View Products by Department",
        "B. Add Department"
    ]
}]

var depQuestions = [{
    name: "department_name",
    type: "input",
    message: "Enter the name of the Product: "
}, {
    name: "over_head_costs",
    type: "input",
    message: "Enter over head cost for the Department: "
}
];


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
                displayDeptDetails(queryDepartment);
                break;
            case "B":
                addDepartment()
                break;
        }
    });
};

// Display department details 
function displayDeptDetails(inputsql) {
    con.query(inputsql, function (err, results) {
        if (err) throw err;
        // Display the avaialble products 
        console.log("\n------------------------------ Department Details ---------------------------------");
        console.log("| Id | Department Name               | Overhear Costs | Total Sales | Profit      |");
        console.log("-----------------------------------------------------------------------------------");
        results.forEach(obj => {
            var total_profit = obj.product_sales - obj.over_head_costs;
            console.log("| " + obj.department_id.toString().padEnd(3) + "| " + obj.department_name.padEnd(30) + "| " + obj.over_head_costs.toString().padEnd(15 ) + "| " + obj.product_sales.toString().padEnd(12) + "| " + total_profit.toString().padEnd(12) + "| ");
        });
        console.log("-----------------------------------------------------------------------------------\n");
        con.end();
    });
};


// Function new Department 
function addDepartment() {
    inquirer.prompt(depQuestions).then(function (answers) {
        var overhead = 1.00;
        var name = answers.department_name;
        var floatoverhead = parseFloat(answers.over_head_costs);
        overhead = overhead * floatoverhead;
        // check if the user entered proper values , if not log & ask question again
        if (isNaN(overhead) || name.length < 1 || overhead <= 0) {
            console.log("Invalid entries, try again!\n")
            addDepartment();
        } else {
            // Insert into Department tb - row 
            con.query(querryDeptInsert, { 'department_name': name, 'over_head_costs': overhead }, function (err, results) {
                if (err) throw err;
                if (results.affectedRows === 0) {
                    console.log("Insert unsucessful, try again with valid values!\n")
                    addDepartment();
                }
                console.log("Add Department Successful! Good Bye!\n")
                con.end();
            });
        }
    });
}