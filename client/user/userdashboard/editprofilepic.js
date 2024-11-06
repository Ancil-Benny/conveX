document.getElementById('pic-edit').addEventListener('click', function() {
    document.getElementById('pic-upload').click();
});

document.getElementById('pic-upload').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-pic').src = e.target.result;
        }
        reader.readAsDataURL(this.files[0]);
    }
});
