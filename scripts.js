document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // ------------------------------------------------------------------
            // CONFIGURATION: PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW
            // ------------------------------------------------------------------
            const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwl4K29WsgIt82oVRV3ITVzTl5frZv5OsXciqptOovqHIqNl1YR_syrKIxJDXRsOF9n/exec';

            // Check if URL is configured
            if (!SCRIPT_URL) {
                alert('Please configure the Google Apps Script URL in scripts.js file.');
                return;
            }

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Add metadata
            data.source = 'website_contact';
            data.timestamp = new Date().toISOString();
            data.url = window.location.href;

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';

            // Send data to Google Apps Script
            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Important for Google Apps Script to work across domains
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                body: JSON.stringify(data)
            })
                .then(response => {
                    // Since mode is 'no-cors', the response is opaque. 
                    // We assume success if the fetch completes.

                    // Success State
                    const statusMsg = document.getElementById('formStatus');
                    contactForm.reset();

                    submitBtn.innerText = 'Message Sent!';
                    submitBtn.style.backgroundColor = '#10b981';
                    submitBtn.style.borderColor = '#10b981';

                    if (statusMsg) {
                        statusMsg.style.display = 'block';
                        statusMsg.className = 'form-success-message';
                        statusMsg.innerText = 'Thank you! We received your request and will be in touch shortly.';
                        statusMsg.style.color = '#10b981';
                    }

                    // Reset button after 5 seconds
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalBtnText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.borderColor = '';
                        if (statusMsg) {
                            statusMsg.style.display = 'none';
                        }
                    }, 5000);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error sending your message. Please try again later.');

                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                });
        });
    }
});
