document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('table');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    let currentDate = new Date();
    let csvFileName = getCurrentCSVFileName(); // 현재 CSV 파일 이름을 가져오는 함수를 호출하여 초기화
    let currentPage = 0;
    const rowsPerPage = 30;

    // CSV 파일 이름을 현재 날짜의 포맷에 맞게 반환하는 함수
    function getCurrentCSVFileName() {
        const dateFormat = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        return `static/data/${dateFormat}.csv`;
    }

    // CSV 파일에서 데이터를 읽어와서 HTML 테이블에 추가하는 함수
    function loadCSVData() {
        fetch(csvFileName)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('File not found');
                } else {
                    throw new Error('Network response was not ok');
                }
            }
            showTableDate();
            return response.text();
        })
        .then(data => {
            const rows = data.split('\n');
            const startIndex = currentPage * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const slicedRows = rows.slice(startIndex, endIndex);
            const tbody = document.querySelector('#table tbody');
            tbody.innerHTML = '';

            if (slicedRows.length === 0) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.textContent = '저장된 데이터가 없습니다';
                td.colSpan = 2; // 두 개의 열을 합침
                tr.appendChild(td);
                tbody.appendChild(tr);
            } else {
                slicedRows.forEach(row => {
                    const cells = row.split(',');
                    const tr = document.createElement('tr');
                    cells.forEach((cell, index) => {
                    const td = document.createElement('td');
                    if (index === 0 && cell.trim().endsWith('.JPG')) { // 첫 번째 열이 이미지 URL인 경우
                            const img = document.createElement('img');
                            img.src = `static/pics/${cell.trim()}`; // 이미지 URL 설정
                            img.width = 720; // 이미지 폭 설정 (원하는 크기로 조절)
                            img.height = 480; // 이미지 높이 설정 (원하는 크기로 조절)
                            td.appendChild(img); // 이미지를 td에 추가
                    } else {
                            td.textContent = cell.trim();
                        }
                        tr.appendChild(td);
                    });

                    tbody.appendChild(tr);
                });
            }
        })
        .catch(error => {
            console.error('Error loading CSV file:', error);
            // CSV 파일이 없을 경우, 기존 테이블 데이터 유지
            if (error.message === 'File not found') {
                showTableDate();
                const tbody = document.querySelector('#table tbody');
                tbody.innerHTML = '';
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.textContent = '저장된 데이터가 없습니다';
                td.colSpan = 2; // 두 개의 열을 합침
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
        });
    }

    function showTableDate() {
        const tableDate =  document.getElementById('table_date');
        tableDate.textContent = `${currentDate.getFullYear()}년 ${(currentDate.getMonth() + 1).toString().padStart(2, '0')}월 ${currentDate.getDate().toString().padStart(2, '0')}일` + " 신호위반 차량 목록";
    }

    // 현재 시간을 표시하는 함수
    function updateTime() {
        const currentTime = new Date();
        const year = currentTime.getFullYear();
        const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
        const day = currentTime.getDate().toString().padStart(2, '0');
        const hours = currentTime.getHours().toString().padStart(2, '0');
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const seconds = currentTime.getSeconds().toString().padStart(2, '0');
        const formattedTime = `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`;

        const currentTimeElement = document.getElementById('date');
        currentTimeElement.textContent = "현재 시간: " + formattedTime;
    }

    prevButton.addEventListener('click', function() {
        currentPage = Math.max(0, currentPage - 1);
        updateDate(-1);
        loadCSVData();
    });

    nextButton.addEventListener('click', function() {
        currentPage = Math.min(Math.floor(table.rows.length / rowsPerPage), currentPage + 1);
        updateDate(1);
        loadCSVData();
    });

    function updateDate(diff) {
        currentDate.setDate(currentDate.getDate() + diff);
        csvFileName = getCurrentCSVFileName(); // CSV 파일 이름을 업데이트
    }

    // 초기화
    loadCSVData();
    updateTime();
    setInterval(updateTime, 1000);
});
