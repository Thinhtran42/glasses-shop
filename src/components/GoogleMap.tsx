import React, { useEffect, useRef } from 'react'

interface GoogleMapProps {
  className?: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Khởi tạo map khi component mount
    const initializeMap = () => {
      if (!mapRef.current || !window.google) return

      // Tọa độ cửa hàng VisionCraft Eyewear
      const storeLocation = {
        lat: 21.014430193979996,
        lng: 105.85240731476271
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
        title: 'VisionCraft Eyewear',
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

      // Tạo info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; font-family: 'Inter', sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
              🔍 VisionCraft Eyewear
            </h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
              📍 123 Phố Huế, Quận Hai Bà Trưng, Hà Nội
            </p>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
              📞 +84 24 3xxx xxxx
            </p>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
              🕐 T2-T7: 9:00-21:00, CN: 9:00-18:00
            </p>
          </div>
        `
      })

      // Click marker để hiện info
      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      // Hiện info window mặc định
      infoWindow.open(map, marker)

      mapInstanceRef.current = map
    }

    // Load Google Maps API nếu chưa có
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`
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
    <div 
      ref={mapRef} 
      className={`w-full h-full min-h-[400px] rounded-lg ${className}`}
      style={{ minHeight: '400px' }}
    />
  )
}

export default GoogleMap 