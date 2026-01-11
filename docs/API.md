# Mini-CRM API Dokümantasyonu

Tüm API istekleri `/api` ön eki ile başlar.

## Müşteri Yönetimi

| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| GET | `/customers` | Tüm müşterileri listeler. |
| GET | `/customers/:id` | Belirli bir müşterinin detaylarını getirir. |
| POST | `/customers` | Yeni bir müşteri oluşturur. |
| PUT | `/customers/:id` | Müşteri bilgilerini günceller. |
| DELETE | `/customers/:id` | Müşteriyi siler. |

## Ürün ve Stok Yönetimi

| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| GET | `/products` | Tüm ürünleri listeler. |
| GET | `/products/:id` | Ürün detaylarını getirir. |
| POST | `/products` | Yeni ürün ekler. |
| PUT | `/products/:id` | Ürün bilgilerini/stok miktarını günceller. |
| DELETE | `/products/:id` | Ürünü siler. |

## Sipariş Yönetimi

| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| GET | `/orders` | Siparişleri listeler (Filtreler: `status`, `customerId`). |
| GET | `/orders/:id` | Sipariş detayını getirir. |
| POST | `/orders` | Yeni sipariş oluşturur (Stok kontrolü yapar). |
| PUT | `/orders/:id` | Siparişi günceller. |
| PATCH | `/orders/:id/status` | Sipariş durumunu günceller. |
| DELETE | `/orders/:id` | Siparişi siler. |

## Raporlar

| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| GET | `/reports/stats` | Genel istatistikleri getirir. |
| GET | `/reports/top-customers` | En çok sipariş veren müşterileri listeler. |
