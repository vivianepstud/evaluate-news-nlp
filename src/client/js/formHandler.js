//import * as validation from './validationChecker';

const urlInput = document.querySelector('#url-input');
const urlError = document.querySelector('#url-error');
const loader = document.querySelector('.loader');

function getTableHeaders(tableId) {
    const tableHeader = document.querySelector(`#${tableId} thead tr`);
    const headers = [];
    for (let child of tableHeader.children) {
        headers.push(child.id.split('header-')[1]);
    }
    return headers;
}
/* *************************************
-------- Auxiliary Functions ---------------
****************************************
*/



function populateTable(data) {
    const headers = getTableHeaders('table-form-results');
    let cellsValue = [];
    cellsValue = [...cellsValue, ...headers.map((header) => data[header])];
    const tableBody = document.querySelector(`#table-form-results tbody`);
    const tableRow = document.createElement('tr');
    cellsValue.map((cell) => {
        const td = document.createElement('td');
        td.textContent = cell;
        tableRow.appendChild(td);
    });
    tableBody.appendChild(tableRow);
}

function communicateUser(message) {
    setTimeout(() => loader.className = 'loader', 300);
    alert(message);
}
async function handleSubmit(event) {
    event.preventDefault();
    const formText = urlInput.value;
    if (urlInput.validity.valid) {
        console.log("::: Form Submitted :::")
        loader.className = `${loader.className} active`;
        const response = await fetch('http://localhost:8081/sentimentAnalysis', {
            method: 'POST',
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'url': formText }), // body data type
            //must match "Content-Type" header  
        });
        console.log(response.status);
        if (response.status !== 200) {
            communicateUser('It was not possible to complete the request');
            return;
        }
        const data = await response.json();
        console.log(data);
        if (data) {
            if (data.error) {
                if (data.error === 'No content to analyze') {
                    communicateUser('We were not able to access the provided URL, please provide another');
                    return;
                }
                communicateUser('Please check your internet connection');
                return;
            }
            populateTable(data);
            const table = document.querySelector('#table-form-results');
            if (table.className.indexOf('active') < 0) {
                table.className += 'active';
            }
            setTimeout(() => loader.className = 'loader', 300);
            return;
        }
        communicateUser('It was not possible to complete the request 2');
    } else {
        Client.showError(urlInput, urlError);
        alert("Please provide a valid URL!");
    }
}


export { handleSubmit }