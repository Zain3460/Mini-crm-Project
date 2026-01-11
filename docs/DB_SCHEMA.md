# Veritabanı Şeması

## Tablolar

### 1. Customers (Müşteriler)
| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | INTEGER | Primary Key |
| firstName | STRING | Ad |
| lastName | STRING | Soyad (Opsiyonel) |
| phone | STRING | Telefon (Normalize edilmiş) |
| email | STRING | E-posta |
| address | TEXT | Adres |
| isActive | BOOLEAN | Aktiflik durumu |

### 2. Products (Ürünler)
| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | INTEGER | Primary Key |
| name | STRING | Ürün adı |
| sku | STRING | Stok kodu (Unique) |
| price | DECIMAL | Birim fiyat |
| stockQuantity | INTEGER | Mevcut stok miktarı |
| trackStock | BOOLEAN | Stok takibi yapılsın mı? |
| unit | STRING | Birim (adet, kg vb.) |

### 3. ProductPrices (Ürün Fiyatları)
| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | INTEGER | Primary Key |
| product_id | INTEGER | Ürün ID (Foreign Key) |
| price_type | STRING | Fiyat türü (RETAIL, WHOLESALE vb.) |
| price | DECIMAL | Fiyat |
| currency | STRING | Para birimi |

### 4. Orders (Siparişler)
| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | INTEGER | Primary Key |
| customer_id | INTEGER | Müşteri ID (Opsiyonel) |
| guest_name | STRING | Misafir adı |
| guest_phone | STRING | Misafir telefonu |
| guest_address | STRING | Misafir adresi |
| status | STRING | Durum (PENDING, SHIPPED vb.) |
| total_amount | DECIMAL | Toplam tutar |

### 5. OrderItems (Sipariş Kalemleri)
| Kolon | Tip | Açıklama |
|-------|-----|----------|
| id | INTEGER | Primary Key |
| order_id | INTEGER | Sipariş ID (Foreign Key) |
| product_id | INTEGER | Ürün ID (Foreign Key) |
| quantity | INTEGER | Miktar |
| unit_price | DECIMAL | Birim fiyat |
| total_price | DECIMAL | Satır toplamı |
