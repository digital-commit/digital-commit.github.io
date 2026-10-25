const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

});

document.querySelectorAll(".fade-up").forEach((el) => {

    observer.observe(el);

});

/* ==========================================
   MOBILE NAVIGATION
========================================== */

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        const isOpen = nav.classList.contains('open');

        menuToggle.setAttribute(
            'aria-expanded',
            isOpen ? 'true' : 'false'
        );

        menuToggle.setAttribute(
            'aria-label',
            isOpen ? 'Close navigation' : 'Open navigation'
        );

    });

    /* Close menu after clicking a navigation link */
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {

            nav.classList.remove('open');

            menuToggle.setAttribute(
                'aria-expanded',
                'false'
            );

            menuToggle.setAttribute(
                'aria-label',
                'Open navigation'
            );

        });
    });
}

/* ==========================================
   VIDEO — CENTER PLAY BUTTON
========================================== */

const bookingVideoWrapper = document.querySelector('.booking-video-wrapper');
const bookingProductVideo = document.querySelector('.booking-product-video');
const bookingVideoPlay = document.querySelector('.booking-video-play');

if (bookingVideoWrapper && bookingProductVideo && bookingVideoPlay) {

    bookingVideoPlay.addEventListener('click', () => {
        bookingProductVideo.play();
    });

    bookingProductVideo.addEventListener('play', () => {
        bookingVideoWrapper.classList.add('is-playing');
    });

    bookingProductVideo.addEventListener('pause', () => {
        bookingVideoWrapper.classList.remove('is-playing');
    });

    bookingProductVideo.addEventListener('ended', () => {
        bookingVideoWrapper.classList.remove('is-playing');
    });
}

/* ==========================================
   BOOKING DEMO FORM → GOOGLE SHEETS
========================================== */

const bookingDemoForm = document.querySelector('#booking-demo-form');

if (bookingDemoForm) {

    bookingDemoForm.addEventListener('submit', function (event) {

        event.preventDefault();

        const submitButton =
            bookingDemoForm.querySelector('.demo-submit-button');

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';


        const formData = new URLSearchParams();

        formData.append(
            'name',
            document.querySelector('#demo-name').value.trim()
        );

        formData.append(
            'company',
            document.querySelector('#demo-company').value.trim()
        );

        formData.append(
            'mobile',
            document.querySelector('#demo-mobile').value.trim()
        );

        formData.append(
            'email',
            document.querySelector('#demo-email').value.trim()
        );

        formData.append(
            'business_type',
            document.querySelector('#business-type').value
        );
		
		formData.append(
			'city',
			document.querySelector('#demo-city').value.trim()
		);

		formData.append(
			'country',
			document.querySelector('#demo-country').value.trim()
		);
		
		formData.append(
			'preferred_date',
			document.querySelector('#preferred-date').value
		);

        formData.append(
            'preferred_time',
            document.querySelector('#preferred-time').value
        );

        formData.append(
            'message',
            document.querySelector('#demo-message').value.trim()
        );


        fetch(
            'https://script.google.com/macros/s/AKfycbxGzXSq8RMd0cX9ZcvPV3uQ7eAHeNPvzBZjJ6ewyEpw0WodGUESCEPkEGpH6XCk-UXQ/exec',
            {
                method: 'POST',
                body: formData
            }
        )
        .then(function () {

            bookingDemoForm.innerHTML =
                '<div class="demo-success-message">' +
                    '<div class="demo-success-icon">✓</div>' +
                    '<h3>Thank You!</h3>' +
                    '<p>Your demo request has been received. ' +
                    'We will get in touch with you soon.</p>' +
                '</div>';

        })
        .catch(function (error) {

            console.error(
                'Demo form submission error:',
                error
            );

            submitButton.disabled = false;
            submitButton.textContent = 'Book Free Demo →';

            alert(
                'Something went wrong while sending your request. Please try again.'
            );

        });

    });

}



/* ==========================================
   Index Page, Contact Form, toggle, cancel, validation and submission
========================================== */

(() => {
    const toggle = document.getElementById("sendEmailToggle");
    const panel = document.getElementById("contactFormPanel");
    const form = document.getElementById("contactEnquiryForm");
    const cancel = document.getElementById("contactFormCancel");
    const submit = document.getElementById("contactFormSubmit");
    const status = document.getElementById("contactFormStatus");
	
    if (!toggle || !panel || !form || !cancel || !submit || !status) {
        return;
    }

    const defaultSubmitText = "Send Message";

    function setStatus(message = "", type = "") {
        status.textContent = message;
        status.classList.remove("is-success", "is-error");

        if (type) {
            status.classList.add(type);
        }
    }

    function openForm() {
        panel.classList.add("is-open");
        panel.setAttribute("aria-hidden", "false");
        panel.inert = false;
        toggle.classList.add("active");
        toggle.setAttribute("aria-expanded", "true");
    }

    function closeForm() {
        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");
        panel.inert = true;
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
        if (panel.classList.contains("is-open")) {
            closeForm();
        } else {
            openForm();
        }
    });

    cancel.addEventListener("click", () => {
        form.reset();
        setStatus();
        closeForm();
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        if (!navigator.onLine) {
            setStatus(
                "You appear to be offline. Please reconnect and try again.",
                "is-error"
            );
            return;
        }

        submit.disabled = true;
        submit.querySelector("span").textContent = "Sending...";
        setStatus();

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    "Accept": "application/json"
                }
            });

            let result;

            try {
                result = await response.json();
            } catch {
                throw new Error("The response could not be read. Please try again.");
            }

            if (!response.ok || result.success === false || result.success === "false") {
                throw new Error(
                    result.message ||
                    "Your message could not be sent. Please try again."
                );
            }

            form.reset();
            setStatus(
                "Thank you! Your enquiry has been submitted successfully.",
                "is-success"
            );
        } catch (error) {
            setStatus(
                error.message ||
                "Something went wrong. Please try again later.",
                "is-error"
            );
        } finally {
            submit.disabled = false;
            submit.querySelector("span").textContent = defaultSubmitText;
        }
    });
})();




