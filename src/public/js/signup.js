document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        type: document.getElementById('type').value,
        homeAddress: document.getElementById('homeAddress').value
    };

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            window.location.href = '/user_dashboard';
        } else {
            const data = await response.json();
            alert(data.error || 'Signup failed');
        }
    } catch (error) {
        alert('An error occurred during signup');
    }
});