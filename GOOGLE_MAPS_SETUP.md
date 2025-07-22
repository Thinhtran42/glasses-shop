# 🗺️ Hướng Dẫn Setup Google Maps API

## 📋 Tổng Quan
Hướng dẫn chi tiết cách setup Google Maps API để hiển thị bản đồ tùy chỉnh với marker đánh dấu vị trí cửa hàng.

---

## 🔑 Bước 1: Lấy Google Maps API Key

### 1.1 Truy cập Google Cloud Console
- Vào [Google Cloud Console](https://console.cloud.google.com/)
- Đăng nhập bằng tài khoản Google

### 1.2 Tạo Project Mới (nếu chưa có)
```bash
1. Click "Select a project" ở thanh header
2. Click "New Project"
3. Nhập tên project: "VisionCraft-Maps" 
4. Click "Create"
```

### 1.3 Enable Maps JavaScript API
```bash
1. Vào "APIs & Services" > "Library"
2. Search "Maps JavaScript API"
3. Click vào "Maps JavaScript API"
4. Click "Enable"
```

### 1.4 Tạo API Key
```bash
1. Vào "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy API Key được tạo
4. Click "Restrict Key" để bảo mật
```

### 1.5 Cấu Hình Bảo Mật API Key
```bash
1. Trong "API restrictions":
   - Chọn "Restrict key"
   - Tick "Maps JavaScript API"

2. Trong "Website restrictions":
   - Chọn "HTTP referrers"
   - Add: "localhost:*/*" (cho development)
   - Add: "yourdomain.com/*" (cho production)
```

---

## 🚀 Bước 2: Setup Code

### 2.1 Cập Nhật API Key
Mở file `src/components/GoogleMap.tsx` và thay đổi:

```typescript
// Dòng 95: Thay YOUR_API_KEY bằng API key thực
script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBl234XxXxXxXxXxXxXxXxXxXxXx&callback=initMap`
```

### 2.2 Kích Hoạt Component Custom Map
Mở file `src/components/Contact.tsx`:

```typescript
// Uncomment import
import GoogleMap from './GoogleMap'

// Trong JSX, comment iframe và uncomment:
{/* <iframe ... /> */}
<GoogleMap className="rounded-lg" />
```

---

## 📍 Bước 3: Tùy Chỉnh Vị Trí

### 3.1 Thay Đổi Tọa Độ Cửa Hàng
Trong `GoogleMap.tsx`, sửa tọa độ:

```typescript
const storeLocation = {
  lat: 21.014430193979996,  // Latitude của cửa hàng
  lng: 105.85240731476271   // Longitude của cửa hàng
}
```

### 3.2 Cách Lấy Tọa Độ Chính Xác
```bash
1. Vào Google Maps
2. Click chuột phải tại vị trí cửa hàng
3. Copy tọa độ đầu tiên (latitude, longitude)
```

### 3.3 Tùy Chỉnh Marker
```typescript
// Thay đổi màu marker
fill="#EF4444"  // Đỏ
fill="#3B82F6"  // Xanh dương
fill="#10B981"  // Xanh lá

// Thay đổi chữ trong marker
<text>V</text>  // VisionCraft
<text>🔍</text>  // Icon kính
```

---

## 🎨 Bước 4: Tùy Chỉnh Giao Diện

### 4.1 Thay Đổi Info Window
Trong `GoogleMap.tsx`, sửa nội dung popup:

```typescript
const infoWindow = new window.google.maps.InfoWindow({
  content: `
    <div style="padding: 15px; font-family: 'Inter', sans-serif; max-width: 300px;">
      <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 18px; font-weight: 700;">
        🔍 VisionCraft Eyewear
      </h3>
      <div style="margin-bottom: 8px;">
        <span style="color: #ef4444;">📍</span>
        <span style="color: #6b7280; font-size: 14px; margin-left: 8px;">
          123 Phố Huế, Quận Hai Bà Trưng, Hà Nội
        </span>
      </div>
      <div style="margin-bottom: 8px;">
        <span style="color: #ef4444;">📞</span>
        <a href="tel:+84243xxxxxx" style="color: #3b82f6; text-decoration: none; font-size: 14px; margin-left: 8px;">
          +84 24 3xxx xxxx
        </a>
      </div>
      <div style="margin-bottom: 8px;">
        <span style="color: #ef4444;">✉️</span>
        <a href="mailto:info@visioncraft.vn" style="color: #3b82f6; text-decoration: none; font-size: 14px; margin-left: 8px;">
          info@visioncraft.vn
        </a>
      </div>
      <div>
        <span style="color: #ef4444;">🕐</span>
        <span style="color: #6b7280; font-size: 14px; margin-left: 8px;">
          T2-T7: 9:00-21:00 | CN: 9:00-18:00
        </span>
      </div>
      <div style="margin-top: 15px; text-align: center;">
        <a href="https://maps.google.com/directions" target="_blank" 
           style="background: #ef4444; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">
          📍 Chỉ đường
        </a>
      </div>
    </div>
  `
})
```

### 4.2 Tùy Chỉnh Map Style
```typescript
styles: [
  // Ẩn các POI không cần thiết
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  // Làm đậm đường phố
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }]
  },
  // Tô màu nước
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9d6ff" }]
  }
]
```

---

## 💰 Chi Phí & Quota

### Free Tier Google Maps
- **$200 credit** mỗi tháng (đủ cho website nhỏ)
- **28,000 map loads** miễn phí/tháng
- **100,000 geocoding requests** miễn phí/tháng

### Monitoring Usage
```bash
1. Vào Google Cloud Console
2. "APIs & Services" > "Quotas"
3. Filter: "Maps JavaScript API"
4. Xem usage hiện tại
```

---

## 🔒 Bảo Mật Best Practices

### 1. Restrict API Key
```bash
✅ Chỉ enable APIs cần thiết
✅ Restrict theo domain
✅ Không commit API key vào git
```

### 2. Environment Variables
Tạo file `.env.local`:
```bash
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

Sử dụng trong code:
```typescript
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`
```

### 3. Gitignore
Thêm vào `.gitignore`:
```bash
.env.local
.env.*.local
```

---

## 🐛 Troubleshooting

### Lỗi Thường Gặp

#### 1. "This page can't load Google Maps correctly"
```bash
❌ API key sai hoặc chưa enable Maps JavaScript API
✅ Kiểm tra API key và enable API
```

#### 2. Map hiển thị nhưng bị mờ + watermark
```bash
❌ Chưa setup billing trong Google Cloud
✅ Add credit card vào Google Cloud (vẫn có $200 free)
```

#### 3. Marker không hiển thị
```bash
❌ Tọa độ sai hoặc SVG icon lỗi
✅ Kiểm tra lat, lng và SVG syntax
```

#### 4. Info Window không hiển thị
```bash
❌ HTML content bị lỗi syntax
✅ Kiểm tra quotes và escape characters
```

---

## 🎯 Demo Features Hoàn Thành

Sau khi setup xong, bạn sẽ có:

### ✨ Features
- 📍 **Custom marker** màu đỏ với chữ "V"
- 💬 **Info popup** đầy đủ thông tin cửa hàng
- 🎯 **Auto-center** và zoom level phù hợp
- 📱 **Responsive** trên mọi thiết bị
- 🎨 **Custom styling** cho map đẹp hơn
- 🔗 **Click-to-call** và **click-to-email**
- 📍 **Directions link** đến Google Maps

### 🔄 Fallback Option
Nếu có vấn đề với API, website vẫn hoạt động với iframe embed đơn giản đã có marker.

---

## 📞 Support

Nếu gặp vấn đề, check:
1. Browser Console để xem error logs
2. Google Cloud Console > APIs & Services > Quotas
3. Network tab để xem API calls

---

**🎉 Hoàn thành! Bây giờ bạn có Google Maps chuyên nghiệp với marker đánh dấu vị trí cửa hàng!** 