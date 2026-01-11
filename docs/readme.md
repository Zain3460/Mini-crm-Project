# Mini-CRM Mimari Tasarım ve Teknik Dokümantasyon

## 1. Genel Bakış
Bu proje, manuel yürütülen müşteri ve sipariş süreçlerini dijitalleştirmek amacıyla geliştirilmiş bir **Mini-CRM** sistemidir. Sistem, yarım kalmış bir projeden devralınarak hocanın ve müşterinin özel talepleri doğrultusunda tamamlanmıştır.

## 2. Teknoloji Yığını
- **Backend:** Node.js + Express.js
- **ORM:** Sequelize (Veritabanı soyutlama ve migration yönetimi)
- **Veritabanı:** SQLite (Geliştirme kolaylığı için), PostgreSQL uyumlu yapı.
- **Veri İşleme:** XLSX (Excel verilerini işlemek için)
- **Dokümantasyon:** Swagger (OpenAPI 3.0)
- **Loglama:** Winston (Trace ID destekli yapılandırılmış loglama)

## 3. Mimari Katmanlar (Layered Architecture)
Proje, sorumlulukların ayrılması prensibine (Separation of Concerns) uygun olarak katmanlı bir yapıda tasarlanmıştır:

- **Route Katmanı (`src/routes/`):** HTTP isteklerini karşılar, parametreleri doğrular ve ilgili servise yönlendirir.
- **Servis Katmanı (`src/services/`):** İş mantığının (Business Logic) bulunduğu ana katmandır. Duplicate kontrolü, veri normalizasyonu ve raporlama hesaplamaları burada yapılır.
- **Model Katmanı (`src/models/`):** Veritabanı şemalarını ve tablolar arası ilişkileri tanımlar.
- **Script Katmanı (`src/scripts/`):** ETL (Extract, Transform, Load) ve veri tohumlama (Seeding) gibi tek seferlik veya periyodik görevleri yürütür.

## 4. Tasarım Kararları ve Çözümler

### 4.1. Müşteri Yönetimi ve Esneklik
- **Soyadı Olmayan Müşteriler:** Müşteri talebi doğrultusunda `lastName` alanı opsiyonel bırakılmıştır.
- **Duplicate (Mükerrer) Kayıt Engelleme:** 
    - Birincil kontrol: Telefon numarası.
    - İkincil kontrol: E-posta adresi.
    - Üçüncül kontrol: İsim ve Soyisim kombinasyonu.
- **Telefon Normalizasyonu:** Kullanıcıların farklı formatlarda girdiği telefon numaraları (örn: 0532..., +90532..., 532...) otomatik olarak `+90XXXXXXXXXX` formatına dönüştürülür.

### 4.2. Sipariş Yönetimi
- **Misafir Siparişi (Guest Checkout):** Müşteri sistemde kayıtlı olmasa bile `guestName` ve `guestPhone` bilgileriyle sipariş oluşturulabilmesi sağlanmıştır.
- **Stok ve Durum Yönetimi:** Siparişler `PENDING`, `PREPARING`, `SHIPPED`, `DELIVERED`, `CANCELLED` durumları üzerinden takip edilir.

### 4.3. ETL (Veri Geçişi) Süreci
Müşterinin sağladığı kirli Excel verisi için özel bir ETL scripti (`src/scripts/etl.js`) yazılmıştır:
- **Temizleme:** İsimlerdeki tırnak işaretleri ve gereksiz boşluklar temizlenir.
- **Dönüştürme:** Ad-Soyad ayrımı akıllıca yapılır (son kelime soyad kabul edilir).
- **Raporlama:** Hatalı veya mükerrer kayıtlar veritabanına alınmaz, ancak bir JSON raporunda (`data/etl_report.json`) listelenir.

## 5. Raporlama ve Analiz
Yeni eklenen `reportService`, işletme sahiplerinin sistemdeki verileri anlamlandırmasını sağlar:
- **Genel İstatistikler:** Toplam ciro, müşteri sayısı ve sipariş durum dağılımı.
- **Müşteri Analizi:** En çok harcama yapan "Sadık Müşteriler" listesi.

## 6. Güvenlik ve İzlenebilirlik
- **Trace ID:** Her isteğe benzersiz bir ID atanır ve tüm loglar bu ID ile ilişkilendirilir. Bu sayede bir hatanın izi tüm katmanlarda sürülebilir.
- **Hata Yönetimi:** Merkezi bir error handler ile tüm hatalar standart bir formatta kullanıcıya dönerken, detaylar güvenli bir şekilde loglanır.
