async function fetchLocations() {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2Z2qzOUo5U5RZ5-cV79UeGsO6SzYY7GbJenPWVLKhx8-8S-yWZ0z6UFDd07_bHZ5mT3pFA6FP-r8b/pub?gid=0&single=true&output=csv";

    const response = await fetch(sheetURL);
    const csvText = await response.text();
    const rows = csvText.split("\n").map(row => row.split(","));

    // 헤더 제거 후 데이터 가공
    const locations = rows.slice(1).map(row => ({
        name: row[0],
        lat: parseFloat(row[1]),
        lng: parseFloat(row[2]),
        accessible: row[3].trim().toLowerCase() === "true"
        imageUrl: row[5]?.trim()
    }));

    return locations;
}

async function initMap() {
    const locations = await fetchLocations();

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: { lat: locations[0].lat, lng: locations[0].lng }
    });

    locations.forEach(location => {
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name,
            icon: location.accessible
                ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="max-width: 250px;">
                    <strong>${location.name}</strong><br>
                    🚶‍♂️ ${location.accessible ? "Wheelchair Accessible ✅" : "Wheelchair Inaccessible ❌"}<br>
                    ${location.imageUrl ? `<img src="${location.imageUrl}" alt="${location.name}" style="margin-top:5px; width:100%; border-radius:8px;">` : ""}
                </div>
            `
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    });
}

window.onload = initMap;


