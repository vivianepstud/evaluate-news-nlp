import 'jest-fetch-mock';
import { handleSubmit } from '../src/client/js/formHandler';
import 'regenerator-runtime/runtime';

describe('Testing the handleSubmit function', () => {
    const urlInput = document.createElement('input');
    const testEvent = new Event('test-event');
    const loader = document.createElement('div');
    const backdrop = document.createElement('div');

    window.alert = jest.fn();
    urlInput.type = 'text';
    urlInput.id = 'url-input';
    urlInput.required = true;
    urlInput.pattern = '(http|https):\\/\\/[\\S]{2,256}(\\.[a-zA-Z0-9@:%._\\+~#?&amp;=]{2,64}\\/?)(\\S*)+';

    loader.className = 'loader';
    backdrop.className = 'backdrop';

    document.body.appendChild(loader);
    document.body.appendChild(backdrop);
    document.body.appendChild(urlInput);


    /* beforeEach(() => {
        urlInput = document.querySelector('#url-input');

        console.log("before each");
    }); */
    test('Handle submit function when url given is empty', async() => {
        urlInput.value = '';
        await handleSubmit(testEvent);
        expect(window.alert.mock.calls[0][0]).toBe('Please provide a valid URL!');
    });
    test('Handle submit function when url given is not a valid url', async() => {
        urlInput.value = 'http://example';
        await handleSubmit(testEvent);
        expect(window.alert.mock.calls[1][0]).toBe('Please provide a valid URL!');
    });
    test('Handle submit function when the url provided is valid, but not reachable', async() => {
        urlInput.value = 'https://eihdsk-wek.com';
        await handleSubmit(testEvent);
        expect(window.alert.mock.calls[2][0]).toBe('We were not able to access the provided URL, please provide another');
    });
});