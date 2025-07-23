import React, { useEffect, useRef } from 'react'

interface GoogleMapProps {
  className?: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
    openDirections: () => void
    openGoogleMaps: () => void
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  // Thông tin cửa hàng
  const storeInfo = {
    name: 'VisionCraft Eyewear',
    address: '123 Phố Huế, Quận Hai Bà Trưng, Hà Nội',
    lat: 21.014430193979996,
    lng: 105.85240731476271,
    phone: '+84 24 3xxx xxxx',
    hours: 'T2-T7: 9:00-21:00, CN: 9:00-18:00'
  }

  // Hàm mở Google Maps để chỉ đường
  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${storeInfo.lat},${storeInfo.lng}&destination_place_id=&travelmode=driving`
    window.open(url, '_blank')
  }

  // Hàm mở Google Maps tại vị trí cửa hàng
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${storeInfo.lat},${storeInfo.lng}`
    window.open(url, '_blank')
  }

  useEffect(() => {
    // Khởi tạo map khi component mount
    const initializeMap = () => {
      if (!mapRef.current || !window.google) return

      // Tọa độ cửa hàng
      const storeLocation = {
        lat: storeInfo.lat,
        lng: storeInfo.lng
      }

      // Tạo map
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 17,
        center: storeLocation,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          // Custom styling cho map đẹp hơn
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })

      // Tạo marker tùy chỉnh
      const marker = new window.google.maps.Marker({
        position: storeLocation,
        map: map,
        title: storeInfo.name,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C8.954 0 0 8.954 0 20c0 20 20 30 20 30s20-10 20-30C40 8.954 31.046 0 20 0z" fill="#EF4444"/>
              <circle cx="20" cy="20" r="12" fill="white"/>
              <circle cx="20" cy="20" r="8" fill="#EF4444"/>
              <text x="20" y="25" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">V</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 50)
        },
        animation: window.google.maps.Animation.DROP
      })

      // Tạo info window với nút chỉ đường
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 15px; font-family: 'Inter', sans-serif; max-width: 300px;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
              🔍 ${storeInfo.name}
            </h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
              📍 ${storeInfo.address}
            </p>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
              📞 ${storeInfo.phone}
            </p>
            <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">
              🕐 ${storeInfo.hours}
            </p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button 
                onclick="window.openDirections()" 
                style="
                  background: #3B82F6; 
                  color: white; 
                  border: none; 
                  padding: 8px 16px; 
                  border-radius: 6px; 
                  font-size: 14px; 
                  font-weight: 500; 
                  cursor: pointer;
                  transition: background 0.2s;
                "
                onmouseover="this.style.background='#2563EB'"
                onmouseout="this.style.background='#3B82F6'"
              >
                🧭 Chỉ đường
              </button>
              <button 
                onclick="window.openGoogleMaps()" 
                style="
                  background: #10B981; 
                  color: white; 
                  border: none; 
                  padding: 8px 16px; 
                  border-radius: 6px; 
                  font-size: 14px; 
                  font-weight: 500; 
                  cursor: pointer;
                  transition: background 0.2s;
                "
                onmouseover="this.style.background='#059669'"
                onmouseout="this.style.background='#10B981'"
              >
                📍 Xem trên Google Maps
              </button>
            </div>
          </div>
        `
      })

      // Click marker để hiện info
      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      // Hiện info window mặc định
      infoWindow.open(map, marker)

      // Thêm các hàm vào window object để có thể gọi từ HTML
      window.openDirections = openDirections
      window.openGoogleMaps = openGoogleMaps

      // Thêm event listener cho click vào map để mở Google Maps
      map.addListener('click', () => {
        openGoogleMaps()
      })

      mapInstanceRef.current = map
    }

    // Load Google Maps API nếu chưa có
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`
      script.async = true
      script.defer = true
      
      window.initMap = initializeMap
      document.head.appendChild(script)
    } else {
      initializeMap()
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className={`w-full h-full min-h-[400px] rounded-lg cursor-pointer ${className}`}
        style={{ minHeight: '400px' }}
        title="Click để mở Google Maps"
      />
      
      {/* Overlay buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={openDirections}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
        >
          🧭 Chỉ đường
        </button>
        <button
          onClick={openGoogleMaps}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
        >
          📍 Xem trên Maps
        </button>
      </div>
      
      {/* Click instruction */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
        💡 Click vào bản đồ để mở Google Maps
      </div>
    </div>
  )
}

export default GoogleMap 