fetch('http://localhost:5000/announcements')
    .then(response => response.json())
    .then(data => {
        const zoomContent = document.querySelector('.zoom-content');
        data.forEach(row => {
            const p = document.createElement("p");
            const now = new Date();
            const formattedDate = `${now.getDate()}:${now.getMonth()+1}:${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
            p.textContent = `• ${row.organiser_name} [${row.mgtId}] ${row.notify} ${row.evtname} [${row.evttype}] on ${formattedDate}`;

            p.classList.add('fade-text');

            // Set a random animation delay
            const delay = Math.random() * 5; // Change 5 
            p.style.animationDelay = `${delay}s`;

            zoomContent.appendChild(p);
        });
    })
    .catch(console.error);