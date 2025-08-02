class BackgroundRemover {
    constructor() {
        this.uploadArea = document.getElementById('uploadArea');
        this.imageInput = document.getElementById('imageInput');
        this.imagesSection = document.getElementById('imagesSection');
        this.originalImage = document.getElementById('originalImage');
        this.resultImage = document.getElementById('resultImage');
        this.removeButton = document.getElementById('removeButton');
        this.downloadButton = document.getElementById('downloadButton');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        this.resultContainer = document.getElementById('resultContainer');
        
        this.currentFile = null;
        this.processedImageData = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // File input change
        this.imageInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // Click to browse
        this.uploadArea.addEventListener('click', () => {
            this.imageInput.click();
        });

        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });

        this.uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });

        // Remove background button
        this.removeButton.addEventListener('click', () => {
            this.removeBackground();
        });

        // Download button
        this.downloadButton.addEventListener('click', () => {
            this.downloadResult();
        });
    }

    handleFileSelect(file) {
        if (!file) {
            this.showError('No file selected');
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            this.showError('Please select a valid image file (JPG, PNG, or WEBP)');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showError('File size too large. Please select an image under 10MB');
            return;
        }

        this.currentFile = file;
        this.hideError();
        this.showImagePreview(file);
    }

    showImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImage.src = e.target.result;
            this.imagesSection.style.display = 'grid';
            this.resetResult();
        };
        reader.readAsDataURL(file);
    }

    resetResult() {
        this.resultImage.style.display = 'none';
        this.downloadButton.style.display = 'none';
        this.resultContainer.querySelector('.placeholder').style.display = 'block';
        this.processedImageData = null;
    }

    async removeBackground() {
        if (!this.currentFile) {
            this.showError('Please select an image first');
            return;
        }

        this.setLoading(true);
        this.hideError();

        try {
            const formData = new FormData();
            formData.append('image', this.currentFile);

            const response = await fetch('http://localhost:8000/remove-background', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Server error: ${response.status}`);
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            
            this.processedImageData = blob;
            this.showResult(imageUrl);

        } catch (error) {
            console.error('Error removing background:', error);
            this.showError(`Failed to remove background: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    showResult(imageUrl) {
        this.resultContainer.querySelector('.placeholder').style.display = 'none';
        this.resultImage.src = imageUrl;
        this.resultImage.style.display = 'block';
        this.downloadButton.style.display = 'inline-block';
    }

    downloadResult() {
        if (!this.processedImageData) {
            this.showError('No processed image to download');
            return;
        }

        const url = URL.createObjectURL(this.processedImageData);
        const a = document.createElement('a');
        a.href = url;
        a.download = `background_removed_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    setLoading(isLoading) {
        const btnText = this.removeButton.querySelector('.btn-text');
        const spinner = this.removeButton.querySelector('.spinner');
        
        if (isLoading) {
            btnText.style.display = 'none';
            spinner.style.display = 'block';
            this.removeButton.disabled = true;
        } else {
            btnText.style.display = 'block';
            spinner.style.display = 'none';
            this.removeButton.disabled = false;
        }
    }

    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.style.display = 'block';
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundRemover();
});

// Handle fetch errors globally
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});