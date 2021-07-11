const inquirer = require('inquirer');
const axios = require('axios');
const cTable = require('console.table');


// Aesthetic/organizational functions for the CLI
const printSeperator = () => console.log('\n======================================================\n\n');
           
function getNamesAndRoles(baseUrl) {
    // FIRST, we get the employee names so that we can list them as possible managers later
    return axios({
        method: 'get',
        url: `${baseUrl}/api/employees`,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.data.data)
    // THEN we get the role titles so that we can list them as possible options laster
    .then(employeeData => {
        return axios({
            method: 'get',
            url: `${baseUrl}/api/roles`,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            employeeData.push(response.data.data);
            return employeeData;
        });
    });
}

function mainMenu(PORT) {
    const baseUrl = `http://localhost:${PORT}`;
    printSeperator();
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'mainMenu',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'quit']
        }
    ]).then(mainChoice => {
        if (mainChoice.mainMenu === 'view all departments') {
            axios({
                method: 'get',
                url: `${baseUrl}/api/departments`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                printSeperator();
                console.table(response.data.data);
                mainMenu(PORT);
            });
        } else if (mainChoice.mainMenu === 'view all roles') {
            axios({
                method: 'get',
                url: `${baseUrl}/api/roles`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                printSeperator();
                console.table(response.data.data);
                mainMenu(PORT);
            });
        } else if (mainChoice.mainMenu === 'view all employees') {
            axios({
                method: 'get',
                url: `${baseUrl}/api/employees`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                printSeperator();
                console.table(response.data.data);
                mainMenu(PORT);
            });
        } else if (mainChoice.mainMenu === 'add a department') {
            printSeperator();
            inquirer.prompt([
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
            ]).then(departmentInput => {
                axios({
                    method: 'post',
                    url: `${baseUrl}/api/departments`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        name: departmentInput.departmentName
                    }
                }).then(response => {
                    printSeperator();
                    console.table(response.data.data);
                    mainMenu(PORT);
                });
            });
        } else if (mainChoice.mainMenu === 'add a role') {
            const departments = [];
            axios({
                method: 'get',
                url: `${baseUrl}/api/departments`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                departments.push(response.data.data);
                printSeperator();
                inquirer.prompt([
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
                ]).then(roleInput => {
                    axios({
                        method: 'post',
                        url: `${baseUrl}/api/roles`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            title: roleInput.roleTitle,
                            salary: roleInput.roleSalary,
                            department_id: roleInput.roleDepartment.index
                        }
                    }).then(response => {
                        printSeperator();
                        console.table(response.data.data);
                        mainMenu(PORT);
                    });
                });
            });
        } else if (mainChoice.mainMenu === 'add an employee') {

            getNamesAndRoles(baseUrl)
            // THEN, finally, we ask the questions
            .then(totalData => {
                // We put the roles in their own variable for legibility
                const roles = totalData[totalData.length - 1];
                // And remove them from the totalData variable so it can act as the employees side
                totalData.pop();
                // Then we ask the questions
                printSeperator();
                inquirer.prompt([
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
                        choices: [...totalData.map(emp => emp.employee + ', ' + 'id: ' + emp.id), 'none']
                    }
                // Then we get the data ready and ship it off to the database
                ]).then(userInput => {
                    // I do this one this way because putting the ID in the string makes sense for the user anyway; if there are two employees with the same name in the database, the user should have some way to distinguish between them. And if I'm already making that distinction, I may as well take advantage of it
                    const managerId = null || parseInt(userInput.manager.slice(userInput.manager.lastIndexOf('id:') + 4));
                    // Doesn't make much sense for the user, showing the ID of the role in the string, so I'm doing it the less efficient way here.
                    const roleId = roles.filter(role => role.title === userInput.roleTitle)[0].id;
                    axios({
                        method: 'post',
                        url: `${baseUrl}/api/employees`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            first_name: userInput.firstName,
                            last_name: userInput.lastName,
                            role_id: roleId,
                            manager_id: managerId
                        }
                    })
                    .then(response => {
                        printSeperator();
                        console.table(response.data.data);
                        mainMenu(PORT);
                    });
                });
            });
        } else if (mainChoice.mainMenu === 'update an employee role') {
            printSeperator();

            return getNamesAndRoles(baseUrl)
                .then(totalData => {
                    // We put the roles in their own variable for legibility
                    const roles = totalData[totalData.length - 1];
                    // And remove them from the totalData variable so it can act as the employees side
                    totalData.pop();
                    // Then we ask the questions
                    printSeperator();
                    
                    inquirer.prompt([
                        {
                            type: 'list',
                            message: 'Choose the employee whose role you want to change',
                            name: 'employeeName',
                            choices: [...totalData.map(emp => emp.employee + ', ' + 'id: ' + emp.id)]
                        },
                        {
                            type: 'list',
                            message: 'Choose a role for this employee',
                            name: 'employeeRole',
                            choices: [...roles.map(role => role.title)]
                        }
                    ]).then(userInput => {
                        const empId = totalData.filter(employee => employee.id === parseInt(userInput.employeeName.slice(userInput.employeeName.lastIndexOf('id:') + 4)))[0].id;
                        const roleId = roles.filter(role => role.title === userInput.employeeRole)[0].id; 
                      
                        axios({
                            method: 'put',
                            url: `${baseUrl}/api/employees/${empId}`,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: {
                                role_id: roleId
                            }
                        }).then(response => {
                            printSeperator();
                            console.table(response.data.data);
                            mainMenu(PORT);
                        });
                    });
                });

        } else if (mainChoice.mainMenu === 'quit') {
            process.exit();
        }
    });
}

module.exports = {
    mainMenu
};