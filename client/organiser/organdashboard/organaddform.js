let addbutton = document.querySelectorAll('.organedit-updatebtn');
let imagePath = ''; // Variable to store the image path

// Image selection code
document.getElementById('organpic-edit').addEventListener('click', function() {
    document.getElementById('organpic-upload').click();
});

document.getElementById('organpic-upload').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        var file = this.files[0];
        var fileName = file.name;
        imagePath = 'images/' + fileName; // Store the path in the imagePath variable

        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('organprofile-pic').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// Form submission code
addbutton.forEach(function(addbutton) {
    let timerId;

    addbutton.addEventListener('click', function() {
        if (addbutton.innerHTML === 'CONFIRM') {
            // Trigger your action here
            let eventName = document.querySelector('#organediteventname').value;
            let eventType = document.querySelector('#organediteventtype').value;
            let eventDate = document.querySelector('#organuserediteventdate').value;
            let lastDate = document.querySelector('#organeditlastdate').value;
            let slots = document.querySelector('#organeditslots').value;
            let description = document.querySelector('#organeditdescription').value;

            let mgtId = localStorage.getItem('mgtId');
            let organiser_name = localStorage.getItem('organiser_name');

            let eventData = {
                evtname: eventName,
                evttype: eventType,
                evtdate: eventDate,
                evtLdate: lastDate,
                evttickets: slots,
                evttext: description,
                mgtId: mgtId,
                organiser_name: organiser_name,
                evtpic: imagePath // Include the image path
            };
            // Check if any field is empty
if (!eventData.evtname || !eventData.evttype || !eventData.evtdate || !eventData.evtLdate || !eventData.evttickets || !eventData.evttext || !eventData.mgtId || !eventData.organiser_name || !eventData.evtpic) {
    showAlert('warning', 'Warning', 'Please fill all fields and select an image.');
    return;
}
//________________________________________________________________________________
fetch('http://localhost:5000/addevent', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        // Store the required data locally
        localStorage.setItem('evtname', data.eventData.evtname);
        localStorage.setItem('evttype', data.eventData.evttype);
        localStorage.setItem('organiser_name', data.eventData.organiser_name);

    

        // Add an announcement
        let announcementData = {
            mgtId: localStorage.getItem('mgtId'), // Get mgtId from local storage
            organiser_name: localStorage.getItem('organiser_name'), // Get organiser_name from local storage
            evtname: localStorage.getItem('evtname'), // Get evtname from local storage
            evttype: localStorage.getItem('evttype'), // Get evttype from local storage
            notify: 'added' // Use 'notify' instead of 'evttext'
        };

        fetch('http://localhost:5000/addannouncement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(announcementData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('success', ' Success', 'Event Registered.', () => location.reload(true));
            } else {
                console.log('Failed to add event.');
            }
        })
        .catch(error => {
            console.error(error);
        });
    } else {
        console.log('Failed to add event.');
    }
})

//-----------------------------------------------
            .catch(error => {
                console.error(error);
            });

            addbutton.innerHTML = 'ADD';
            addbutton.classList.remove('CONFIRM'); // Change color back to original
        } else {
            addbutton.innerHTML = 'CONFIRM';
            addbutton.classList.add('CONFIRM'); // Change color to red
            // If not clicked within 5 seconds, revert back to original state
            timerId = setTimeout(function() {
                addbutton.innerHTML = 'ADD';
                addbutton.classList.remove('CONFIRM'); // Change color back to original
            }, 2500);
        }
    });

    addbutton.addEventListener('mousedown', function() {
        clearTimeout(timerId);
    });
});
function showAlert(icon, title, text, callback) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
    }).then(callback);
}