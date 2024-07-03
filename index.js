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

            let option = data.selector;

            switch (option) {
                case 'View All Employees':
                    viewEmployees();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;

                case 'View All Roles':
                    viewRoles();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'View All Departments':
                    viewDepartments();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'Quit':
                    console.log("Goodbye.");
                    return process.exit();
            }
        });
};

function viewEmployees() {
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
}

function addEmployee() {
    
}

function updateEmployeeRole() {

}

function viewRoles() {
    pool.query(`SELECT id, title, salary FROM role`, function (err, { rows: role }) {
        console.table(role);
    });
    console.log("Viewing All Roles");
}

function addRole() {

}

function viewDepartments() {
    pool.query(`SELECT * FROM department`, function (err, { rows: department }) {
        console.table(department);
    });
    console.log("Viewing All Departments");
}

function addDepartment() {
    inquirer
        .prompt ([
            {
                type: 'input',
                message: "What is the name of the department?",
                name: 'newDepartment'
            }
        ])
        .then((data) => {
            //TO DO: INSERT THE INPUT INTO THE department TABLE
            const newDepartmentName = data.newDepartment;

            pool.query('INSERT INTO department (name) VALUES ($1)',
                [newDepartmentName],
                (err, result) => {
                    if (err) {
                        console.error('Error adding department:', err);
                    } else {
                        console.log(`Department '${newDepartmentName}' added successfully.`);
                        viewDepartments();
                    }
                }
            );
        });
}