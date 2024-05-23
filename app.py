from flask import Flask, request, render_template
import os
import csv

app = Flask(__name__)
IMAGE_UPLOAD_FOLDER = 'static/pics'
CSV_UPLOAD_FOLDER = 'static/data'

# Ensure the upload folders exist
os.makedirs(IMAGE_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CSV_UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    if file.filename == '':
        return 'No selected file'
    
    if file:
        filename = file.filename
        file_ext = os.path.splitext(filename)[1].lower()
        if file_ext in ['.jpg', '.jpeg', '.png']:
            save_path = os.path.join(IMAGE_UPLOAD_FOLDER, filename)
            file.save(save_path)
            return 'Image uploaded successfully'
        elif file_ext == '.csv':
            save_path = os.path.join(CSV_UPLOAD_FOLDER, filename)
            if os.path.exists(save_path):
                merge_csv(file, save_path)
                return 'CSV file merged successfully'
            else:
                file.save(save_path)
                return 'CSV file uploaded successfully'
        else:
            return 'Unsupported file type'

def merge_csv(new_file, existing_file_path):
    new_data = csv.reader(new_file.stream.read().decode('utf-8').splitlines())
    existing_data = []
    
    with open(existing_file_path, 'r', newline='', encoding='utf-8') as existing_file:
        reader = csv.reader(existing_file)
        existing_data = list(reader)

    with open(existing_file_path, 'a', newline='', encoding='utf-8') as existing_file:
        writer = csv.writer(existing_file)
        for row in new_data:
            writer.writerow(row)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
