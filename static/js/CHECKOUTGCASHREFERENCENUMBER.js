function uploadImageListener() {
    document.getElementById('fileInput').addEventListener('change', function() {
        const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
        document.getElementById('previewImage').src = URL.createObjectURL(this.files[0]);
        document.getElementById('fileName').textContent = fileName;
    });
}

function nextButtonListener() {
    const nextButton = document.getElementById('nextButton');
    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        const fileName = document.getElementById('fileName').textContent;
        if (fileName === 'No file chosen') {
            return;
        } else {
            window.location.href = "../html/CHECKOUTPENDING.html";
        }

    });
}

document.addEventListener('DOMContentLoaded', () => {
    uploadImageListener();
    nextButtonListener();
});




















// DB SECTION