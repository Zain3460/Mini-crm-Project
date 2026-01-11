Detaylı Code Review Raporu
245172017 Burak Ünal ile birlikte yapılmıştır.

## 1) Genel Değerlendirme (Özet)
Proje; Express + Sequelize (SQLite) tabanlı bir REST API olarak katmanlı yapıda (routes → services → models) organize edilmiş. 
Müşteri yönetimi, ürün/stok yönetimi, sipariş yönetimi (guest sipariş dahil), raporlama ve ETL scripti mevcut. 
CI workflow ve temel testler eklenmiş. Ancak bazı kritik alanlarda (konfigürasyon tutarlılığı, log formatı/metadata, doğrulama, test kapsamı, OpenAPI güncelliği) geliştirme ihtiyacı var.
Güçlü Yanlar
•	Katmanlı yapı (routes/services/models) okunabilirliği artırıyor.
•	Guest sipariş (customerId olmadan) için net kurallar yazılmış.
•	Siparişte ürün/stok düşümü transaction ile yapılmış (tutarlılık için doğru yaklaşım).
•	ETL scripti müşteri verisini normalize ediyor (telefon/e‑posta/kolon alternatifleri).
•	CI workflow (GitHub Actions) mevcut ve lint+test koşuyor.
Öncelikli Riskler (P0)
•	src/config/index.js .env’deki DB_STORAGE/DB_LOGGING değerlerini okumuyor; app ile sequelize-cli konfigleri ayrışıyor.
•	logger formatı metadata’yı (traceId, url, status, ms) basmıyor; loglama amacı boşa düşüyor.
•	Product endpoint’lerinde doğrulama yok (req.body direkt Product.create/update).
•	Test kapsamı çok dar (sadece health + customers list).
•	docs/openapi.yaml ve docs/DB_SCHEMA.md güncel değil (products/status endpoint’leri yok).
## 2) Mimari ve Kod Organizasyonu
Genel akış: src/app.js middleware + route mount → routes/* (HTTP) → services/* (iş kuralları) → models/* (Sequelize). 
Bu yaklaşım ders kapsamında beklenen “modülerlik ve bakım kolaylığı” kriterlerini karşılar. 
İyileştirme olarak; validation (request schema) katmanı eklenmesi ve hata yönetiminin tek bir yerde standardize edilmesi önerilir.

## 3) Konfigürasyon ve Ortam Yönetimi
Kritik nokta: uygulama runtime config’i ile sequelize-cli config’i farklı kaynaklardan geliyor.
•	src/config/index.js DB değerlerini hardcode ediyor (storage=../../dev.sqlite). .env.example içindeki DB_STORAGE/DB_LOGGING okunmuyor.
•	config/config.js (sequelize-cli) ise DB_STORAGE ve test için :memory: kullanıyor. Bu ayrışma test izolasyonunu ve taşınabilirliği bozabilir.
•	Öneri: src/config/index.js içinde DB_DIALECT/DB_STORAGE/DB_LOGGING env değerlerini öncelikli kullan; yoksa defaultlara düş.
## 4) Loglama ve Hata Yönetimi
Loglama hedefi (traceId + response time + error detail) doğru; fakat logger formatı meta alanları yazdırmıyor.
•	src/lib/logger.js format.printf yalnızca message/stack basıyor. logger.info('request', {traceId,...}) meta bilgileri kayboluyor.
•	routes dosyalarında bazı hatalar route içinde res.status(...) ile dönüyor; bu durumda global error handler’ın traceId formatı uygulanmıyor.
•	Öneri: logger formatına kalan alanları JSON olarak ekle; route’larda err.status olsa bile next(err) ile tek yerden dön.
## 5) Doğrulama (Validation) ve İş Kuralları
•	customerService: firstName zorunlu, lastName opsiyonel; duplicate kontrolü phone/email ile yapılmış (iyi).
•	orderService: status allowlist + guestName/guestPhone zorunluluğu + guestAddress zorunluluğu (mantıklı).
•	orderService: quantity için sayı/pozitif/integer doğrulaması yok (negatif veya string gelebilir).
•	products route: POST/PUT body doğrulaması yok; SKU/price/trackStock/stockQuantity gibi alanlarda tip güvenliği yok.
•	Öneri: Basit bir schema doğrulama (Joi/Zod) veya manuel kontroller ekle; hatalarda 400 + açıklayıcı mesaj dön.

## 6) Veritabanı, Modeller ve Migration
Migration seti düzenli; ancak model/migration uyumuna dair yorumlar olumsuz izlenim yaratabilir.
•	models/customer.js ve create-customer migration içinde “birebir uyumlu değil” notu var. Ders tesliminde mümkünse uyumlu tutulmalı.
•	orders için alter + recreate migration var. Recreate yaklaşımı veri taşıma yaptığı için raporda gerekçesi açık yazılmalı.
•	Ürün fiyatı DECIMAL, order.totalAmount FLOAT. Para alanlarında FLOAT yerine DECIMAL tercih edilmeli.
•	Ürün stokQuantity allowNull belirtilmemiş; null gelirse stok düşümünde sorun olabilir. allowNull:false önerilir.
## 7) Dokümantasyon Tutarlılığı
•	docs/API.md base /api ön ekiyle uyumlu, fakat OpenAPI dosyası eksik endpoint’leri içeriyor.
•	docs/openapi.yaml: products, /orders/:id, /orders/:id/status gibi yollar eklenmeli.
•	docs/DB_SCHEMA.md: products tablosu ve alanları eklenmeli; order tablosundaki productId/quantity alanları belirtilmeli.
## 8) Test ve CI
CI var; test kapsamı ise çok sınırlı.
•	tests/app.test.js sadece health + customers list test ediyor.
•	Önerilen minimum: müşteri create + duplicate 409, guest order create (adres zorunlu), stok takipli üründe yetersiz stok 409, status patch valid/invalid.
•	Unit test (mock/stub) şartı varsa: service katmanında Product.findByPk gibi çağrıları mock’layarak 1 adet unit test eklenebilir.
## 9) Dosya Bazlı Notlar (Örnek)
•	src/config/index.js: env değerlerini okumayacak şekilde hardcode → taşınabilirlik sorunu.
•	src/lib/logger.js: meta alanları log formatında kayboluyor → traceId hedefi kaçıyor.
•	src/routes/products.js: validation yok → kötü veri DB’ye girebilir.
•	src/models/order.js: format bozuk görünüyor → prettier ile düzeltilmeli.
•	src/models/index.js: console.log ile config basılıyor → production’da kaldırılmalı.

## 10) Önceliklendirilmiş Aksiyon Listesi
P0 (teslim/puan için kritik)
•	Config’i tekleştir: src/config env’den okusun (DB_STORAGE/DB_LOGGING).
•	Logger formatını meta’yı basacak şekilde düzelt (traceId, url, ms).
•	products POST/PUT ve order quantity için validation ekle.
•	OpenAPI ve DB_SCHEMA dokümanlarını güncelle.
•	Testleri genişlet (en az 4–6 senaryo).
P1 (kalite ve sürdürülebilirlik)
•	Para alanlarında FLOAT yerine DECIMAL kullan (order.totalAmount).
•	Race-condition riskine karşı phone/email için DB-level unique index düşün (kısmi/koşullu).
•	Transaction kullanımını sequelize.transaction(async (t)=>...) pattern’i ile sadeleştir.
P2 (iyileştirme)
•	Pagination (customers/orders list) ekle.
•	OrderItems (çoklu ürün) gerekiyorsa ayrı tabloya taşı.
•	node_modules’u teslim zip’inden çıkar; README’de npm install adımı net olsun.
