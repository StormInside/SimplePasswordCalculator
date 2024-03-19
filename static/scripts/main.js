
document.getElementById('slider').addEventListener('input', function(e) {
    document.getElementById('iterations').value = e.target.value;
});
document.getElementById('iterations').addEventListener('change', function(e) {
    document.getElementById('slider').value = e.target.value;
});

document.getElementById('password_length_slider').addEventListener('input', function(e) {
    document.getElementById('password_length_number').value = e.target.value;
});
document.getElementById('password_length_number').addEventListener('change', function(e) {
    document.getElementById('password_length_slider').value = e.target.value;
});

function togglePassword(inputId, buttonId, event) {
    event.preventDefault();
    var input = document.getElementById(inputId);
    var button = document.getElementById(buttonId);
    if (input.type === "password") {
        input.type = "text";
        button.innerHTML = '<i class="fa fa-eye-slash"></i>'; // Change icon to 'eye-slash'
    } else {
        input.type = "password";
        button.innerHTML = '<i class="fa fa-eye"></i>'; // Change icon back to 'eye'
    }
}

document.addEventListener('DOMContentLoaded', function () {

    // localStorage.clear()
    let hashObj = new Hash
    let storage = new LocalStorage

    const alertBox = document.getElementById('validationAlert');

    const generateButton = document.querySelector('.btn-generate');
    const copyButtons = document.querySelectorAll('.btn-icon-copy');
    const resultInput = document.querySelectorAll('.btn-copy');
    const usernameInput = document.getElementById('username');
    const domainInput = document.getElementById('domain');
    const secretInput = document.getElementById('secret');
    const iterationsInput = document.getElementById('iterations');
    const useSymbolsCheckbox = document.getElementById('useSymbols');
    const removeSavedButton = document.querySelector('.btn-clear');
    const sliderInput = document.getElementById('slider')
    const passwordLengthInput = document.getElementById('password_length_number');

    console.log(storage.dataList)


    // Function to update the saved inputs block
    function updateSavedInputsBlock() {
        const savedInputsBlock = document.getElementById('savedInputsBlock');
        // Clear the block
        savedInputsBlock.innerHTML = '<h5>Saved Inputs:</h5>';
        // Retrieve saved inputs from local storage
        const savedInputs = storage.retrieveData();
        // Create a button for each saved input set
        savedInputs.forEach((input, index) => {
            const inputButton = document.createElement('button');
            inputButton.textContent = `Input ${index + 1}`;
            inputButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'm-1');
            // Event listener to fill the form with saved input when clicked
            inputButton.addEventListener('click', () => {
                usernameInput.value = input.username;
                domainInput.value = input.domain;
                iterationsInput.value = input.iterations;
                useSymbolsCheckbox.checked = input.useSymbols;
            });
            savedInputsBlock.appendChild(inputButton);
        });
    }

    // Initial update of the saved inputs block on page load
    updateSavedInputsBlock();
        // Event listener for generate button click
    generateButton.addEventListener('click', async function () {
    // Validate inputs
    if (validateInputs()) {
        try {
            // Inside the generateButton click event listener
            const useSymbols = useSymbolsCheckbox.checked;
            const output = await process_inputs(usernameInput.value, domainInput.value, secretInput.value, iterationsInput.value, useSymbols);
            
            // If there is an output, show copy fields and insert output
            if (output && output.length) {
            output.forEach((out, index) => {
                const output_element = resultInput[index];
                output_element.value = out;
                const block = output_element.parentNode
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

    removeSavedButton.addEventListener('click', async function () {
        storage.removeAll()
        updateSavedInputsBlock()
    })

    copyButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Identify the associated input field. This assumes the input field is just before the button.
            if (button.id == 'CopyResultHash'){
                var input = document.getElementById('ResultHash');
                var tooltip = document.getElementById('tooltipCopyResultHash');}
            else{
                var input = document.getElementById('ResultPassword');
                var tooltip = document.getElementById('tooltipCopyResultPassword');}
            // Copy the value from the input field to the clipboard
            navigator.clipboard.writeText(input.value).then(() => {
                tooltip.style.visibility = 'visible';
                setTimeout(() => {
                    tooltip.style.visibility = 'hidden';
                }, 1000);
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

    async function process_inputs(username, domain, secret, iterations, useSymbols) {
        
        const result_hash = await hashObj.createHash(secret, username, domain, iterations, useSymbols)
        // console.log(result_hash[1])

        // const result_password = generatePassword(result_hash[0], useSymbols)
        // console.log(result_password)

//        let output = new Output(result_hash[0], useSymbols)
//        let result_password = output.generatePassword(20)

        let password = new PasswordFromLetters(result_hash[0], passwordLengthInput.value, useSymbols);
        let result_password = password.generatePassword()[0];


        const hash = result_hash[1]
        const pass = result_password
        if (saveInputsCheckbox.checked) {
            storage.storeData(username, domain, iterations, useSymbols)
            updateSavedInputsBlock()
        }
//        console.log(storage.dataList)
        return [hash, pass];
    }

    // Function to update the saved inputs block
    function updateSavedInputsBlock() {
        const savedInputsBlock = document.getElementById('savedInputsBlock');
        // Clear the block
        savedInputsBlock.innerHTML = '';
        savedInputsBlock.classList.add('grid-container');
        // Retrieve saved inputs from local storage
        const savedInputs = storage.retrieveData();
        // Create a button for each saved input set
        savedInputs.forEach((input, index) => {
            // Create a container div
            const inputContainer = document.createElement('div');
            inputContainer.classList.add('input-container', 'd-flex', 'align-items-center', 'mb-2', 'mr-3');

            // Create an input button
            const inputButton = document.createElement('button');
            inputButton.innerHTML = `Username: <strong>${input.username}</strong><br>
                                    Domain: <strong>${input.domain}</strong><br>
                                    Iterations: <strong>${input.iterations}</strong><br>
                                    Symbols: <strong>${input.useSymbols}</strong>`;
            inputButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'flex-grow-1');

            // Event listener to fill the form with saved input when clicked
            inputButton.addEventListener('click', () => {
                usernameInput.value = input.username;
                domainInput.value = input.domain;
                iterationsInput.value = input.iterations;
                useSymbolsCheckbox.checked = input.useSymbols;
                sliderInput.value = input.iterations
            });
            // Create a delete button
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '&times;';
            deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ml-2');
            deleteButton.setAttribute('title', 'Delete this input');

            // Event listener to delete the saved input
            deleteButton.addEventListener('click', function() {
                // Remove the input from the array and update local storage
                storage.removeData(index);
                // Update the saved inputs block
                updateSavedInputsBlock();
            });

            // Append the input and delete buttons to the container
            inputContainer.appendChild(inputButton);
            inputContainer.appendChild(deleteButton);

            // Append the container to the savedInputsBlock
            savedInputsBlock.appendChild(inputContainer);
        });
    }

    })
