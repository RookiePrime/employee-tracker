const inquirer = require('inquirer');
const axios = require('axios');
const cTable = require('console.table');

// Aesthetic/organizational functions for the CLI
const printSeperator = () => console.log('============================-');

function beginInquiry(PORT) {
    printSeperator();
    inquirer.prompt([
        {
            type: 'confirm',
            message: 'Ready to see a table?',
            name: 'good',
            default: false
        }
    ]).then(responseData => {
        printSeperator();
        if (responseData.good) {
            axios({
                method: 'get',
                url: `http://localhost:${PORT}/api/departments`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                console.table(response.data.data);
            });
        }
    });
}

module.exports = {
    beginInquiry
};