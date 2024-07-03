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
                message: "What would you like to do?"
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
}