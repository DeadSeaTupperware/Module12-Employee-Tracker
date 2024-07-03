// DEPENDENCIES
const inquirer = require('inquirer');
const { Pool } = require('pg');

// Connect to database
const pool = new Pool(
    {
        user: 'postgres',
        password: '7001Sql!',
        database: 'employee_tracker_db'
    },
    console.log(`Connected to the employee_tracker_db database.`)
)

pool.connect();

function userPrompt() {
    inquirer
        .prompt ([
            {
                type: 'list',
                message: "What would you like to do?",
                name: 'selector',
                choices: [
                    'View All Employees', 
                    'Add Employee', 
                    'Update Employee Role', 
                    'View All Roles', 
                    'Add Role', 
                    'View All Departments', 
                    'Add Department', 
                    'Quit'
                ]
            }
        ])
        .then((data) => {
            switch (data.selector) {
                case 'View All Employees':
                    pool.query(`SELECT * FROM employee`, function (err, { rows: employee }) {
                        console.table(employee);
                    });
                    console.log("Viewing All Employees");
                    break;

                case 'Add Employee':
                    pool.query(`SELECT * FROM employee`, function (err, { rows: employee }) {
                        console.table(employee);
                    });
                    console.log("Add Employee");
                    break;

                case 'Update Employee Role':
                    console.log("Add Employee");
                    break;

                case 'View All Roles':
                    console.log("Add Employee");
                    break;

                case 'Add Role':
                    console.log("Add Employee");
                    break;

                case 'View All Departments':
                    console.log("Add Employee");
                    break;

                case 'Add Department':
                    console.log("Add Employee");
                    break;

                case 'Quit':
                    console.log("Add Employee");
                    break;
            }
        })
}

userPrompt();