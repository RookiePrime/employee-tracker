const mainMenuQuestion = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'mainMenu',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'quit']
    }
];

const addDepartmentQuestion = [
    {
        type: 'input',
        message: 'Please enter the name of the new department',
        name: 'departmentName',
        validate: message => {
            if (!message) {
                return 'No text entered. Please enter the name of the new department'
            }
            else return true;
        }
    }
];

const addRoleQuestions = departments => {
    return [
        {
            type: 'input',
            message: 'Please enter the title of the new role',
            name: 'roleTitle',
            validate: message => {
                if (!message) {
                    return 'No text entered. Please enter the title of the new role'
                }
                else return true;
            }
        },
        {
            type: 'input',
            message: 'Please enter the salary of the new role (numbers only)',
            name: 'roleSalary',
            validate: message => {
                if (!message) {
                    return 'No value entered. Please enter the title of the new role (numbers only)'
                } else if (typeof message === Number) {
                    return 'Response contained non-number characters. Please enter the salary of the new role (numbers only)'
                } else return true;
            }
        },
        {
            type: 'list',
            message: 'Please choose the department of the new role',
            name: 'roleDepartment',
            choices: [...departments[0].map(dept => dept.name)]
        }
    ];
};

const addEmployeesQuestions = (roles, employees) => {
    return [
        {
            type: 'input',
            message: "Enter the employee's first name",
            name: 'firstName',
            validate: message => {
                if (!message) return "No name detected. Enter the employee's first name.";
                else return true;
            }                        },
        {
            type: 'input',
            message: "Enter the employee's last name",
            name: 'lastName',
            validate: message => {
                if (!message) return "No name detected. Enter the employee's last name.";
                    else return true;
                }
        },
        {
            type: 'list',
            message: "Choose the employee's role at the company",
            name: 'roleTitle',
            choices: [...roles.map(role => role.title)]
        },
        {
            type: 'list',
            message: "Choose the employee's manager",
            name: 'manager',
            choices: [...employees.map(emp => emp.employee + ', ' + 'id: ' + emp.id), 'none']
        }
    ];
};

const updateEmployeeQuestions = (roles, employees) => {
    return [
        {
            type: 'list',
            message: 'Choose the employee whose role you want to change',
            name: 'employeeName',
            choices: [...employees.map(emp => emp.employee + ', ' + 'id: ' + emp.id)]
        },
        {
            type: 'list',
            message: 'Choose a role for this employee',
            name: 'employeeRole',
            choices: [...roles.map(role => role.title)]
        }
    ];
}; 

module.exports = {
    mainMenuQuestion,
    addDepartmentQuestion,
    addRoleQuestions,
    addEmployeesQuestions,
    updateEmployeeQuestions
};