const enteredUrl = document.querySelector('#url-input');

/**
 * @description  Checks the validity of the urlInput element and
 * shows an approriate error message
 *  Code inspiration: formValidator from MDN
 *https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
 * @param
 * @returns
 */
function showError(urlInput, urlError) {
    if (urlInput.validity.valid) {
        urlError.textContent = '';
        urlError.className = 'error';
        urlInput.className = urlInput.className.replace(' error', '');
        return;
    }
    if (urlInput.validity.valueMissing) {
        urlError.textContent = 'Missing URL';
    } else if (urlInput.validity.patternMismatch) {
        urlError.textContent = 'Entered value needs to be a valid url.';
    }
    urlError.className = 'error active';
    urlInput.className = (!urlInput.className.includes('error')) ?
        `${urlInput.className} error` : urlInput.className;
}

enteredUrl.addEventListener('input', (event) => {
    const urlError = document.querySelector('#url-error');
    showError(enteredUrl, urlError);
});

export { showError }