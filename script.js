const contactForm = document.querySelector('#contact-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');
const messagesList = document.querySelector('#messages-list'); // optional display

contactForm.addEventListener('submit', function (event) {
    event.preventDefault(); // don’t reload / navigate away

    const name = nameInput.value;
    const email = emailInput.value;
    const message = messageInput.value;

    // Example: show it on the page like a “submitted message”
    const item = document.createElement('li');
    item.textContent = `${name} (${email}): ${message}`;
    messagesList.appendChild(item);

    // Clear inputs
    nameInput.value = '';
    emailInput.value = '';
    messageInput.value = '';
});