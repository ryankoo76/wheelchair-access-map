function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: { lat: 42.35, lng: -71.08 },
  });

  const infoContent = `
    <div>
      <h3>Test Location</h3>
      <p>♿ Wheelchair Accessible ✅</p>
      <img src="https://drive.google.com/uc?export=view&id=1fzHeJbWOQ2UpSE6f9IYnYPhrDdEQqU4G" width="300" />
    </div>
  `;

  const infowindow = new google.maps.InfoWindow({
    content: infoContent,
  });

  const marker = new google.maps.Marker({
    position: { lat: 42.35, lng: -71.08 },
    map,
  });

  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
}
