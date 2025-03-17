function initMap() {
    // 지도 초기화 (기본 위치 설정)
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: { lat: 42.3601, lng: -71.0589 }, // Boston 기본 위치
    });

    // CSV 데이터 불러오기
    fetch('locations.csv')
        .then(response => response.text())
        .then(data => {
            const locations = parseCSV(data);
            locations.forEach(location => {
                const marker = new google.maps.Marker({
                    position: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
                    map: map,
                    title: location.name,
                    icon: location.accessible === "True"
                        ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `<strong>${location.name}</strong><br>${location.accessible === "True" ? "✅ Accessible" : "❌ Not Accessible"}`
                });

                marker.addListener("click", () => {
                    infoWindow.open(map, marker);
                });
            });
        })
        .catch(error => console.error("Error loading CSV file:", error));
}

// CSV 파싱 함수
function parseCSV(data) {
    const rows = data.split("\n").slice(1); // 첫 번째 줄(헤더) 제외
    return rows.map(row => {
        const [name, latitude, longitude, accessible] = row.split(",");
        return { name, latitude, longitude, accessible };
    });
}

window.onload = initMap;
