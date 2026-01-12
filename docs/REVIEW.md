# Mini-CRM Projesi – Kod İnceleme Raporu

**Kod İncelemeyi Yapan:**  
MOHAMMED ABDULRAHMAN ABDO ABDULLAH AL-HAMIDI  

**Öğrenci No:** 245112073  

---

## 1️ Projenin Genel Görünümü

- Müşteri, sipariş ve ürün yönetimi sağlamaktadır  
- ORM olarak Sequelize kullanılmıştır (model ve migration yönetimi)  
- Excel dosyalarından veri aktarımı için xlsx kütüphanesi kullanılmıştır  
- Swagger UI (/api-docs) ile API dokümantasyonu mevcuttur  
- Winston ve Trace-ID ile loglama ve izlenebilirlik sağlanmıştır  
- Geliştirme ortamında SQLite, üretim ortamında PostgreSQL uyumluluğu hedeflenmiştir  

---

## 2️- güçlü Noktaları

- Katmanlı mimari uygulanmıştır (routes → services → models)  
- Telefon normalizasyonu ve mükerrer kayıt kontrolü yapılmaktadır  
- Müşteri kaydı olmadan misafir sipariş (guestName / guestPhone) oluşturulabilmektedir  
- Kirli Excel verisini temizleyip veritabanına aktaran ETL scripti bulunmaktadır  
  - `src/scripts/etl.js`  
- Raporlama servisi ile toplam ciro ve müşteri bazlı istatistikler üretilebilmektedir  
- Winston + Trace-ID sayesinde istek bazlı log takibi yapılabilmektedir  
- Swagger UI ve `docs/` klasörü altında mimari, DB şeması ve API açıklamaları yer almaktadır  
- Jest ve Supertest kullanılarak temel endpoint testleri yazılmıştır  
- npm script’leri (dev, start, test) tanımlanmış olup CI/CD’ye uygundur  

---

## 3️- Geliştirilmesi Gereken / Eksik Yönler

- Test kapsamı sınırlıdır, sadece temel endpoint’ler test edilmiştir  
- CI pipeline (GitHub Actions / GitLab CI) yapılandırması bulunmamaktadır
- Input validation ve güvenlik mekanizmaları geliştirilmelidir 
---

## 4️- Öneriler / Yol Haritası

- express-validator ile schema tabanlı input validation uygulanmalı  
- CI/CD için GitHub Actions üzerinde lint, test ve build adımları tanımlanmalı  
- Service katmanı için unit testler ve edge-case senaryoları eklenmeli  
- Sequelize eager loading, pagination ve indeksleme ile performans iyileştirilmeli  

---

## Sonuç

Proje genel olarak beklenen gereksinimleri karşılamaktadır.  
Bazı alanlarda (test kapsamı, CI/CD ve güvenlik) geliştirme yapılabilir.  
Bu eksikler giderildiğinde proje daha düzenli ve kullanışlı hale gelecektir.

---------------------------------------------------------------------------------------

## Code Review
Hazırlayan : Burak ÜNAL öğr No:245172017


PROJE ÖZETİ
Bu proje Node.js tabanlı, müşteri ve sipariş yönetimi yapan bir Mini CRM uygulamasıdır.
REST API mimarisi kullanılmıştır.

GÜÇLÜ YÖNLER
1. Modüler klasör yapısı (src, tests, docs, migrations)
2. README dosyasının bulunması
3. Migration kullanımı
4. Test klasörü oluşturulmuş olması
5. API dokümantasyonu için altyapı bulunması

ZAYIF YÖNLER
1. README detay seviyesi yetersiz
2. API endpoint örnekleri eksik
3. Test kapsamı düşük
4. Merkezi hata yönetimi eksik
5. Veri doğrulama (validation) eksik
6. Kimlik doğrulama (Auth) bulunmuyor

EKSİKLER
- .env.example dosyası
- Request/Response örnekleri
- Otomatik test çalıştıran CI yapılandırması
- Güvenlik önlemleri (JWT, role-based access)

İYİLEŞTİRME ÖNERİLERİ
- Joi veya Zod ile validation eklenmeli
- JWT tabanlı authentication eklenmeli
- GitHub Actions ile test + lint pipeline kurulmalı
- Error handling standardize edilmeli
- ESLint ve Prettier kullanılmalı

GENEL DEĞERLENDİRME
Bu proje eğitim amaçlı güçlü bir başlangıçtır.
Eksikler tamamlandığında gerçek hayatta kullanılabilir bir CRM API haline gelebilir.



## Güncelleme

Github action ve dosyaları eklenmiştir. Kapsamlı testler yapılmıştır.  -Salih Kızılkaya
