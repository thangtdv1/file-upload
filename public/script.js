document
  .getElementById('fileInput')
  .addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const preview = document.getElementById('preview');
    const imagePreview = document.getElementById('imagePreview');
    const videoPreview = document.getElementById('videoPreview');
    const submitBtn = document.getElementById('submitBtn');

    reader.onprogress = function (event) {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        progressBar.style.width = percentComplete + '%';
        progressText.textContent = percentComplete + '%';
      }
    };

    reader.onload = function (e) {
      progressBar.style.width = '100%';
      progressText.textContent = 'File loaded!';

      if (file.type.startsWith('image/')) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        videoPreview.style.display = 'none';
      } else if (file.type.startsWith('video/')) {
        videoPreview.src = e.target.result;
        videoPreview.style.display = 'block';
        imagePreview.style.display = 'none';
      } else {
        alert('File type not supported for preview!');
        return;
      }

      preview.style.display = 'block';
      submitBtn.disabled = false;
    };

    reader.onerror = function () {
      progressBar.style.width = '0%';
      progressText.textContent = 'Error reading file.';
      console.error('Error reading file:', reader.error);
    };

    reader.readAsDataURL(file);

    submitBtn.addEventListener('click', function () {
      const formData = new FormData();
      formData.append('file', file);

      fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Server response:', data);
          alert('File uploaded successfully!');
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
          alert('Failed to upload file.');
        });
    });
  });
