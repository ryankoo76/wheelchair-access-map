async function fetchLocations() {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2Z2qzOUo5U5RZ5-cV79UeGsO6SzYY7GbJenPWVLKhx8-8S-yWZ0z6UFDd07_bHZ5mT3pFA6FP-r8b/pub?gid=0&single=true&output=csv";

    try {
        const response = await fetch(sheetURL);
        const csvText = await response.text();

        console.log("CSV Data:", csvText); // ✅ 데이터 확인

        const rows = csvText.trim().split("\n").map(row => row.split(","));

        if (rows.length < 2) {
            console.error("No data found in the CSV.");
            return [];
        }

        // 헤더 제거 후 데이터 가공
        const locations = rows.slice(1).map(row => ({
            name: row[0].trim(),
            lat: parseFloat(row[1].trim()),
            lng: parseFloat(row[2].trim()),
            accessible: row[3] && row[3].trim().toLowerCase() === "true"
        }));

        console.log("Parsed Locations:", locations); // ✅ 변환된 데이터 확인

        return locations;
    } catch (error) {
        console.error("Error fetching locations:", error);
        return [];
    }
}

async function initMap() {
    const locations = await fetchLocations();

    if (locations.length === 0) {
        console.error("No valid locations to display on the map.");
        return;
    }

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
            content: `<strong>${location.name}</strong><br>🚶‍♂️ ${location.accessible ? "Wheelchair Accessible ✅" : "Wheelchair Inaccessible ❌"}`
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    });
}

window.onload = initMap;
