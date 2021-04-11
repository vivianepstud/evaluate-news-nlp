// Import the js file to test
import { showError } from '../src/client/js/validationChecker';

describe("Testing the validationChecker functionality", () => {

    let urlInput = document.createElement('input');
    let urlError = document.createElement('span');

    beforeEach(() => {
        urlInput = document.createElement('input');
        urlInput.id = 'url-input';
        urlInput.required = true;
        urlInput.pattern = '(http|https):\\/\\/[\\S]{2,256}(\\.[a-zA-Z0-9@:%._\\+~#?&amp;=]{2,64}\\/?)(\\S*)+';
        urlError = document.createElement('span');
        urlError.id = 'url-error';
    });

    test('Testing the showError function when input is empty', () => {
        urlInput.value = '';
        showError(urlInput, urlError);
        expect(urlError.textContent).toEqual('Missing URL');
        expect(urlError.className).toEqual('error active');
        expect(urlInput.className).toEqual(expect.stringContaining('error'));

    });
    test('Testing the showError function when input does not match the pattern', () => {
        urlInput.value = 'https://example';
        showError(urlInput, urlError);
        expect(urlError.textContent).toEqual('Entered value needs to be a valid url.');
        expect(urlError.className).toEqual('error active');
        expect(urlInput.className).toEqual(expect.stringContaining('error'));
    });
    test('Testing the showError function when input does not match the pattern', () => {
        urlInput.value = 'https://example.com';
        showError(urlInput, urlError);
        //expect($('#username').text()).toEqual('Johnny Cash - Logged In');
        expect(urlError.textContent).toEqual('');
        expect(urlError.className).not.toEqual('error active');
        expect(urlInput.className).toEqual(expect.not.stringContaining('error'));
    });
});