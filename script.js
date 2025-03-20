async function fetchLocations() {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2Z2qzOUo5U5RZ5-cV79UeGsO6SzYY7GbJenPWVLKhx8-8S-yWZ0z6UFDd07_bHZ5mT3pFA6FP-r8b/pub?gid=0&single=true&output=csv";

    const response = await fetch(sheetURL);
    const csvText = await response.text();
    const rows = csvText.split("\n").map(row => row.split(","));

    // 헤더 제거 후 데이터 가공
    const locations = rows.slice(1).map(row => ({
        name: row[1]?.trim(),
        lat: parseFloat(row[2]),  // lat이 NaN인지 확인
        lng: parseFloat(row[3]),  // lng이 NaN인지 확인
        accessible: row[4]?.trim().toLowerCase() === "true"
    }));

    console.log("Parsed Locations:", locations); // 디버깅용 콘솔 로그
    return locations;
}

async function initMap() {
    const locations = await fetchLocations();

    if (locations.length === 0 || isNaN(locations[0].lat) || isNaN(locations[0].lng)) {
        console.error("Error: No valid locations found. Please check Google Sheets data.");
        return;
    }

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: { lat: locations[0].lat, lng: locations[0].lng }  // NaN인지 확인
    });

    locations.forEach(location => {
        if (!isNaN(location.lat) && !isNaN(location.lng)) {
            const marker = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: map,
                title: location.name,
                icon: location.accessible
                    ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `<strong>${location.name}</strong><br>🚶‍♂️ ${location.accessible ? "Wheelchair Accessible ✅" : "Wheelchair Inaccessible ❌"}`
            });

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });
        } else {
            console.warn(`Invalid location skipped: ${location.name}`);
        }
    });
}

window.onload = initMap;

