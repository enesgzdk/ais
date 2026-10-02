let map;
let marker;
let socket;

const API_KEY = "2592f9c9ab177b85ed30b95a5ee3a42309338da5";
const TARGET_MMSI = "314740000";

// Haritayı başlat (Sayfa yüklendiğinde)
function initMap() {
    // Türkiye merkezli harita
    map = L.map('map').setView([39.0, 35.0], 5);
    
    // OpenStreetMap katmanı
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Gemi ikonu tasarımı
const shipIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3211/3211116.png',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
});

// Arayüz elemanlarını seç
const statusDiv = document.getElementById('status');
const shipInfoDiv = document.getElementById('shipInfo');
document.getElementById('shipMMSI').textContent = TARGET_MMSI;

function updateStatus(message, type = 'info') {
    statusDiv.textContent = message;
    if (type === 'error') {
        statusDiv.style.background = '#f8d7da';
        statusDiv.style.color = '#721c24';
        statusDiv.style.borderColor = '#f5c6cb';
    } else if (type === 'success') {
        statusDiv.style.background = '#d4edda';
        statusDiv.style.color = '#155724';
        statusDiv.style.borderColor = '#c3e6cb';
    } else {
        statusDiv.style.background = '#e2e3e5';
        statusDiv.style.color = '#383d41';
        statusDiv.style.borderColor = '#d6d8db';
    }
}

function connectAISStream() {
    if (socket) {
        socket.close(); // Önceki bağlantıyı kapat
    }

    updateStatus('AISStream\'e bağlanılıyor...', 'info');

    socket = new WebSocket("wss://stream.aisstream.io/v0/stream");

    socket.onopen = function () {
        updateStatus('Bağlandı! Gemi verisi bekleniyor...', 'success');
        
        // aisstream.io Abonelik Mesajı
        let subscriptionMessage = {
            Apikey: API_KEY,
            BoundingBoxes: [[[-90, -180], [90, 180]]],
            FiltersShipMMSI: [TARGET_MMSI],
            FilterMessageTypes: ["PositionReport", "ShipStaticData"]
        }
        socket.send(JSON.stringify(subscriptionMessage));
    };

    socket.onmessage = async function (event) {
        try {
            let dataText = event.data;
            
            // Eğer veri Blob(Binary) olarak geliyorsa metne çevir (Hata çözümü için)
            if (event.data instanceof Blob) {
                dataText = await event.data.text();
            }

            let aisMessage = JSON.parse(dataText);
            
            // Eğer konum verisi geldiyse
            if (aisMessage["MessageType"] === "PositionReport") {
                let positionReport = aisMessage["Message"]["PositionReport"];
                let lat = positionReport["Latitude"];
                let lon = positionReport["Longitude"];
                let speed = positionReport["Sog"]; // Speed over ground
                let course = positionReport["Cog"]; // Course over ground
                
                updateMap(lat, lon, TARGET_MMSI);
                updateShipInfo(lat, lon, speed, course);
                updateStatus('Canlı veri alınıyor.', 'success');
            }
            // Eğer geminin genel bilgileri geldiyse (İsim vb.)
            else if (aisMessage["MessageType"] === "ShipStaticData") {
                 let staticData = aisMessage["Message"]["ShipStaticData"];
                 let shipName = staticData["Name"].trim();
                 if (shipName) {
                     document.getElementById('shipName').textContent = shipName;
                 }
            }
        } catch (err) {
            console.error("Veri işlenirken hata:", err);
        }
    };

    socket.onerror = function(error) {
        updateStatus('Bağlantı hatası oluştu!', 'error');
        console.error("WebSocket Hatası:", error);
    };

    socket.onclose = function() {
        updateStatus('Bağlantı koptu. Yeniden bağlanılıyor...', 'error');
        // Koptuğunda otomatik yeniden bağlanmayı dene
        setTimeout(connectAISStream, 5000);
    };
}

function updateMap(lat, lon, mmsi) {
    if (marker) {
        // Zaten işaretçi varsa yerini değiştir
        marker.setLatLng([lat, lon]);
    } else {
        // İlk kez geliyorsa işaretçi oluştur
        marker = L.marker([lat, lon], {icon: shipIcon}).addTo(map);
        marker.bindPopup(`<b>Takip Edilen Gemi</b><br>MMSI: ${mmsi}`).openPopup();
    }
    // Haritayı gemiye odakla
    map.setView([lat, lon], 12);
}

function updateShipInfo(lat, lon, speed, course) {
    shipInfoDiv.classList.remove('hidden');
    document.getElementById('shipLat').textContent = lat.toFixed(5);
    document.getElementById('shipLon').textContent = lon.toFixed(5);
    document.getElementById('shipSpeed').textContent = (speed !== undefined) ? speed.toFixed(1) : '-';
    document.getElementById('shipCourse').textContent = (course !== undefined) ? course.toFixed(1) : '-';
    
    const now = new Date();
    document.getElementById('lastUpdate').textContent = now.toLocaleTimeString('tr-TR');
}

// Sayfa hazır olduğunda çalıştır
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    connectAISStream(); // Otomatik olarak doğrudan bağlan
});
