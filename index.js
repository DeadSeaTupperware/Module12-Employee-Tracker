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
    // inquirer
    //     .prompt ([
    //         {
    //             type: 'input',
    //             message: "What is the employee's first name?",
    //             name: 'newFN'
    //         },
    //         {
    //             type: 'input',
    //             message: "What is the employee's last name?",
    //             name: 'newLN'
    //         },
    //         {
    //             type: 'list',
    //             message: "What is the employee's role?",
    //             name: 'newEmpRole',
    //             choices: ['Engineering', 'Finance', 'Legal', 'Sales', 'Service']
    //         }
    //     ])
    //     .then((data) => {
    //         const newRoleName = data.newRole;
    //         const newRoleSalary = data.newSalary;
    //         const newRoleDepartment = data.whichDepartment;

    //         // Get the department_id based on the department name
    //         let departmentId;
    //         switch (newRoleDepartment) {
    //             case 'Engineering':
    //                 departmentId = 1;
    //                 break;
    //             case 'Finance':
    //                 departmentId = 2;
    //                 break;
    //             case 'Legal':
    //                 departmentId = 3;
    //                 break;
    //             case 'Sales':
    //                 departmentId = 4;
    //                 break;
    //             case 'Service':
    //                 departmentId = 5;
    //                 break;
    //         }

    //         pool.query(
    //             `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`,
    //             [newRoleName, newRoleSalary, departmentId],
    //             (error, results) => {
    //                 if (error) {
    //                     console.error('Error adding role:', error);
    //                 } else {
    //                     console.log('Role added successfully!');
    //                     // viewRoles();
    //                 }
    //             }
    //         );
    //     });
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
// const { rows } = pool.query(`SELECT * FROM department`);
// To-Do: Somehow collect department choices from department table to use in inquirer prompt.
const departmentChoices = rows.map(({id, name}) => {
    ({
        name: name,
        value: id,
    })
});

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
                        viewRoles();
                    }
                }
            );
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