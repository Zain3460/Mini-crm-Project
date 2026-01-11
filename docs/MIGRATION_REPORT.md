# Migration Raporu

Bu rapor, veritabanı şemasındaki değişiklikleri ve migration stratejisini açıklar.

## Yapılan Değişiklikler
1. **Ürün ve Stok Yapısı:** `products` tablosu oluşturuldu.
2. **Çoklu Fiyat Desteği:** `product_prices` tablosu eklendi.
3. **Sipariş Kalemleri:** `order_items` tablosu oluşturularak bir siparişte birden fazla ürün bulunabilmesi sağlandı.
4. **Misafir Siparişleri:** `orders` tablosuna misafir bilgileri (ad, telefon, adres) eklendi.

## "Recreate Orders" Migration Hakkında
`20260104113000-recreate-orders-for-guest.js` migration dosyası, SQLite'ın sınırlı `ALTER TABLE` desteği nedeniyle bazı kolonların eklenmesi/değiştirilmesi için tabloyu yeniden oluşturmaktadır. 

**Veri Güvenliği:**
- İşlem öncesinde mevcut veriler geçici bir tabloya alınmıştır.
- Tablo yeniden oluşturulduktan sonra veriler yeni şemaya uygun şekilde geri yüklenmiştir.
- Bu işlem sırasında herhangi bir veri kaybı yaşanmaması için transaction kullanılmıştır.

## Migration Listesi
- `20240101000000-create-customer.js`: Temel müşteri tablosu.
- `20240102000000-create-order.js`: Temel sipariş tablosu.
- `20260109000000-create-products.js`: Ürün tablosu ve sipariş ilişkisi.
- `20260109100000-create-order-items.js`: Sipariş kalemleri tablosu.
- `20260109110000-create-product-prices.js`: Çoklu fiyat tablosu.
