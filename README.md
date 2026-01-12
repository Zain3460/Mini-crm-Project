# Mini-CRM Projesi

Bu proje, müşteri ve sipariş yönetimini kolaylaştırmak için geliştirilmiş bir REST API sistemidir.

## 🚀 Kurulum Rehberi

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn

### Adımlar
1. Proje dizinine gidin:
   ```bash
   cd mini-crm
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Ortam değişkenlerini ayarlayın:
   ```bash
   cp .env.example .env
   ```
4. Veritabanını hazırlayın (Migration):
   ```bash
   npm run migrate
   ```
5. (Opsiyonel) Mevcut Excel verilerini içeri aktarın (ETL):
   ```bash
   node src/scripts/etl.js
   ```
6. Uygulamayı başlatın:
   ```bash
   npm start
   ```

## 📖 Kullanıcı Kılavuzu

### API Dokümantasyonu
Uygulama çalışırken tarayıcınızdan aşağıdaki adrese giderek tüm API uçlarını görsel olarak inceleyebilir ve test edebilirsiniz:
👉 `http://localhost:3000/api-docs`

### Temel Özellikler
- **Müşteri Yönetimi:** Müşteri ekleme, güncelleme ve silme. Eksik soyadı veya hatalı telefon formatları sistem tarafından otomatik yönetilir.
- **Sipariş Yönetimi:** Kayıtlı müşteriler veya misafir kullanıcılar için sipariş oluşturma.
- **Raporlama:** İşletme performansını takip etmek için istatistik ve "En İyi Müşteriler" raporları.
- **Veri Aktarımı:** `data/customers.xlsx` dosyasındaki verileri tek komutla sisteme aktarma.

### Önemli Komutlar
- `npm start`: Uygulamayı başlatır.
- `npm run dev`: Geliştirici modunda (nodemon ile) başlatır.
- `npm test`: Testleri çalıştırır.
- `node src/scripts/etl.js`: Excel'den veri aktarımı yapar.
- `node src/scripts/seed_orders.js`: Test için örnek sipariş verileri oluşturur.

## 🛠 Teknik Detaylar
Mimari kararlar, veritabanı şeması ve tasarım detayları için `docs/` klasöründeki dokümanları inceleyebilirsiniz:
- [Mimari ve Tasarım Kararları](docs/readme.md)
- [Veritabanı Şeması](docs/DB_SCHEMA.md)
- [API Detayları](docs/API.md)

**Code Review Yapan:**  
- MOHAMMED ABDULRAHMAN ABDO ABDULLAH AL-HAMIDI (245112073)
- Burak Ünal (245172017)
👉 [Code Review Raporu](docs/REVIEW.md)

