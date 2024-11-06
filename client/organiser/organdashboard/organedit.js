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
            document.getElementById('sliderprofile-pic').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// Form submission code
editbutton.forEach(function(editbutton) {
    let timerId;

    editbutton.addEventListener('click', function() {
        if (editbutton.innerHTML === 'CONFIRM') {
            // Get the input values
            let name = document.getElementById('usereditusername').value;
            let email = document.getElementById('usereditemail').value;
            let password = document.getElementById('usereditpassword').value;
            let mgtId = localStorage.getItem('mgtId'); // Get mgtId from local storage

            // Create the data object
            let data = {
                mgtId: mgtId,
                organiser_name: name,
                email: email,
                password: password,
                picedit: editimagePath // Include the image path
            };

            // Check if any field is empty
           if (!data.organiser_name || !data.email || !data.password || !data.mgtId || !data.picedit) {
            showAlert('warning', 'Warning', 'Please fill all fields and select an image');
                return;
            }

            // Send a POST request to the server
            fetch('http://localhost:5000/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('success','Success','Data updated successfully!',() => location.reload(true));
                    localStorage.setItem('email', data.email);
                   
                } else {
                    console.log('Failed to update data.');
                }
            })
            .catch(error => {
                console.error(error);
            });

            editbutton.innerHTML = 'UPDATE';
            editbutton.classList.remove('CONFIRM'); // Change color back to original
        } else {
           editbutton.innerHTML = 'CONFIRM';
            editbutton.classList.add('CONFIRM'); // Change color to red
            // If not clicked within 5 seconds, revert back to original state
            timerId = setTimeout(function() {
                editbutton.innerHTML = 'UPDATE';
                editbutton.classList.remove('CONFIRM'); // Change color back to original
            }, 2500);
        }
    });

    editbutton.addEventListener('mousedown', function() {
        clearTimeout(timerId);
    });
});