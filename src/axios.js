const axios = require('axios');

function getNamesAndRoles(baseUrl) {
    return getFromAPI(baseUrl, 'employees')
    .then(response => response.data.data)
    .then(employeeData => {
        return getFromAPI(baseUrl, 'roles')
        .then(response => {
            employeeData.push(response.data.data);
            return employeeData;
        });
    });
};

function getFromAPI(baseUrl, endpoint) {
    return axios({
        method: 'get',
        url: `${baseUrl}/api/${endpoint}`,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

function postOrPutIntoAPI(query, baseUrl, endpoint, data) {
    return axios({
        method: `${query}`,
        url: `${baseUrl}/api/${endpoint}`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    });
};

module.exports = {
    getNamesAndRoles,
    getFromAPI,
    postOrPutIntoAPI
};