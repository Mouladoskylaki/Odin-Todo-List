// formValidation.js

export const inputValidityListener = (input, validityState, maxInput, msg1, msg2) => {
    
    input.addEventListener('input', () => {
        if (!input.value) {
            input.setCustomValidity(`${msg1}`);
            validityState.isValid = false;
        }  else if (input.value.length > maxInput) {
            input.setCustomValidity(`${msg2}`);
            validityState.isValid = false;
        }
        else {
            input.setCustomValidity('');
            validityState.isValid = true;
        }
        input.reportValidity();
    });
};

export const dateInputValidityListener = (input, validityState, msg1) => {
    
    input.addEventListener('input', () => {
        if (!input.value) {
            input.setCustomValidity(`${msg1}`);
            validityState.isValid = false;
        }
        else {
            input.setCustomValidity('');
            validityState.isValid = true;
        }
        input.reportValidity();
    });
};

export const priorityInputValidityListener = (input, validityState, msg1) => {
    
    input.addEventListener('input', () => {
        const regex = /^[1-3]$/;

        if (!regex.test(input.value)) {
            input.setCustomValidity(`${msg1}`);
            validityState.isValid = false;
        } else {
            input.setCustomValidity('');
            validityState.isValid = true;
        }

        input.reportValidity();
    });
};