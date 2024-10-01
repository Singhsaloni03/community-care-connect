document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display donation requests
    function fetchDonations() {
        fetch('http://localhost:5001/api/donations')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#donationTable tbody');
                tableBody.innerHTML = ''; // Clear existing rows

                data.forEach(donation => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${donation.itemName}</td>
                        <td>${donation.quantity}</td>
                        <td>${donation.itemLocation}</td>
                        <td>${donation.status}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching donation requests:', error);
            });
    }

    fetchDonations();

    // Handle donation form submission
    document.getElementById('donationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const itemName = document.getElementById('itemName').value;
        const itemDescription = document.getElementById('itemDescription').value;
        const itemLocation = document.getElementById('itemLocation').value;
        const quantity = document.getElementById('quantity').value;

        const token = localStorage.getItem('token');

        fetch('http://localhost:5001/api/donations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ itemName, itemDescription, itemLocation, quantity })
        })
        .then(response => response.json())
        .then(data => {
            if (data._id) {
                alert('Donation submitted successfully!');
                closeModal('donationModal');

                // Update the donation requests table without reloading
                const tableBody = document.querySelector('#donationTable tbody');
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${data.itemName}</td>
                    <td>${data.quantity}</td>
                    <td>${data.itemLocation}</td>
                    <td>Pending</td> <!-- Assuming new donations start with a "Pending" status -->
                `;
                tableBody.appendChild(row);
            } else {
                alert('Donation submission failed: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during donation submission.');
        });
    });

    // Handle login form submission
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        fetch('http://localhost:5001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                alert('Login successful!');
                closeModal('loginModal');
            } else {
                alert('Login failed: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during login.');
        });
    });

    // Handle registration form submission
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const phone = document.getElementById('registerPhone').value;

        fetch('http://localhost:5001/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, phone })
        })
        .then(response => response.json())
        .then(data => {
            if (data._id) {
                alert('Registration successful!');
                closeModal('registerModal');
            } else {
                alert('Registration failed: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during registration.');
        });
    });

    // Open and close modals
    document.getElementById('loginButton').addEventListener('click', function() {
        openModal('loginModal');
    });

    document.getElementById('registerButton').addEventListener('click', function() {
        openModal('registerModal');
    });

    document.querySelectorAll('.close').forEach(function(closeButton) {
        closeButton.addEventListener('click', function() {
            closeModal(this.closest('.modal').id);
        });
    });

    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };

    // Open donation form in a modal
    document.querySelector('.cta-button').addEventListener('click', function() {
        openModal('donationModal');
    });
});
