import requests
import os
import csv

# Define server URL
url = '[웹 사이트 ip 입력]/upload'

# CSV 데이터 전송
# CSV 파일 명은 년-월-일.csv 형식으로 지정 (ex. 2024-05-24)
csv_data = ['[이미지 파일 이름.JPG]', '[위반 시간]']
csv_filename = '[csv 파일 이름.csv]'

# 서버에 csv 파일 없을시 csv 파일 생성
if not os.path.isfile(csv_filename):
    with open(csv_filename, 'a', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(csv_data)
else:
    with open(csv_filename, 'a', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(csv_data)

# 이미지 파일 전송
# 이미지 파일이 py 파일 경로에 함께 들어있을 경우 파일명 입력 
files_to_upload = [
    '[이미지 파일 경로]',
    csv_filename
]

for file_path in files_to_upload:
    if os.path.isfile(file_path):
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(url, files=files)
            print(f"Uploading {file_path}: {response.text}")
    else:
        print(f"File not found: {file_path}")
