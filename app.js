const inquirer = require('inquirer');
const cTable = require('console.table');

const { mainMenuQuestion, 
    addDepartmentQuestion, 
    addRoleQuestions, 
    addEmployeesQuestions,
    updateEmployeeQuestions } = require('./lib/questions');
const { getFromAPI,
        getNamesAndRoles,
        postOrPutIntoAPI } = require('./src/axios');


// Aesthetic/organizational functions for the CLI
const printSeperator = () => console.log('\n======================================================\n\n');

function printAndBackToMainMenu(PORT, response) {
    printSeperator();
    console.table(response.data.data);
    mainMenu(PORT);
}

function mainMenu(PORT) {
    const baseUrl = `http://localhost:${PORT}`;
    printSeperator();
    console.log('                        Main Menu\n\n');
    inquirer.prompt(mainMenuQuestion)
    .then(mainChoice => {
        if (mainChoice.mainMenu === 'view all departments') {
            printSeperator();
            console.log('                   View All Departments\n\n');
            getFromAPI(baseUrl, 'departments')
            .then(response => printAndBackToMainMenu(PORT, response));
        } else if (mainChoice.mainMenu === 'view all roles') {
            printSeperator();
            console.log('                       View All Roles\n\n');
            getFromAPI(baseUrl, 'roles')
            .then(response => printAndBackToMainMenu(PORT, response));
        } else if (mainChoice.mainMenu === 'view all employees') {
            printSeperator();
            console.log('                     View All Employees\n\n');
            getFromAPI(baseUrl, 'employees')
            .then(response => printAndBackToMainMenu(PORT, response));
        } else if (mainChoice.mainMenu === 'add a department') {
            printSeperator();
            console.log('                      Add a Department\n\n');
            inquirer.prompt(addDepartmentQuestion)
                .then(departmentInput => postOrPutIntoAPI('post', baseUrl, 'departments', { name: departmentInput.departmentName }))
                .then(response => printAndBackToMainMenu(PORT, response));
        } else if (mainChoice.mainMenu === 'add a role') {
            printSeperator();
            console.log('                         Add a Role\n\n');
            const departments = [];
            getFromAPI(baseUrl, 'departments')
            .then(response => {
                departments.push(response.data.data);
                printSeperator();
                return inquirer.prompt(addRoleQuestions(departments))
            })
            .then(roleInput => {
                const departmentId = departments[0].filter(dept => dept.name === roleInput.roleDepartment)[0].id;
                return postOrPutIntoAPI('post', baseUrl, 'roles', { title: roleInput.roleTitle, salary: roleInput.roleSalary, department_id: departmentId })
            })
            .then(response => printAndBackToMainMenu(PORT, response));
        } else if (mainChoice.mainMenu === 'add an employee') {
            printSeperator();
            console.log('                      Add an Employee\n\n');
            getNamesAndRoles(baseUrl)
            .then(totalData => {
                // We put the roles in their own variable for legibility
                const roles = totalData[totalData.length - 1];
                // And remove them from the totalData variable so it can act as the employees side
                totalData.pop();
                // Then we ask the questions
                printSeperator();
                inquirer.prompt(addEmployeesQuestions(roles, totalData))
                // Then we get the data ready and ship it off to the database
                .then(userInput => {
                    // I do this one this way because putting the ID in the string makes sense for the user anyway; if there are two employees with the same name in the database, the user should have some way to distinguish between them. And if I'm already making that distinction, I may as well take advantage of it
                    const managerId = null || parseInt(userInput.manager.slice(userInput.manager.lastIndexOf('id:') + 4));
                    // Doesn't make much sense for the user, showing the ID of the role in the string, so I'm doing it the less efficient way here.
                    const roleId = roles.filter(role => role.title === userInput.roleTitle)[0].id;
                    postOrPutIntoAPI('post', baseUrl, 'employees', { first_name: userInput.firstName, last_name: userInput.lastName, role_id: roleId, manager_id: managerId })
                    .then(response => printAndBackToMainMenu(PORT, response));
                });
            });
        } else if (mainChoice.mainMenu === 'update an employee role') {
            printSeperator();
            console.log('                 Update An Employee Role\n\n');
            return getNamesAndRoles(baseUrl)
                .then(totalData => {
                    // We put the roles in their own variable for legibility
                    const roles = totalData[totalData.length - 1];
                    // And remove them from the totalData variable so it can act as the employees side
                    totalData.pop();
                    // Then we ask the questions
                    printSeperator();
                    
                    inquirer.prompt(updateEmployeeQuestions(roles, totalData)).then(userInput => {
                        const empId = totalData.filter(employee => employee.id === parseInt(userInput.employeeName.slice(userInput.employeeName.lastIndexOf('id:') + 4)))[0].id;
                        const roleId = roles.filter(role => role.title === userInput.employeeRole)[0].id; 
                        
                        postOrPutIntoAPI('put', baseUrl, `employees/${empId}`, { role_id: roleId })
                        .then(response => printAndBackToMainMenu(PORT, response));
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