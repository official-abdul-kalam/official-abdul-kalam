# Background Remover Web App

A simple web application that uses AI to remove backgrounds from images. Built with HTML/CSS/JavaScript frontend and FastAPI + rembg backend.

## Features

- 🖼️ **Drag & Drop Upload**: Easy image upload with drag and drop functionality
- 🎨 **Real-time Preview**: See your original image before processing
- 🤖 **AI Background Removal**: Uses the rembg library with U2-Net model
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⬇️ **Download Results**: Download processed images with transparent backgrounds
- ⚡ **Fast Processing**: Optimized for quick background removal
- 🛡️ **Error Handling**: Comprehensive validation and error messages

## Project Structure

```
background-remover/
├── index.html          # Main frontend page
├── style.css           # Styling and responsive design
├── script.js           # Frontend JavaScript logic
├── main.py             # FastAPI backend server
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## Requirements

- Python 3.8+
- Modern web browser
- Internet connection (for initial model download)

## Installation & Setup

### 1. Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd background-remover

# Or download and extract the files to a folder
```

### 2. Set Up Python Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**Note**: The first time you run the app, rembg will automatically download the AI model (~176MB). This may take a few minutes depending on your internet connection.

### 4. Start the Backend Server

```bash
python main.py
```

The FastAPI server will start on `http://localhost:8000`

You can also run with uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Open the Frontend

Simply open `index.html` in your web browser, or serve it with a local server:

```bash
# Using Python's built-in server
python -m http.server 3000

# Using Node.js (if you have it installed)
npx serve .

# Using PHP (if you have it installed)
php -S localhost:3000
```

Then visit `http://localhost:3000` in your browser.

## Usage

1. **Upload an Image**: 
   - Click the upload area to browse files, or
   - Drag and drop an image onto the upload area

2. **Preview**: 
   - Your original image will appear on the left side

3. **Remove Background**: 
   - Click the "Remove Background" button
   - Wait for processing (usually 2-10 seconds)

4. **Download Result**: 
   - The processed image will appear on the right
   - Click "Download" to save the result

## Supported Image Formats

- **Input**: JPEG, JPG, PNG, WEBP
- **Output**: PNG (with transparency)
- **Max Size**: 10MB per image

## API Documentation

Once the backend is running, you can view the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### API Endpoints

- `GET /` - Health check
- `POST /remove-background` - Remove background from uploaded image
- `GET /health` - Detailed health check

## Troubleshooting

### Common Issues

1. **"rembg not found" error**:
   ```bash
   pip install rembg==2.0.54
   ```

2. **Model download fails**:
   - Check your internet connection
   - Try running the app again (it will retry the download)

3. **CORS errors in browser**:
   - Make sure the backend is running on port 8000
   - Check that your frontend is making requests to the correct URL

4. **Image processing is slow**:
   - First-time usage downloads the AI model
   - Larger images take longer to process
   - Consider resizing very large images

### Performance Tips

- **Image Size**: Smaller images (under 2MB) process faster
- **Resolution**: 1920x1080 or smaller is recommended for best performance
- **Format**: PNG and JPEG work best

## Development

### Backend Development

```bash
# Run with auto-reload for development
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

The frontend is vanilla HTML/CSS/JavaScript, so any changes are immediately visible when you refresh the browser.

### Adding Features

Some ideas for enhancements:
- Multiple AI models selection
- Batch processing
- Image editing tools
- User accounts and history
- API rate limiting

## Dependencies

### Backend (Python)
- **FastAPI**: Web framework
- **uvicorn**: ASGI server
- **rembg**: AI background removal
- **Pillow**: Image processing
- **python-multipart**: File upload handling

### Frontend
- **Vanilla JavaScript**: No frameworks required
- **Modern CSS**: Grid, Flexbox, CSS Variables
- **Responsive Design**: Mobile-friendly

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Look at the browser console for error messages
3. Check the backend logs in the terminal
4. Open an issue with details about your problem
