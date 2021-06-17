import { handleSubmit } from './js/formHandler';
import { showError } from './js/validationChecker';
import './styles/resets.scss';
import './styles/base.scss';
import './styles/form.scss';
import './styles/header.scss';

const enteredUrl = document.querySelector('#url-input');

enteredUrl.addEventListener('input', (event) => {
    const urlError = document.querySelector('#url-error');
    showError(enteredUrl, urlError);
});

export {
    showError,
    handleSubmit,
};