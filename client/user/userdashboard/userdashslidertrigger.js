document.addEventListener('DOMContentLoaded', (event) => {
      // Get mgtId and email from local storage
      let username = localStorage.getItem('username');
      let useremail = localStorage.getItem('useremail');
      let userId = localStorage.getItem('userId');
  
      // Update the text of the h2 and span elements
      document.querySelector('.name.text-white').textContent = username;
      document.querySelector('.position.text-dark').textContent = useremail;
      /*------------------------------------------------------*/
        // Fetch the image path from the server
    fetch(`http://localhost:5000/getuserImagePath?userId=${userId}`)
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




    /*-------------------------------------------------------*/
    // Get the sidebar elements
    const menuItems = document.querySelectorAll('.slist .slink span');
    const eventsLink = Array.from(menuItems).find(item => item.textContent === 'Events').parentNode;
    const myEventsLink = Array.from(menuItems).find(item => item.textContent === 'My Events').parentNode;
    const editLink = Array.from(menuItems).find(item => item.textContent === 'Edit').parentNode;

    // Get the slider, table and form elements
    const slider = document.querySelector('.slider');
    const table = document.querySelector('.usermyeventscontainer');
    const form = document.querySelector('.usereditcontainer');

    // Hide the table and form by default when the page loads
    table.style.display = 'none';
    form.style.display = 'none';

     // Show the slider by default when the page loads
    slider.style.display = 'block'; 

    // Add event listeners
    eventsLink.addEventListener('click', (e) => {
        e.preventDefault();
        slider.style.display = 'block';  // Show the slider
        table.style.display = 'block';  // Show the table
        form.style.display = 'none';  // Hide the form

        // Scroll to the slider
        slider.scrollIntoView({behavior: "smooth"});
    });

    myEventsLink.addEventListener('click', (e) => {
        e.preventDefault();
        slider.style.display = 'none';  // Hide the slider
        table.style.display = 'block';  // Show the table
        form.style.display = 'none';  // Hide the form
    });

    editLink.addEventListener('click', (e) => {
        e.preventDefault();
        slider.style.display = 'none';  // Hide the slider
        table.style.display = 'none';  // Hide the table
        form.style.display = 'block';  // Show the form
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
        localStorage.removeItem('userId');

        // Redirect to usersign.html
        window.location.href = '../usersign.html';
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



