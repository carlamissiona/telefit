async function fetchData(type) {
    try {
        const response = await fetch(`/api/${type}`);
        if (response.ok) {
            const data = await response.json();
            displayItems(type, data);
        }
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
    }
}

function displayItems(type, items) {
    const container = document.getElementById(`${type}List`);
    container.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>City: ${item.city}</p>
            <p>Tagline: ${item.tagline}</p>
            <img src="${item.image}" alt="${item.name}">
        `;
        container.appendChild(card);
    });
}

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(section).style.display = 'block';
    fetchData(section);
}

async function showAddForm(type) {
    const name = prompt('Enter name:');
    const description = prompt('Enter description:');
    const city = prompt('Enter city:');
    const tagline = prompt('Enter tagline:');
    const image = prompt('Enter image URL:');

    if (name && description && city && tagline && image) {
        try {
            const response = await fetch(`/api/${type}s`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    description,
                    city,
                    tagline,
                    image
                })
            });

            if (response.ok) {
                fetchData(`${type}s`);
            }
        } catch (error) {
            console.error(`Error adding ${type}:`, error);
        }
    }
}

async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

// Load stores by default
showSection('stores');