document.querySelector('#login-btn').addEventListener('click', function (event) {
    event.preventDefault();
    
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    loginUser(email, password);
});

document.querySelector('#signup-btn').addEventListener('click', function (event) {
    event.preventDefault();
    
    const mgtId = document.querySelector('#signup-username').value;
    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;
    const organiser_name = document.querySelector('#signup-organname').value;

    // MGT ID  valid 5-digit integer
    if (!/^\d{5}$/.test(mgtId)) {
        createToast('Please enter a valid MGT ID ');
        return;
    }
    
    // MGT ID is a whole number
    if (!Number.isInteger(parseFloat(mgtId))) {
        createToast('Please enter a valid MGT ID');
        return;
    }

    // Check if any of the fields are empty
    if (!mgtId || !email || !password || !organiser_name) {
        createToast('Please fill in all the fields.');
        return;
    }

    if (password.length >= 4) {
        signupUser(mgtId, email, password, organiser_name);
    } else {
        createToast('Password should be at least 4 characters long.');
    }
});
function loginUser(email, password) {
    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
    })
    .then(response => response.json())
    .then(data => {
       
        if (data.success) {
            console.log(data);
            localStorage.setItem('email', email);
            localStorage.setItem('mgtId', data.mgtId);
            localStorage.setItem('organiser_name', data.organiser_name);
            // Redirect to 'directed.html'
            window.location.href = "organdashboard/organmain.html";
        } else {
            createToast('Invalid email or password.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function signupUser(mgtId, email, password, organiser_name) {
    fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mgtId: mgtId, email: email, password: password, organiser_name: organiser_name}),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('mgtId', mgtId);
            localStorage.setItem('organiser_name', organiser_name);
           
            createToast('Sign up successful!');
            // Automatically log in the user
            loginUser(email, password);
        } else {
          
            if (data.error.code === 'EMAIL_EXISTS') {
                createToast('A user with this email already exists.');
            } else {
                createToast(data.error.message);
            }
        }
    })
    .catch(error => {
        console.error(error);
    });
}


function createToast(message) {
  
  var toast = document.getElementById("toast");
  toast.innerText = message;
  toast.className = "toast show";

 
  setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 2000);
}


//backbutton

let backButton = document.querySelector('.back-button');

backButton.addEventListener('click', function() {
    // Redirect to index.html
    window.location.href = '../index.html';
});