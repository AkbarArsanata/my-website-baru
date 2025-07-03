document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name'); // Added name input
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject'); // Added subject input
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError'); // Error for name
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError'); // Error for subject
    const messageError = document.getElementById('messageError');
    const charCount = document.getElementById('charCount');
    const submitButton = contactForm.querySelector('.btn');
    const successMessageContainer = document.getElementById('successMessageContainer');
    const formspreeAction = contactForm.action;

    // --- Validation Logic ---
    function isValidEmail(email) {
        // More robust email regex
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function showError(inputElement, errorElement, message) {
        inputElement.closest('.input-group').classList.add('error');
        errorElement.textContent = message;
        inputElement.setAttribute('aria-invalid', 'true');
    }

    function clearError(inputElement, errorElement) {
        inputElement.closest('.input-group').classList.remove('error');
        errorElement.textContent = '';
        inputElement.setAttribute('aria-invalid', 'false');
    }

    function validateName() {
        const nameValue = nameInput.value.trim();
        if (nameValue.length < 2) {
            showError(nameInput, nameError, 'Name must be at least 2 characters.');
            return false;
        } else {
            clearError(nameInput, nameError);
            return true;
        }
    }

    function validateEmail() {
        const emailValue = emailInput.value.trim();
        if (emailValue === '') {
            showError(emailInput, emailError, 'Email address is required.');
            return false;
        } else if (!isValidEmail(emailValue)) {
            showError(emailInput, emailError, 'Please enter a valid email address.');
            return false;
        } else {
            clearError(emailInput, emailError);
            return true;
        }
    }

    function validateSubject() {
        const subjectValue = subjectInput.value.trim();
        if (subjectValue.length < 5) {
            showError(subjectInput, subjectError, 'Subject must be at least 5 characters.');
            return false;
        } else {
            clearError(subjectInput, subjectError);
            return true;
        }
    }

    function validateMessage() {
        const messageValue = messageInput.value.trim();
        if (messageValue === '') {
            showError(messageInput, messageError, 'Message cannot be empty.');
            return false;
        } else if (messageValue.length < 10) {
            showError(messageInput, messageError, 'Message must be at least 10 characters.');
            return false;
        }
        else {
            clearError(messageInput, messageError);
            return true;
        }
    }

    // --- Character Count for Message ---
    function updateCharCount() {
        const maxLength = messageInput.getAttribute('maxlength');
        const currentLength = messageInput.value.length;
        charCount.textContent = `${currentLength}/${maxLength}`;
    }

    // --- Event Listeners for Real-time Validation and Char Count ---
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    subjectInput.addEventListener('input', validateSubject);
    messageInput.addEventListener('input', () => {
        validateMessage();
        updateCharCount();
    });

    // Clear error on focus
    nameInput.addEventListener('focus', () => clearError(nameInput, nameError));
    emailInput.addEventListener('focus', () => clearError(emailInput, emailError));
    subjectInput.addEventListener('focus', () => clearError(subjectInput, subjectError));
    messageInput.addEventListener('focus', () => clearError(messageInput, messageError));

    // Initial character count on load
    updateCharCount();

    // --- Form Submission Handling ---
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Run all validations
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();

        // If any validation fails, stop submission and focus on the first invalid field
        if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
            if (!isNameValid) {
                nameInput.focus();
            } else if (!isEmailValid) {
                emailInput.focus();
            } else if (!isSubjectValid) {
                subjectInput.focus();
            } else if (!isMessageValid) {
                messageInput.focus();
            }
            return;
        }

        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        submitButton.style.cursor = 'wait';
        submitButton.classList.add('loading');

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(formspreeAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Smoothly hide form and show success message
                contactForm.style.opacity = '0';
                contactForm.style.pointerEvents = 'none'; // Disable interactions on form
                contactForm.style.transform = 'translateY(-20px)'; // Add a slight upwards slide effect

                // Wait for the form fade-out transition before hiding completely and showing success
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    successMessageContainer.classList.add('show');
                    // Reset form fields and clear any lingering error states visually
                    contactForm.reset();
                    clearError(nameInput, nameError);
                    clearError(emailInput, emailError);
                    clearError(subjectInput, subjectError);
                    clearError(messageInput, messageError);
                    updateCharCount(); // Reset char count
                }, 500); // Match CSS transition duration for opacity/transform
            } else {
                // Handle non-OK Formspree responses
                let errorMessage = 'Submission failed. Please try again.';
                try {
                    const data = await response.json();
                    if (data.errors) {
                        errorMessage = 'Submission failed: ' + data.errors.map(error => error.message).join(', ');
                    } else if (data.error) {
                        errorMessage = 'Submission failed: ' + data.error;
                    }
                } catch (jsonError) {
                    console.error('Failed to parse Formspree error response:', jsonError);
                    errorMessage = `Submission failed. Server responded with status ${response.status}.`;
                }
                alert(errorMessage);
                console.error('Formspree response error:', response.status, errorMessage);
            }
        } catch (error) {
            console.error('Network or submission error:', error);
            alert('There was a problem sending your message. Please check your internet connection and try again.');
        } finally {
            // Always reset button state and remove loading class
            submitButton.disabled = false;
            submitButton.textContent = 'Kirim Pesan';
            submitButton.style.cursor = 'pointer';
            submitButton.classList.remove('loading');

            // If submission failed, ensure form is visible again
            if (!response || !response.ok) {
                contactForm.style.opacity = '1';
                contactForm.style.pointerEvents = 'auto';
                contactForm.style.transform = 'translateY(0)';
            }
        }
    });

    // --- Reset Form Function (Global for onclick) ---
    window.resetContactForm = function () {
        successMessageContainer.classList.remove('show');
        // Smoothly show form again
        contactForm.style.display = 'block';
        contactForm.style.opacity = '1';
        contactForm.style.pointerEvents = 'auto';
        contactForm.style.transform = 'translateY(0)';
        // Ensure all error states are visually cleared
        clearError(nameInput, nameError);
        clearError(emailInput, emailError);
        clearError(subjectInput, subjectError);
        clearError(messageInput, messageError);
        updateCharCount(); // Reset char count
    };
});