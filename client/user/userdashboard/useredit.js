//rename backend requests names when combining.
let editbutton = document.querySelectorAll('.edit-updatebtn');
let editimagePath = ''; // Variable to store the image path

// Image selection code
document.getElementById('pic-edit').addEventListener('click', function() {
    document.getElementById('pic-upload').click();
});

document.getElementById('pic-upload').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        var file = this.files[0];
        var fileName = file.name;
        editimagePath = 'images/' + fileName; // Store the path in the imagePath variable

        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-pic').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// Form submission code
editbutton.forEach(function(button) {
    let timerId;

    button.addEventListener('click', function() {
        if (button.innerHTML === 'Confirm') {
            // Get the input values
            let name = document.getElementById('usereditusername').value;
            let email = document.getElementById('usereditemail').value;
            let password = document.getElementById('usereditpassword').value;
            let userId = localStorage.getItem('userId'); // Get mgtId from local storage

            // Create the data object
            let data = {
                userId: userId,
                username: name,
                email: email,
                password: password,
                userpicedit: editimagePath // Include the image path
            };

            // Check if any field is empty
            if (!data.username || !data.email || !data.password  || !data.userpicedit) {
                showAlert('warning', 'Warning', 'Please fill all fields and select an image');
                return;
            }

            // Send a POST request to the server
            fetch('http://localhost:5000/userupdate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('useremail', data.useremail);
                    localStorage.setItem('username', data.username);
                    showAlert('success', 'SUCCESS', 'Data updation success.',() => location.reload(true));
                   
                } else {
                    console.log('Failed to update data.');
                }
            })
            .catch(error => {
                console.error(error);
            });

            button.innerHTML = 'UPDATE';
            button.classList.remove('confirm'); // Change color back to original
        } else {
            button.innerHTML = 'Confirm';
            button.classList.add('confirm'); // Change color to red
            // If not clicked within 5 seconds, revert back to original state
            timerId = setTimeout(function() {
                button.innerHTML = 'UPDATE';
                button.classList.remove('confirm'); // Change color back to original
            }, 5000);
        }
    });

    button.addEventListener('mousedown', function() {
        clearTimeout(timerId);
    });
});

