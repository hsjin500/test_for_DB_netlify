document.getElementById('map-info-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
  
    // Send the data to the server
    try {
      const response = await fetch('./.netlify/functions/sqlite-handler', {
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
      loadMapInfo(); // 데이터 저장 후 표를 업데이트합니다.
    } catch (error) {
      console.error('Error saving data:', error);
    }
  });
  
  async function loadMapInfo() {
    try {
      const response = await fetch('./.netlify/functions/sqlite-handler', {
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
    idCell.textContent = info.id;
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

    // 행을 표에 추가합니다.
    tableBody.appendChild(tr);
    });
}

loadMapInfo();
    
  