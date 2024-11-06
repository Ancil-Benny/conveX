$(document).ready(function() {
    const evtid = localStorage.getItem('evtid');
    const mgtId = localStorage.getItem('mgtId');
    fetch(`http://localhost:5000/getEventDetails?mgtId=${mgtId}&evtid=${evtid}`)
        .then(response => response.json())
        .then(response => {
            const data = response.data;
            const tbody = $('.table-hover');
            tbody.empty(); // Remove the existing rows

            // Populate the title
            const title = $('.data-title');
            title.text(`${evtid} - ${data[0].evtname} - ${data[0].evttype}`);

            
            // Store the event name and type in the local storage
            localStorage.setItem('evtname', data[0].evtname);
            localStorage.setItem('evttype', data[0].evttype);

            if (data.length > 0 && data[0].username) {
                // Populate the table
                data.forEach(user => {
                    const tr = `<tr>
                        <td class="text-left">${user.username}</td>
                        <td class="text-left">${user.email}</td>
                    </tr>`;
                    tbody.append(tr);
                });
            } else {
                // Display a message when there are no registered users
                const tr = `<tr>
                    <td colspan="2" class="text-center">No users registered</td>
                </tr>`;
                tbody.append(tr);
            }
        })
        .catch(error => {
            console.error(error);
        });
});
/*================================================================== */
document.getElementById('data-delete').addEventListener('click', function() {
    document.getElementById('confirm-dialog').classList.remove('hidden');
    document.body.classList.add('blur');
 
  
document.getElementById('confirm-yes').addEventListener('click', function() {
    const evtid = localStorage.getItem('evtid');
    const mgtId = localStorage.getItem('mgtId');
    const organiser_name = localStorage.getItem('organiser_name');
    const evtname = localStorage.getItem('evtname');
    const evttype = localStorage.getItem('evttype');

    fetch('http://localhost:5000/deleteEvent', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mgtId, evtid, organiser_name, evtname, evttype }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('success', 'SUCCESS', 'Deletion successful.',() => location.reload(true));
            window.location.href = '../organmain.html';
        } else {
            alert('Deletion failed. Please try again.');
        
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    document.getElementById('confirm-dialog').classList.add('hidden');
    document.body.classList.remove('blur');
});
});
document.getElementById('confirm-no').addEventListener('click', function() {
    document.getElementById('confirm-dialog').classList.add('hidden');
    document.body.classList.remove('blur');
  });

  
//backbutton
// Select the button
let backButton = document.getElementById('data-back');

// Add click event listener
backButton.addEventListener('click', function() {
    // Redirect to index.html
    window.location.href = '../organmain.html';
});

function showAlert(icon, title, text, callback) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
    }).then(callback);
  }