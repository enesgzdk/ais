# Gemi Takip Sistemi (AIS)

Bu proje, bir geminin anlık konumunu ve hareket bilgilerini harita üzerinde canlı olarak izlemenizi sağlayan statik bir web uygulamasıdır. GitHub Pages üzerinde ücretsiz olarak yayınlanabilir.

## Özellikler

*   **Canlı Gemi Takibi:** [aisstream.io](https://aisstream.io/) WebSocket API'sini kullanarak gerçek zamanlı AIS (Otomatik Tanımlama Sistemi) verisi çeker.
*   **Harita Entegrasyonu:** Geminin konumu [Leaflet](https://leafletjs.com/) ve OpenStreetMap altyapısı kullanılarak haritada gösterilir.
*   **Gemi Bilgileri:** Hız, rota, enlem ve boylam gibi anlık detaylar panele yansıtılır. Gemi isim verisi (ShipStaticData) geldiğinde gemi ismi de gösterilir.

## Nasıl Kullanılır? (GitHub Pages ile Yayınlama)

Sadece statik dosyalardan (HTML, CSS, JS) oluştuğu için herhangi bir backend veya sunucu kurulumu gerektirmez.

1. **GitHub Deposu Oluşturun:**
   GitHub hesabınızda yeni bir repository oluşturun (örneğin: `gemi-takip`).

2. **Dosyaları Yükleyin:**
   `index.html`, `css/styles.css` ve `js/app.js` dosyalarını aynı klasör yapısını koruyarak bu repoya yükleyin.

3. **GitHub Pages'i Aktif Edin:**
   - GitHub deponuzda **Settings (Ayarlar)** kısmına gidin.
   - Sol menüden **Pages** seçeneğine tıklayın.
   - **Source** (Kaynak) kısmını `Deploy from a branch` olarak ayarlayın.
   - **Branch** kısmından `main` veya `master` branch'ini seçip `/ (root)` klasörünü belirterek **Save**'e basın.
   - Birkaç dakika içinde GitHub size sitenizin yayınlandığı linki verecektir (Örn: `https://kullaniciadiniz.github.io/gemi-takip`).

## Kullanıcı İçin Talimatlar

Siteyi açtığınızda:
1. **API Anahtarı:** Ücretsiz canlı veri çekmek için [aisstream.io](https://aisstream.io/) adresine gidip hesap oluşturarak bir API Key almanız gerekmektedir.
2. **MMSI No:** Takip etmek istediğiniz geminin 9 haneli MMSI (Maritime Mobile Service Identity) numarasını girin. Örneğin bilindik bir gemi MMSI numarasını MarineTraffic'ten bulabilirsiniz.
3. **Takip Et:** Butona bastığınızda harita otomatik olarak o gemiye odaklanacak ve veri akışı başladığında canlı hareketini gösterecektir.

## Teknolojiler

*   HTML5 / CSS3 / JavaScript (Vanilla)
*   Leaflet.js (Harita kütüphanesi)
*   AISStream WebSocket API (Veri sağlayıcı)
