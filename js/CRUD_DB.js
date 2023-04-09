document.getElementById('map-info-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // 추가할 때 로딩 표시 보이기
    const loading = document.querySelector('#loading');
    loading.style.display = 'block';
    
    const name = document.getElementById('name').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
  
    // Send the data to the server
    try {
      const response = await fetch('/.netlify/functions/mongoDB-handler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'add', name, latitude, longitude }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Data saved successfully:', result);
      updateMapInfo(); // 데이터 저장 후 표를 업데이트합니다.
    } catch (error) {
      console.error('Error saving data:', error);
    }
  });
  
  async function updateMapInfo() {
    try {
      const response = await fetch('/.netlify/functions/mongoDB-handler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'get_all' }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const mapInfo = await response.json();
      console.log('Map info loaded:', mapInfo);
  
      // 표에 데이터를 표시합니다.
      displayMapInfo(mapInfo);
      // input 요소들의 값을 비웁니다.
      document.getElementById('name').value = '';
      document.getElementById('latitude').value = '';
      document.getElementById('longitude').value = '';
      // 추가가 완료되면 로딩 표시 숨기기
      loading.style.display = 'none';
    } catch (error) {
      console.error('Error loading map info:', error);
    }
  }
  
  function displayMapInfo(mapInfo) {
    const tableBody = document.querySelector('#map-info-table tbody');
    tableBody.innerHTML = ''; // 표의 내용을 초기화합니다.
  
    // 각 데이터를 행으로 추가합니다.
    mapInfo.forEach(info => {
      const tr = document.createElement('tr');
  
      // ID 열 추가
      const idCell = document.createElement('td');
      idCell.textContent = info._id;
      tr.appendChild(idCell);
  
      // Name 열 추가
      const nameCell = document.createElement('td');
      nameCell.textContent = info.name;
      tr.appendChild(nameCell);
  
      // Latitude 열 추가
      const latitudeCell = document.createElement('td');
      latitudeCell.textContent = info.latitude;
      tr.appendChild(latitudeCell);
  
      // Longitude 열 추가
      const longitudeCell = document.createElement('td');
      longitudeCell.textContent = info.longitude;
      tr.appendChild(longitudeCell);
  
      // 삭제 버튼 열 추가
      const deleteButtonCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'x';
      deleteButton.setAttribute('data-id', info._id); // 삭제 버튼에 ID를 설정합니다.
      deleteButton.addEventListener('click', deleteMapInfo); // 삭제 버튼에 이벤트 리스너를 등록합니다.
      deleteButtonCell.appendChild(deleteButton);
      tr.appendChild(deleteButtonCell);

      // 행을 표에 추가합니다.
      tableBody.appendChild(tr);
    });
  }
  
  async function deleteMapInfo(event) {
    const id = event.target.getAttribute('data-id');
  
    try {
      const response = await fetch('/.netlify/functions/mongoDB-handler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'delete', id }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Data deleted successfully:', result);
      updateMapInfo(); // 데이터 삭제 후 표를 업데이트합니다.
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }
  
updateMapInfo();
    
  