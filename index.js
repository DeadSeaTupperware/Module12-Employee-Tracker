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

    pool.query(`SELECT role.id AS role_id, role.title AS role_title, role.salary, role.department_id, employee.id AS manager_id, employee.first_name AS manager_first_name, employee.last_name AS manager_last_name
        FROM role
        LEFT JOIN employee ON role.id = employee.role_id`, function (err, result) {

// console.log(result.rows);

const roleChoices = result.rows.map((data) => (
        {
            value: data.role_id,
            name: `${data.role_title}`, // Display role title
        }
)); 

const managerChoices = result.rows.map((data) => (
    {
        value: data.manager_id,
        name: `${data.manager_first_name} ${data.manager_last_name}`,
    }
));


    inquirer
        .prompt ([
            {
                type: 'input',
                message: "What is the employee's first name?",
                name: 'newFN'
            },
            {
                type: 'input',
                message: "What is the employee's last name?",
                name: 'newLN'
            },
            {
                type: 'list',
                message: "What is the employee's role?",
                name: 'whichRole',
                choices: roleChoices
            },
            {
                type: 'list',
                message: "Who is the employee's manager?",
                name: 'whichManager',
                choices: managerChoices
            }
        ])
        .then((data) => {
            const newEmpFN = data.newFN;
            const newEmpLN = data.newLN;
            const newEmpRole = data.whichRole;
            const newEmpManager = data.whichManager;

            pool.query(
                `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`,
                [newEmpFN, newEmpLN, newEmpRole, newEmpManager],
                (error, results) => {
                    if (error) {
                        console.error('Error adding employee:', error);
                    } else {
                        console.log('Employee added successfully!');
                        // viewEmployees();
                    }
                }
            );
        });
    });
}

function updateEmployeeRole() {

}

function viewRoles() {
    pool.query(`SELECT role.id, role.title, department.name AS department, role.salary 
                FROM role
                LEFT JOIN department ON role.department_id = department.id;`, function (err, { rows: role }) {

                    console.table(role);

    });
    
    console.log("Viewing All Roles");
}

function addRole() {

pool.query(`SELECT * FROM department`, function (err, result) {
    // console.log(result.rows);

    const departmentChoices = result.rows.map((dep) => (
        {
            value: dep.id,
            name: dep.name,
        }
    ));

    console.log(departmentChoices);

        inquirer
            .prompt ([
                {
                    type: 'input',
                    message: "What is the name of the role?",
                    name: 'newRole'
                },
                {
                    type: 'input',
                    message: "What is the salary of the role?",
                    name: 'newSalary'
                },
                {
                    type: 'list',
                    message: "Which department does the role belong to?",
                    name: 'whichDepartment',
                    choices: departmentChoices
                }
            ])
            .then((data) => {
                const newRoleName = data.newRole;
                const newRoleSalary = data.newSalary;
                const newRoleDepartment = data.whichDepartment;

                pool.query(
                    `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`,
                    [newRoleName, newRoleSalary, newRoleDepartment],
                    (error, results) => {
                        if (error) {
                            console.error('Error adding role:', error);
                        } else {
                            console.log('Role added successfully!');
                            // viewRoles();
                        }
                    }
                );
            });

        });
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
            const newDepartmentName = data.newDepartment;

            pool.query('INSERT INTO department (name) VALUES ($1)',
                [newDepartmentName],
                (err, result) => {
                    if (err) {
                        console.error('Error adding department:', err);
                    } else {
                        console.log(`Department '${newDepartmentName}' added successfully.`);
                        // viewDepartments();
                    }
                }
            );
        });
}

userPrompt();