document.querySelector('#login-btn').addEventListener('click', function (event) {
    event.preventDefault();
    
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    loginUser(email, password);
});

document.querySelector('#signup-btn').addEventListener('click', function (event) {
    event.preventDefault();
    
    const username = document.querySelector('#signup-username').value;
    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;

    if (password.length >= 4) {
        signupUser(username, email, password);
    } else {
        createToast('Password should be at least 4 characters long.');
    }
});

function loginUser(email, password) {
    fetch('http://localhost:5000/userlogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('useremail', email);
            localStorage.setItem('username', data.username); // store username
            localStorage.setItem('userId', data.userId);

            // Redirect to 'directed.html'
            window.location.href = "userdashboard/usermain.html";
        } else {
            createToast('Invalid email or password.');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

function signupUser(username, email, password) {
    fetch('http://localhost:5000/usersignup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, email: email, password: password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            createToast('Sign up successful!');
           
            loginUser(email, password);
        } else {
         
            createToast(data.error);
        }
    })
    .catch(error => {
        console.error(error);
    });
}

function createToast(message) {
  // Show the toast
  var toast = document.getElementById("toast");
  toast.innerText = message;
  toast.className = "toast show";

  //2 seconds, 
  setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 2000);
}


//backbutton

let backButton = document.querySelector('.back-button');


backButton.addEventListener('click', function() {
    // Redirect to index.html
    window.location.href = '../index.html';
});