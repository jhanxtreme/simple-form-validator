const SimpleFormValidator = (function() {
    let instance, inputs, selects, textareas, form, errors = [],
        _params;
    const helpers = {
        hasSelectedAlteastOne: (element) => {
            let result = false,
                parentNode = element.parentNode;
            parentNode.querySelectorAll(`input[name=${element.name}]`).forEach(elem => {
                if (elem.checked) {
                    result = true;
                }
            });
            return result;
        },
        checkErrors: (element) => {
            let errorsMessages = '';
            switch (element.nodeName) {
                case 'INPUT':
                    if (element.getAttribute('required') !== null && element.value.trim().length === 0) {
                        errorsMessages += `${element.name} is required. `;
                    } else if (element.getAttribute('pattern') && !(new RegExp(element.getAttribute('pattern')).test(element.value))) {
                        errorsMessages += `Invalid ${element.name}. `;
                    } else if (['checkbox', 'radio'].indexOf(element.type) > -1) {
                        if (element.getAttribute('required') !== null && !helpers.hasSelectedAlteastOne(element)) {
                            errorsMessages += `${element.name} is required.`;
                        }
                    }
                    break;
                case 'SELECT':
                    if (element.getAttribute('required') !== null && element.value.trim().length === 0) {
                        const fieldName = element.name.replace(/[-]/, ' ')
                        errorsMessages += `${fieldName} is required. `;
                    }
                    break;
                case 'TEXTAREA':
                    if (element.getAttribute('required') !== null && element.value.trim().length === 0) {
                        errorsMessages += `${element.name} is required. `;
                    }
                    break;
            }
            return helpers.ucFirst(errorsMessages);
        },
        capitalize: (val) => {
            if (typeof val === 'undefined') return '';
            val = val.replace(/[-]/, ' ');
            let result = '',
                words = val.split(' ');
            for (let i = 0; i < words.length; i++) {
                result += words[i].charAt(0).toUpperCase() + words[i].substr(1) + ' ';
            }
            return result;
        },
        ucFirst: (val) => {
            if (typeof val === 'undefined') return '';
            return val.charAt(0).toUpperCase() + val.substr(1);
        },
        displayLabel: (element) => {
            if (element.type === 'submit') return;
            if (element.parentNode.querySelector('label')) return;

            const parentNode = element.parentNode;
            const labelElem = document.createElement('label');
            labelElem.setAttribute('for', element.name);
            labelElem.innerHTML = `${helpers.capitalize(element.name)}`;
            element.setAttribute('id', element.name);
            parentNode.prepend(labelElem);
        },
        displayErrorLables: (input) => {
            const parentNode = input.parentNode;
            const fieldName = input.name;
            const errorMessage = helpers.checkErrors(input);
            const errorDiv = parentNode.querySelector('.error');
            if (errorMessage.length === 0 && errorDiv) {
                parentNode.removeChild(errorDiv);
            } else {
                if (fieldName !== 'submit' && errorMessage) {
                    if (errorDiv) {
                        errorDiv.innerHTML = `<span>${errorMessage}</span>`;
                    } else {
                        const errorNew = document.createElement('div');
                        errorNew.setAttribute('class', 'error');
                        errorNew.innerHTML = `<span>${errorMessage}</span>`;
                        parentNode.appendChild(errorNew);
                    }
                    errors.push(errorMessage);
                }
            }
        }
    }

    function SimpleFormValidator() {}
    SimpleFormValidator.prototype.init = (params) => {
        _params = params;
        form = document.querySelector('form');
        inputs = form.querySelectorAll('input');
        selects = form.querySelectorAll('select');
        textareas = form.querySelectorAll('textarea');

        // set input labels
        if (_params.label) {
            inputs.forEach(input => helpers.displayLabel(input));

            selects.forEach(input => helpers.displayLabel(input));

            textareas.forEach(input => helpers.displayLabel(input));
        }

        form.addEventListener('submit', instance.validate);

    };
    SimpleFormValidator.prototype.validate = (e) => {
        e.preventDefault();

        form.classList.add('invalid');

        // clear errors
        errors.length = 0;

        inputs.forEach(elem => helpers.displayErrorLables(elem));

        selects.forEach(elem => helpers.displayErrorLables(elem));

        textareas.forEach(elem => helpers.displayErrorLables(elem));

        console.log('Errors >> ', errors);
        if (errors.length > 0) {
            form.classList.add('invalid');
        } else {
            form.classList.remove('invalid');
            HTMLFormElement.prototype.submit.call(form);
        }
    };

    if (!instance) {
        instance = new SimpleFormValidator();
    }

    return instance;

})();