(function() {
    'use strict';

    // Private variables
    let openFeedbackModalLink;
    let feedbackModal;
    let closeFeedbackModalButton;
    let feedbackForm;
    let userAgentInput;
    let cancelButton;
    let pageUrlInput;

    // Private method to display messages to the user (e.g., success/error)
    const displayMessage = (message, type) => {
        // You would need to add an element to your modal to display this message.
        // For now, we will use a console log and an alert.
        console.log(`Feedback Message (${type}): ${message}`);
        alert(message);
    };

    // Private method to initialize the form and listeners
    const initialize = () => {
        openFeedbackModalLink = document.getElementById('open-feedback-modal-link');
        feedbackModal = document.getElementById('feedback-modal');
        closeFeedbackModalButton = document.getElementById('close-feedback-modal');
        feedbackForm = document.getElementById('feedback-form');
        userAgentInput = document.getElementById('userAgent');
        cancelButton = document.getElementById('cancel-feedback-form');
        pageUrlInput = document.getElementById('pageUrl');
        
        addEventListeners();
    };

    // Private method to add all event listeners
    const addEventListeners = () => {
        if (openFeedbackModalLink) {
            openFeedbackModalLink.addEventListener('click', handleOpenModal);
        }
        if (closeFeedbackModalButton) {
            closeFeedbackModalButton.addEventListener('click', handleCloseModal);
        }
        if (cancelButton) {
            cancelButton.addEventListener('click', handleCloseModal);
        }
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', handleFormSubmit);
        }
    };

	// Handler for opening the modal
	const handleOpenModal = (e) => {
		e.preventDefault();
		
		// Set the User Agent and Page URL values
		if (userAgentInput) {
			userAgentInput.value = navigator.userAgent;
		}
		if (pageUrlInput) {
			pageUrlInput.value = window.location.href;
		}
		
		// This is the crucial line to show the backdrop
		const backdrop = document.getElementById('feedback-modal-backdrop');
		if (backdrop) {
			backdrop.classList.remove('hidden');
		}
		
		if (feedbackModal) {
			// This line is correct, it shows the modal
			feedbackModal.classList.remove('hidden');
			feedbackModal.classList.add('visible');
			feedbackModal.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
			feedbackModal.classList.add('opacity-100', 'scale-100');
		}
	};

	// Handler for closing the modal
	const handleCloseModal = () => {
		const backdrop = document.getElementById('feedback-modal-backdrop');
		if (feedbackModal) {
			feedbackModal.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
			feedbackModal.classList.remove('opacity-100', 'scale-100');
			feedbackForm.reset(); // Reset form fields on close
			
			// Use a timeout to ensure the fade-out transition completes before hiding.
			setTimeout(() => {
				feedbackModal.classList.add('hidden');
				if (backdrop) {
					backdrop.classList.add('hidden');
				}
			}, 300); // 300ms matches the transition duration in your CSS
		}
	};

    // Handler for form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(feedbackForm);
        
        try {
            const response = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            });

            if (response.ok) {
                displayMessage('Thank you for your feedback! It has been received.', 'success');
            } else {
                displayMessage('Failed to send feedback. Please try again later.', 'error');
            }
        } catch (error) {
            console.error('Network or submission error:', error);
            displayMessage('An error occurred. Please check your internet connection and try again.', 'error');
        } finally {
            handleCloseModal(); // Close modal after submission attempt
        }
    };

    // Public method to start the module
    const init = () => {
        document.addEventListener('DOMContentLoaded', initialize);
    };

    // Expose the public API (in this case, just the init function)
    window.FeedbackForm = {
        init: init
    };

})();

// Call the public init method to start the module
window.FeedbackForm.init();