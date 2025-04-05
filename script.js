async function fetchLocations() {
  const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2Z2qzOUo5U5RZ5-cV79UeGsO6SzYY7GbJenPWVLKhx8-8S-yWZ0z6UFDd07_bHZ5mT3pFA6FP-r8b/pub?gid=0&single=true&output=csv"; // <-- 실제 CSV 주소 입력

  const response = await fetch(sheetURL);
  const csvText = await response.text();
  const rows = csvText
    .trim()
    .split("\n")
    .map(line => line.split(",").map(cell => cell.trim()));
  
  console.log("Raw CSV rows:", rows); // ✅ 확인

  const locations = rows
    .slice(1) // skip header
    .map(row => ({
      name: row[0],
      lat: parseFloat(row[1]),
      lng: parseFloat(row[2]),
      accessible: row[3]?.toLowerCase() === "true",
      imageUrl: row[5] || ""
    }))
    .filter(loc => !isNaN(loc.lat) && !isNaN(loc.lng));

  console.log("Parsed locations:", locations); // ✅ 확인

  return locations;
}

async function initMap() {
  const locations = await fetchLocations();
  if (locations.length === 0) {
    alert("No location data found. Please check the sheet link.");
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
      content: `
        <div style="max-width: 250px;">
          <strong>${location.name}</strong><br>
          ♿ ${location.accessible ? "Wheelchair Accessible ✅" : "Wheelchair Inaccessible ❌"}<br>
          ${location.imageUrl ? `<img src="${location.imageUrl}" alt="${location.name}" style="margin-top:5px; width:100%; border-radius:8px;" />` : ""}
        </div>
      `
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  });
}

window.initMap = initMap;
