/**
 * @description  Get the headers from the table
 * presented on the webpage
 * @param {String} tableId
 * @returns {Array} list with the headers
 */

function getTableHeaders(tableId) {
    const tableHeader = document.querySelector(`#${tableId} thead tr`);
    const headers = [];
    for (let child of tableHeader.children) {
        headers.push(child.id.split('header-')[1]);
    }
    return headers;
}
/**
 * @description Controls the loading mode of the page, either leave or enter the  loading mode
 * @param {String} command - represents if the loading should be entered or left
 */
function loadingMode(command) {
    const backdrop = document.querySelector('.backdrop');
    const loader = document.querySelector('.loader');
    if (command === 'enter') {
        backdrop.className = `${backdrop.className} active`;
        loader.className = `${loader.className} active`;
    } else if (command === 'leave') {
        setTimeout(() => {
            loader.className = 'loader';
            backdrop.className = 'backdrop';
        }, 300);
    }
}

/**
 * @description Populate the table with data from the API
 * @param {Object} data - object representing data fetched from API
 *
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

/**
 * @description Leaves the loading mode of the page and communicates the a message to the user
 * @param {String} message - message to be communicated to the user
 */
function communicateUser(message) {
    loadingMode('leave');
    alert(message);
}

/**
 * @description Fetches data from API and insert the results on the view
 * @param {Event} event
 *
 */
async function handleSubmit(event) {
    event.preventDefault();
    const urlInput = document.querySelector('#url-input');
    const formText = urlInput.value;
    if (urlInput.validity.valid) {
        console.log('::: Form Submitted :::');
        loadingMode('enter');
        try {
            const response = await fetch('http://localhost:8081/sentimentAnalysis', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: formText }),
            });
            if (response.status !== 200) {
                communicateUser('It was not possible to complete the request');
                return;
            }
            const data = await response.json();
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
                const formResults = document.querySelector('#section-form-results');
                const table = document.querySelector('#table-form-results');
                if (table.className.indexOf('active') < 0) {
                    table.className += 'active';
                }
                formResults.classList.add('isActive');
                loadingMode('leave');
                return;
            }
            communicateUser('It was not possible to complete the request');
        } catch (error) {
            communicateUser('Service unavailable at the moment.');
        }
    } else {
        alert('Please provide a valid URL!');
    }
}

export { handleSubmit }