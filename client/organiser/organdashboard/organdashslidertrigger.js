document.addEventListener('DOMContentLoaded', (event) => {
      // Get mgtId and email from local storage
      let mgtId = localStorage.getItem('mgtId');
      let email = localStorage.getItem('email');
  
      // Update the text of the h2 and span elements
      document.querySelector('.name.text-white').textContent = mgtId;
      document.querySelector('.position.text-dark').textContent = email;

    // Fetch the image path from the server
    fetch(`http://localhost:5000/getImagePath?mgtId=${mgtId}`)
    .then(response => response.json())
    .then(data => {
    let imgElement = document.querySelector('.profile-img');
        if (data.picedit) {
            imgElement.src = data.picedit;
        } else {
            imgElement.src = "images/profile.svg"; // default image path
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    // Get the sidebar elements
    const menuItems = document.querySelectorAll('.slist .slink span');
    const eventsLink = Array.from(menuItems).find(item => item.textContent === 'My Events').parentNode;
    const myEventsLink = Array.from(menuItems).find(item => item.textContent === 'Add New').parentNode;
    const editLink = Array.from(menuItems).find(item => item.textContent === 'Edit Profile').parentNode;

    // Get the slider, table and form elements
    const table = document.querySelector('.usermyeventscontainer');
    const add = document.querySelector('.organeditcontainer');/*previous-slider*/
   const form = document.querySelector('.usereditcontainer');

    // Hide the table and form by default when the page loads
    table.style.display = 'block';
   add.style.display = 'none';
   form.style.display = 'none';
    // Add event listeners
    eventsLink.addEventListener('click', (e) => {
        e.preventDefault();
        add.style.display = 'none';  // Show the slider(*edit,block)
        form.style.display = 'none'; 
        table.style.display = 'block';  // Show the table
        

        table.scrollIntoView({behavior: "smooth"});
    });

   myEventsLink.addEventListener('click', (e) => {
        e.preventDefault();
        table.style.display = 'none';  // Show the table
         form.style.display = 'none';  // Hide the form
         add.style.display = 'block';
       
         
        add.scrollIntoView({behavior: "smooth"});
    });
    

    editLink.addEventListener('click', (e) => {
        e.preventDefault();
        add.style.display = 'none';  // Hide the slider
        table.style.display = 'none';  // Hide the table
        form.style.display = 'block';  // Show the form

        
        form.scrollIntoView({behavior: "smooth"});
    });
});


//sign out button, rename sigin html to usersign.html
let slidersignbutton = document.querySelector('.slidersignout');
let timerId;

slidersignbutton.addEventListener('click', function() {
    if (slidersignbutton.innerHTML === 'CONFIRM') {
        // Trigger your action here
        slidersignbutton.innerHTML = 'Signing out';
        slidersignbutton.classList.remove('CONFIRM');

        // Clear the local storage item
        localStorage.removeItem('mgtId');

        // Redirect to usersign.html
        window.location.href = '../organsign.html';
    } else {
        slidersignbutton.innerHTML = 'CONFIRM';
        slidersignbutton.classList.add('CONFIRM');
        // If not clicked within 5 seconds, revert back to original state
        timerId = setTimeout(function() {
            slidersignbutton.innerHTML = 'SIGN OUT';
            slidersignbutton.classList.remove('CONFIRM');
        }, 2500);
    }
});

slidersignbutton.addEventListener('mousedown', function() {
    clearTimeout(timerId);
});


