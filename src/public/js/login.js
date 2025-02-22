document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/api/login', {
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
            alert(data.error || 'Login failed');
            console.log("json"); 
            console.log(data);
        }
    } catch (error) {
        alert('An error occurred during login');
        console.log("error response");
        console.log(response.json());
    }
});