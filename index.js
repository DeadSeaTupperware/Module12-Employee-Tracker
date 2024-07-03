// DEPENDENCIES
const inquirer = require('inquirer');
const { Pool } = require('pg');

// Connect to database
const pool = new Pool(
    {
        user: 'postgres',
        password: '7001Sql!',
        database: 'employee_tracker_db'
    }
)

pool.connect(err => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to the employee_tracker_db database.');
        userPrompt();
    }
});

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
                    pool.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                    FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id 
                    LEFT JOIN employee manager ON manager.id = employee.manager_id;`, function (err, { rows: employee }) {
                        if (err) {
                            console.error(err);
                        } else {
                            console.table(employee);
                        }
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
                    pool.query(`SELECT id, title, salary FROM role`, function (err, { rows: role }) {
                        console.table(role);
                    });
                    console.log("Viewing All Roles");
                    break;

                case 'Add Role':
                    console.log("Add Employee");
                    break;

                case 'View All Departments':
                    pool.query(`SELECT * FROM department`, function (err, { rows: department }) {
                        console.table(department);
                    });
                    console.log("Viewing All Roles");
                    break;

                case 'Add Department':
                    console.log("Add Employee");
                    break;

                case 'Quit':
                    console.log("Goodbye.");
                    return process.exit();
            }
        })
}
