document.addEventListener('DOMContentLoaded', function () {

    const alertBox = document.getElementById('validationAlert');

    const generateButton = document.querySelector('.btn-generate');
    const copyButtons = document.querySelectorAll('.btn-copy');
    const usernameInput = document.getElementById('username');
    const domainInput = document.getElementById('domain');
    const secretInput = document.getElementById('secret');
    const iterationsInput = document.getElementById('iterations');
    const useSymbolsCheckbox = document.getElementById('useSymbols');

    // Event listener for generate button click
    generateButton.addEventListener('click', async function () {
    // Validate inputs
    if (validateInputs()) {
        try {
            // Inside the generateButton click event listener
            const useSymbols = useSymbolsCheckbox.checked;
            const output = await calculate_password(usernameInput.value, domainInput.value, secretInput.value, iterationsInput.value, useSymbols);

            
            // If there is an output, show copy fields and insert output
            if (output && output.length) {
            output.forEach((out, index) => {
                const button = copyButtons[index];
                const span = button.querySelector('span');
                span.textContent = out;
                button.dataset.clipboardText = out;
                const block = button.parentNode
                block.removeAttribute('style');
            });
            }
            hideAlert();
        } catch (error) {
            displayAlert('Error while generating output: ' + JSON.stringify(error))
            console.error('Error while generating output:', error);
        }
        }
    });

    // Event listener for copy buttons click
    copyButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Copy to clipboard
            const text = button.dataset.clipboardText;
            navigator.clipboard.writeText(text).then(() => {
                // Add "Copied" text if not already added
                const span = button.querySelector('span');
                if (!span.textContent.includes(' - Copied')) {
                    span.textContent += ' - Copied';
                }
            });
        });
    });

    function displayAlert(text){
        alertBox.textContent = text;
        alertBox.removeAttribute('hidden');
    }

    function hideAlert(){
        alertBox.setAttribute('hidden', '');
    }

    function validateInputs() {
        const hasLetters = /[a-zA-Z]/; // regex to check for characters
        const hasDigits = /\d/; // regex to check for digits
        const hasUppercase = /[A-Z]/; // regex to check for uppercase letters
        const hasLowercase = /[a-z]/; // regex to check for lowercase letters
        
        // Check if fields are not empty and have minimum 4 characters
        if ([usernameInput, domainInput, secretInput].some(input => !input.value || input.value.length < 4)) {
            displayAlert("All fields should have at least 4 characters.");
            return false;
        }

        // Check if fields contain some characters and are not just numbers
        if ([usernameInput, domainInput].some(input => !hasLetters.test(input.value))) {
            displayAlert("Username and Domain should contain characters (not only numbers).");
            return false;
        }

        // Check the secret for the required criteria
        if (secretInput.value.length < 8 || !hasUppercase.test(secretInput.value) || !hasLowercase.test(secretInput.value) || !hasDigits.test(secretInput.value)) {
            displayAlert("Secret should be at least 8 characters long and include uppercase, lowercase, and numbers.");
            return false;
        }

        hideAlert(); // Hide the alert if all validations pass
        return true;
    }

    async function calculate_password(username, domain, secret, iterations, useSymbols) {
        const result_hash = await custom_argon2(secret, username, domain, iterations)
        console.log(result_hash[1])

        const result_password = await transform_hash(result_hash[0], !useSymbols)
        console.log(result_password)

        const hash = result_hash[1]
        const pass = result_password
        return [hash, pass];
    }

    });