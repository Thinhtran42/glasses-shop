import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Brain, Camera, X, Download, AlertCircle, Circle, Square, Heart, Sparkles, Star, RotateCcw } from 'lucide-react'
// Dynamic import cho MediaPipe để tương thích với Vercel
// import { FaceMesh } from '@mediapipe/face_mesh'
// import { Camera as MediaPipeCamera } from '@mediapipe/camera_utils'

interface FaceAnalysis {
  shape: 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'oblong'
  confidence: number
  features: {
    faceWidth: number
    faceHeight: number
    jawWidth: number
    foreheadWidth: number
    cheekWidth: number
    eyeDistance: number
  }
  characteristics: string[]
  recommendations: string[]
}

interface GlassFrame {
  id: string
  name: string
  brand: string
  category: 'sunglasses' | 'eyeglasses' | 'progressive'
  shape: string
  gender: 'men' | 'women' | 'unisex'
  price: number
  originalPrice?: number
  color: string
  material: string
  features: string[]
  rating: number
  reviews: number
  isBestseller?: boolean
  isNew?: boolean
  image: string
  width: number
  height: number
  suitableFor: string[]
  stylePoints: string[]
}

interface FaceRecommendation {
  glass: GlassFrame
  matchScore: number
  reasons: string[]
  priority: 'perfect' | 'good' | 'okay'
}

const VirtualTryOn: React.FC = () => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const faceMeshRef = useRef<any>(null) // MediaPipe FaceMesh instance
  const mediaPipeCameraRef = useRef<any>(null) // MediaPipe Camera instance
  
  // States
  const [isOpen, setIsOpen] = useState(false)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysis | null>(null)
  const [recommendations, setRecommendations] = useState<FaceRecommendation[]>([])
  const [debugInfo, setDebugInfo] = useState<string>('')
  const [faceDetected, setFaceDetected] = useState(false)
  const [facePosition, setFacePosition] = useState<{x: number, y: number, width: number, height: number} | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [faceLandmarks, setFaceLandmarks] = useState<any>(null)

  // Enhanced glasses data
  const glassFrames: GlassFrame[] = [
    {
      id: '1',
      name: 'Classic Aviator Gold',
      brand: 'Ray-Ban',
      category: 'sunglasses',
      shape: 'aviator',
      gender: 'unisex',
      price: 150,
      originalPrice: 200,
      color: 'Gold',
      material: 'Metal',
      features: ['UV Protection', 'Anti-glare', 'Lightweight'],
      rating: 4.5,
      reviews: 1250,
      isBestseller: true,
      image: 'https://picsum.photos/300/200?random=1',
      width: 140,
      height: 50,
      suitableFor: ['oval', 'square', 'heart'],
      stylePoints: ['Làm mềm đường nét góc cạnh', 'Phong cách cổ điển vượt thời gian']
    },
    {
      id: '2', 
      name: 'Modern Rectangle Black',
      brand: 'Oakley',
      category: 'eyeglasses',
      shape: 'rectangle',
      gender: 'men',
      price: 120,
      originalPrice: 160,
      color: 'Black',
      material: 'Acetate',
      features: ['Blue Light Filter', 'Anti-reflection'],
      rating: 4.3,
      reviews: 890,
      isNew: true,
      image: 'https://picsum.photos/300/200?random=2',
      width: 135,
      height: 45,
      suitableFor: ['round', 'oval'],
      stylePoints: ['Tạo cấu trúc cho mặt', 'Vẻ ngoài chuyên nghiệp']
    },
    {
      id: '3',
      name: 'Cat Eye Vintage',
      brand: 'Tom Ford',
      category: 'eyeglasses',
      shape: 'cat-eye',
      gender: 'women',
      price: 180,
      originalPrice: 220,
      color: 'Tortoise',
      material: 'Acetate',
      features: ['Fashion Forward', 'Lightweight'],
      rating: 4.6,
      reviews: 650,
      image: 'https://picsum.photos/300/200?random=3',
      width: 145,
      height: 52,
      suitableFor: ['heart', 'diamond', 'oval'],
      stylePoints: ['Cân bằng trán rộng', 'Nữ tính thanh lịch']
    },
    {
      id: '4',
      name: 'Round Retro',
      brand: 'Persol',
      category: 'eyeglasses',
      shape: 'round',
      gender: 'unisex',
      price: 160,
      originalPrice: 200,
      color: 'Brown',
      material: 'Metal & Acetate',
      features: ['Vintage Style', 'High Quality'],
      rating: 4.4,
      reviews: 420,
      image: 'https://picsum.photos/300/200?random=4',
      width: 142,
      height: 48,
      suitableFor: ['square', 'oblong'],
      stylePoints: ['Làm mềm góc cạnh sắc nét', 'Phong cách trí thức']
    },
    {
      id: '5',
      name: 'Oversized Square',
      brand: 'Gucci',
      category: 'sunglasses',
      shape: 'square',
      gender: 'women',
      price: 220,
      originalPrice: 280,
      color: 'Black & Gold',
      material: 'Premium Acetate',
      features: ['Designer', 'UV Protection', 'Premium'],
      rating: 4.7,
      reviews: 890,
      isBestseller: true,
      image: 'https://picsum.photos/300/200?random=5',
      width: 148,
      height: 55,
      suitableFor: ['round', 'oval', 'heart'],
      stylePoints: ['Tạo điểm nhấn thời trang', 'Che khuyết điểm hiệu quả']
    }
  ]

  // Initialize MediaPipe Face Mesh with dynamic import for Vercel compatibility
  const initializeMediaPipe = useCallback(async () => {
    try {
      // Check if running in browser environment
      if (typeof window === 'undefined') {
        throw new Error('MediaPipe can only run in browser environment')
      }

      setModelLoadingProgress(10)
      setDebugInfo('� Loading MediaPipe modules...')
      
      // Dynamic import MediaPipe modules
      const [{ FaceMesh }, { Camera: MediaPipeCamera }] = await Promise.all([
        import('@mediapipe/face_mesh'),
        import('@mediapipe/camera_utils')
      ])
      
      setModelLoadingProgress(30)
      setDebugInfo('�🚀 Initializing Google MediaPipe...')
      
      const faceMesh = new FaceMesh({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        }
      })
      
      setModelLoadingProgress(50)
      setDebugInfo('⚙️ Configuring MediaPipe settings...')
      
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      })
      
      setModelLoadingProgress(75)
      setDebugInfo('🔗 Setting up face detection callbacks...')
      
      // Throttled onResults callback
      faceMesh.onResults((results: any) => {
        const now = Date.now()
        if (now - (faceMesh as any).lastUpdate < 100) return // Throttle updates
        ;(faceMesh as any).lastUpdate = now
        
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0]
          setFaceLandmarks(landmarks)
          
          // Calculate face bounding box from landmarks
          const xs = landmarks.map((point: any) => point.x)
          const ys = landmarks.map((point: any) => point.y)
          const minX = Math.min(...xs)
          const maxX = Math.max(...xs)
          const minY = Math.min(...ys)
          const maxY = Math.max(...ys)
          
          const videoElement = videoRef.current
          if (videoElement) {
            const faceBox = {
              x: minX * videoElement.videoWidth,
              y: minY * videoElement.videoHeight,
              width: (maxX - minX) * videoElement.videoWidth,
              height: (maxY - minY) * videoElement.videoHeight
            }
            
            setFacePosition(faceBox)
            setFaceDetected(true)
            setDebugInfo(`✅ MediaPipe: Face detected! ${Math.round(faceBox.width)}x${Math.round(faceBox.height)}`)
            
            // Check if face is well positioned
            const isWellPositioned = (
              faceBox.width > 200 && faceBox.height > 250 &&
              faceBox.x > videoElement.videoWidth * 0.15 &&
              faceBox.x + faceBox.width < videoElement.videoWidth * 0.85 &&
              faceBox.y > videoElement.videoHeight * 0.1 &&
              faceBox.y + faceBox.height < videoElement.videoHeight * 0.9
            )
            
            if (isWellPositioned && !isAnalyzing && !capturedPhoto) {
              // Auto analyze after 3 seconds
              if (!countdown) {
                // Direct call to avoid dependency issues
                if (autoTriggerTimerRef.current) {
                  clearTimeout(autoTriggerTimerRef.current)
                }
                if (countdownTimerRef.current) {
                  clearTimeout(countdownTimerRef.current)
                }
                
                setCountdown(3)
                
                autoTriggerTimerRef.current = setTimeout(() => {
                  if (performAnalysisRef.current) {
                    performAnalysisRef.current()
                  }
                }, 3000)
                
                countdownTimerRef.current = setInterval(() => {
                  setCountdown(prev => {
                    if (prev === null || prev <= 1) {
                      if (countdownTimerRef.current) {
                        clearInterval(countdownTimerRef.current)
                        countdownTimerRef.current = null
                      }
                      return null
                    }
                    return prev - 1
                  })
                }, 1000)
              }
            }
          }
        } else {
          setFaceDetected(false)
          setFacePosition(null)
          setFaceLandmarks(null)
          setDebugInfo('🔍 MediaPipe scanning for face...')
          setCountdown(null)
        }
      })
      
      setModelLoadingProgress(90)
      setDebugInfo('💾 Storing MediaPipe instances...')
      
      // Store both MediaPipe classes for later use
      faceMeshRef.current = faceMesh
      ;(faceMeshRef.current as any).MediaPipeCamera = MediaPipeCamera
      
      setModelLoadingProgress(100)
      setDebugInfo('✅ Google MediaPipe ready!')
      setIsModelLoaded(true)
      
    } catch (error) {
      console.error('❌ MediaPipe initialization error:', error)
      setCameraError(`MediaPipe initialization failed: ${(error as Error).message}`)
      setDebugInfo('❌ MediaPipe failed to load')
      
      // Additional error info for debugging
      if (error instanceof Error) {
        if (error.message.includes('FaceMesh is not a constructor')) {
          setCameraError('⚠️ MediaPipe loading issue - Please refresh the page')
          setDebugInfo('🔄 Try refreshing the page to reload MediaPipe properly')
        }
      }
    }
  }, [isAnalyzing, capturedPhoto, countdown])

  // Start camera with MediaPipe using dynamic import
  const startCamera = useCallback(async () => {
    setCameraError(null)
    setDebugInfo('📷 Starting camera with MediaPipe...')
    
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      const video = videoRef.current
      if (!video) throw new Error('Video element not found')
      
      if (!faceMeshRef.current) {
        throw new Error('MediaPipe not initialized')
      }
      
      // Get MediaPipeCamera from stored reference
      const MediaPipeCamera = (faceMeshRef.current as any).MediaPipeCamera
      if (!MediaPipeCamera) {
        throw new Error('MediaPipe Camera class not available')
      }
      
      const camera = new MediaPipeCamera(video, {
        onFrame: async () => {
          if (faceMeshRef.current && video.videoWidth > 0) {
            await faceMeshRef.current.send({ image: video })
          }
        },
        width: 640,
        height: 480
      })
      
      await camera.start()
      mediaPipeCameraRef.current = camera
      
      setIsCameraOn(true)
      setDebugInfo('✅ MediaPipe camera started!')
      
    } catch (error: any) {
      console.error('❌ Camera error:', error)
      setCameraError('Camera access failed: ' + error.message)
      setDebugInfo('❌ Camera error: ' + error.message)
    }
  }, [])

  const performAnalysisRef = useRef<(() => void) | null>(null)
  const autoTriggerTimerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null)

  // AI-powered recommendations using MediaPipe facial measurements
  const generateRecommendations = useCallback((analysis: FaceAnalysis): FaceRecommendation[] => {
    // AI-based compatibility scoring using actual facial measurements
    const calculateAICompatibility = (glass: GlassFrame, features: FaceAnalysis['features']) => {
      const faceRatio = features.faceWidth / features.faceHeight
      const jawRatio = features.jawWidth / features.faceWidth  
      const eyeRatio = features.eyeDistance / features.faceWidth
      
      // AI scoring algorithm based on facial geometry
      let aiScore = 0.5 // Base score
      
      // Glass shape compatibility with face ratios
      switch (glass.shape) {
        case 'aviator':
          // Good for wider faces, balances proportions
          if (faceRatio > 0.85) aiScore += 0.25
          if (analysis.shape === 'square' || analysis.shape === 'oblong') aiScore += 0.15
          if (features.foreheadWidth > features.jawWidth) aiScore += 0.1
          break
          
        case 'rectangle':
          // Excellent for round faces, adds structure
          if (analysis.shape === 'round') aiScore += 0.35
          if (faceRatio > 0.9) aiScore += 0.25
          if (jawRatio > 0.8) aiScore += 0.1
          break
          
        case 'round':
          // Perfect for angular faces
          if (analysis.shape === 'square') aiScore += 0.35
          if (analysis.shape === 'diamond') aiScore += 0.25
          if (jawRatio < 0.85) aiScore += 0.15
          break
          
        case 'cat-eye':
          // Ideal for heart and diamond shapes
          if (analysis.shape === 'heart') aiScore += 0.4
          if (analysis.shape === 'diamond') aiScore += 0.3
          if (features.foreheadWidth > features.jawWidth) aiScore += 0.15
          break
          
        case 'square':
          // Good for round and oval faces
          if (analysis.shape === 'round') aiScore += 0.3
          if (analysis.shape === 'oval') aiScore += 0.2
          if (faceRatio > 0.9) aiScore += 0.15
          break
          
        default:
          aiScore += 0.1 // Default compatibility
      }
      
      // Bonus for high-confidence face detection
      aiScore += (analysis.confidence - 0.5) * 0.2
      
      // Eye distance compatibility
      const optimalEyeRatio = 0.3 // Optimal eye distance ratio
      const eyeRatioScore = 1 - Math.abs(eyeRatio - optimalEyeRatio) * 2
      aiScore += eyeRatioScore * 0.1
      
      // Face width compatibility with glass width
      const widthCompatibility = Math.min(1, glass.width / features.faceWidth * 2)
      aiScore += widthCompatibility * 0.05
      
      return Math.min(0.98, Math.max(0.3, aiScore))
    }
    
    // Generate AI-powered recommendations
    const aiRecommendations = glassFrames.map(glass => {
      const aiMatchScore = calculateAICompatibility(glass, analysis.features)
      
      // AI-generated reasons based on facial analysis
      const aiReasons = []
      
      // Face shape specific reasons
      if (glass.suitableFor.includes(analysis.shape)) {
        aiReasons.push(`Phù hợp với khuôn mặt ${analysis.shape}`)
      }
      
      // Width compatibility
      const widthRatio = glass.width / analysis.features.faceWidth
      if (widthRatio > 0.4 && widthRatio < 0.6) {
        aiReasons.push('Tỷ lệ kích thước hoàn hảo')
      }
      
      // Eye distance compatibility  
      const eyeRatio = analysis.features.eyeDistance / analysis.features.faceWidth
      if (eyeRatio > 0.25 && eyeRatio < 0.35) {
        aiReasons.push('Khoảng cách mắt phù hợp')
      }
      
      // High confidence bonus
      if (analysis.confidence > 0.9) {
        aiReasons.push(`Phân tích chính xác ${Math.round(analysis.confidence * 100)}%`)
      }
      
      // Add style points (keep original style points as they're glass-specific)
      aiReasons.push(...glass.stylePoints.slice(0, 2))
      
      const recommendation: FaceRecommendation = {
        glass,
        matchScore: aiMatchScore,
        reasons: aiReasons,
        priority: (aiMatchScore >= 0.85 ? 'perfect' : aiMatchScore >= 0.7 ? 'good' : 'okay') as FaceRecommendation['priority']
      }
      
      console.log(`� [AI] ${glass.name}: Score ${aiMatchScore.toFixed(3)} (${recommendation.priority})`)
      return recommendation
    }).sort((a, b) => b.matchScore - a.matchScore)
    
    console.log('✅ [AI] Generated', aiRecommendations.length, 'AI recommendations, top match:', 
      aiRecommendations[0]?.glass.name, 'with AI score:', aiRecommendations[0]?.matchScore.toFixed(3))
    
    return aiRecommendations
  }, [])

  // Enhanced analysis using MediaPipe landmarks
  const performAnalysis = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (!video || !canvas || !faceLandmarks) {
      setCameraError('Camera or face data not ready')
      return
    }
    
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setDebugInfo('📸 Capturing with MediaPipe analysis...')
    setCountdown(null)
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setIsAnalyzing(false)
      return
    }
    
    // Capture image
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
    ctx.restore()
    
    const photoData = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedPhoto(photoData)
    
    // MediaPipe analysis steps
    const steps = [
      { progress: 25, message: '🔍 Processing 468 facial landmarks...' },
      { progress: 50, message: '📐 Calculating precise face geometry...' },
      { progress: 75, message: '🧠 AI analyzing face shape...' },
      { progress: 100, message: '✅ MediaPipe analysis complete!' }
    ]
    
    let stepIndex = 0
    const progressInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex]
        setAnalysisProgress(step.progress)
        setDebugInfo(step.message)
        stepIndex++
      } else {
        clearInterval(progressInterval)
        
        // Advanced MediaPipe face analysis
        const analysis = analyzeMediaPipeFace(faceLandmarks, canvas.width, canvas.height)
        const glassRecommendations = generateRecommendations(analysis)
        
        setFaceAnalysis(analysis)
        setRecommendations(glassRecommendations)
        setIsAnalyzing(false)
        setAnalysisProgress(0)
        setDebugInfo(`🎉 MediaPipe Analysis: ${analysis.shape} (${Math.round(analysis.confidence * 100)}% confidence) - ${glassRecommendations.length} recommendations`)
      }
    }, 800)
  }, [faceLandmarks, generateRecommendations])

  // Update ref when function changes
  useEffect(() => {
    performAnalysisRef.current = performAnalysis
  }, [performAnalysis])

  // Advanced face analysis using MediaPipe 468 landmarks
  const analyzeMediaPipeFace = (landmarks: any[], width: number, height: number): FaceAnalysis => {
    // MediaPipe key landmark indices
    const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109]
    const LEFT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
    const RIGHT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
    const LIPS = [61, 84, 17, 314, 405, 320, 307, 375, 321, 308, 324, 318]
    const CHIN = [175, 199, 175, 199, 175]
    const FOREHEAD = [9, 10, 151, 337, 299, 333, 298, 301]
    
    // Calculate precise measurements using MediaPipe landmarks
    const leftEyePoint = landmarks[33]
    const rightEyePoint = landmarks[362]
    const chinPoint = landmarks[175]
    const foreheadPoint = landmarks[9]
    const leftCheek = landmarks[234]
    const rightCheek = landmarks[454]
    const leftJaw = landmarks[172]
    const rightJaw = landmarks[397]
    
    // Convert normalized coordinates to pixel coordinates
    const eyeDistance = Math.abs(rightEyePoint.x - leftEyePoint.x) * width
    const faceHeight = Math.abs(chinPoint.y - foreheadPoint.y) * height
    const faceWidth = Math.abs(rightCheek.x - leftCheek.x) * width
    const jawWidth = Math.abs(rightJaw.x - leftJaw.x) * width
    const foreheadWidth = Math.abs(landmarks[332].x - landmarks[103].x) * width
    const cheekWidth = Math.abs(rightCheek.x - leftCheek.x) * width
    
    // Advanced ratios for precise face shape detection
    const faceRatio = faceWidth / faceHeight
    const jawToFaceRatio = jawWidth / faceWidth
    const foreheadToFaceRatio = foreheadWidth / faceWidth
    const cheekToJawRatio = cheekWidth / jawWidth
    
    console.log('📊 MediaPipe Measurements:', {
      faceRatio: faceRatio.toFixed(3),
      jawToFaceRatio: jawToFaceRatio.toFixed(3),
      foreheadToFaceRatio: foreheadToFaceRatio.toFixed(3),
      cheekToJawRatio: cheekToJawRatio.toFixed(3)
    })
    
    // Advanced shape classification using MediaPipe precision
    let shape: FaceAnalysis['shape'] = 'oval'
    let confidence = 0.85
    let characteristics: string[] = []
    let recommendations: string[] = []
    
    if (faceRatio >= 0.95) {
      if (jawToFaceRatio >= 0.85 && foreheadToFaceRatio >= 0.85) {
        shape = 'square'
        confidence = 0.92
        characteristics = [
          'Khuôn mặt vuông cân đối',
          `Tỷ lệ W/H: ${faceRatio.toFixed(2)}`,
          'Hàm và trán có chiều rộng tương đương',
          'Đường nét góc cạnh rõ nét'
        ]
        recommendations = [
          'Kính tròn làm mềm đường nét góc cạnh',
          'Kính oval cân bằng tỷ lệ khuôn mặt',
          'Tránh kính vuông làm tăng góc cạnh'
        ]
      } else {
        shape = 'round'
        confidence = 0.90
        characteristics = [
          'Khuôn mặt tròn đầy đặn',
          `Tỷ lệ W/H: ${faceRatio.toFixed(2)}`,
          'Má phồng, đường nét mềm mại',
          'Chiều rộng và cao gần bằng nhau'
        ]
        recommendations = [
          'Kính chữ nhật tạo cấu trúc cho mặt',
          'Kính vuông thêm góc cạnh',
          'Tránh kính tròn làm mặt thêm tròn'
        ]
      }
    } else if (faceRatio <= 0.75) {
      shape = 'oblong'
      confidence = 0.88
      characteristics = [
        'Khuôn mặt dài thanh tú',
        `Tỷ lệ W/H: ${faceRatio.toFixed(2)}`,
        'Chiều cao vượt trội so với chiều rộng',
        'Đặc trưng khuôn mặt dọc'
      ]
      recommendations = [
        'Kính to che nhiều diện tích mặt',
        'Kính aviator cân bằng tỷ lệ',
        'Kính gọng ngang làm mặt rộng hơn'
      ]
    } else if (foreheadToFaceRatio > jawToFaceRatio + 0.08) {
      shape = 'heart'
      confidence = 0.85
      characteristics = [
        'Khuôn mặt trái tim',
        `Tỷ lệ trán/hàm: ${(foreheadToFaceRatio/jawToFaceRatio).toFixed(2)}`,
        'Trán rộng, cằm nhọn',
        'Thu hẹp từ trán xuống cằm'
      ]
      recommendations = [
        'Kính cat-eye cân bằng trán rộng',
        'Gọng dưới nặng hơn trên',
        'Tránh kính rộng ở phần trên'
      ]
    } else if (cheekToJawRatio > 1.1 && foreheadToFaceRatio < jawToFaceRatio) {
      shape = 'diamond'
      confidence = 0.82
      characteristics = [
        'Khuôn mặt kim cương',
        `Tỷ lệ má/hàm: ${cheekToJawRatio.toFixed(2)}`,
        'Má rộng nhất, trán và hàm hẹp',
        'Đường nét góc cạnh đặc trưng'
      ]
      recommendations = [
        'Kính oval làm mềm đường nét',
        'Kính rimless tôn lên đường nét tự nhiên',
        'Tránh kính quá rộng ở má'
      ]
    } else {
      shape = 'oval'
      confidence = 0.87
      characteristics = [
        'Khuôn mặt oval cân đối',
        `Tỷ lệ W/H: ${faceRatio.toFixed(2)}`,
        'Tỷ lệ hoàn hảo giữa các bộ phận',
        'Khuôn mặt lý tưởng'
      ]
      recommendations = [
        'Bạn may mắn! Hầu hết kính đều phù hợp',
        'Có thể thử mọi phong cách',
        'Chọn theo sở thích và phong cách'
      ]
    }
    
    return {
      shape,
      confidence,
      features: {
        faceWidth: Math.round(faceWidth),
        faceHeight: Math.round(faceHeight),
        jawWidth: Math.round(jawWidth),
        foreheadWidth: Math.round(foreheadWidth),
        cheekWidth: Math.round(cheekWidth),
        eyeDistance: Math.round(eyeDistance)
      },
      characteristics,
      recommendations
    }
  }

  // Stop camera and cleanup
  const stopCamera = useCallback(() => {
    if (mediaPipeCameraRef.current) {
      mediaPipeCameraRef.current.stop()
      mediaPipeCameraRef.current = null
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsCameraOn(false)
    setCapturedPhoto(null)
    setFaceAnalysis(null)
    setRecommendations([])
    setCameraError(null)
    setDebugInfo('')
    setIsAnalyzing(false)
    setFaceDetected(false)
    setFacePosition(null)
    setFaceLandmarks(null)
    setAnalysisProgress(0)
    setCountdown(null)
  }, [])

  // Enhanced download with analysis report
  const downloadResult = useCallback(() => {
    if (!canvasRef.current || !faceAnalysis) return
    
    // Create a comprehensive analysis report canvas
    const reportCanvas = document.createElement('canvas')
    const ctx = reportCanvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size for report
    reportCanvas.width = 1200
    reportCanvas.height = 1600
    
    // White background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, reportCanvas.width, reportCanvas.height)
    
    // Draw the captured photo
    const img = new Image()
    img.onload = () => {
      // Header
      ctx.fillStyle = '#1e40af'
      ctx.fillRect(0, 0, reportCanvas.width, 120)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 32px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('🎯 MediaPipe Face Analysis Report', reportCanvas.width / 2, 50)
      
      ctx.font = '18px Arial'
      ctx.fillText(`Ngày phân tích: ${new Date().toLocaleDateString('vi-VN')}`, reportCanvas.width / 2, 90)
      
      // Draw captured photo
      const photoSize = 400
      const photoX = (reportCanvas.width - photoSize) / 2
      const photoY = 150
      
      ctx.drawImage(img, photoX, photoY, photoSize, photoSize * (img.height / img.width))
      
      // Analysis results section
      let currentY = photoY + photoSize + 50
      
      // Face shape analysis
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 28px Arial'
      ctx.textAlign = 'left'
      ctx.fillText('📊 Kết Quả Phân Tích:', 50, currentY)
      currentY += 50
      
      // Face shape with confidence
      ctx.font = 'bold 24px Arial'
      ctx.fillStyle = '#059669'
      ctx.fillText(`Khuôn mặt: ${faceAnalysis.shape.toUpperCase()}`, 80, currentY)
      currentY += 35
      
      ctx.font = '20px Arial'
      ctx.fillStyle = '#374151'
      ctx.fillText(`Độ tin cậy: ${Math.round(faceAnalysis.confidence * 100)}%`, 80, currentY)
      currentY += 50
      
      // Features section
      ctx.font = 'bold 22px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.fillText('📏 Thông Số Khuôn Mặt (MediaPipe 468 points):', 50, currentY)
      currentY += 40
      
      const features = [
        `Chiều rộng mặt: ${faceAnalysis.features.faceWidth}px`,
        `Chiều cao mặt: ${faceAnalysis.features.faceHeight}px`,
        `Chiều rộng hàm: ${faceAnalysis.features.jawWidth}px`,
        `Chiều rộng trán: ${faceAnalysis.features.foreheadWidth}px`,  
        `Khoảng cách mắt: ${faceAnalysis.features.eyeDistance}px`
      ]
      
      ctx.font = '18px Arial'
      ctx.fillStyle = '#4b5563'
      features.forEach(feature => {
        ctx.fillText(`• ${feature}`, 80, currentY)
        currentY += 30
      })
      
      currentY += 20
      
      // Characteristics section
      ctx.font = 'bold 22px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.fillText('✨ Đặc Điểm Khuôn Mặt:', 50, currentY)
      currentY += 40
      
      ctx.font = '18px Arial'
      ctx.fillStyle = '#4b5563'
      faceAnalysis.characteristics.forEach(char => {
        ctx.fillText(`• ${char}`, 80, currentY)
        currentY += 30
      })
      
      currentY += 20
      
      // Recommendations section  
      ctx.font = 'bold 22px Arial'
      ctx.fillStyle = '#1f2937'
      ctx.fillText('💡 Gợi Ý Chọn Kính:', 50, currentY)
      currentY += 40
      
      ctx.font = '18px Arial'
      ctx.fillStyle = '#059669'
      faceAnalysis.recommendations.forEach(rec => {
        ctx.fillText(`✓ ${rec}`, 80, currentY)
        currentY += 30
      })
      
      // Top glasses recommendations
      if (recommendations.length > 0) {
        currentY += 30
        ctx.font = 'bold 22px Arial'
        ctx.fillStyle = '#1f2937'
        ctx.fillText('🥽 Top Kính Được Gợi Ý:', 50, currentY)
        currentY += 40
        
        recommendations.slice(0, 3).forEach((rec, index) => {
          ctx.font = 'bold 20px Arial'
          ctx.fillStyle = rec.priority === 'perfect' ? '#059669' : rec.priority === 'good' ? '#2563eb' : '#6b7280'
          ctx.fillText(`${index + 1}. ${rec.glass.name}`, 80, currentY)
          currentY += 30
          
          ctx.font = '16px Arial'
          ctx.fillStyle = '#4b5563'
          ctx.fillText(`   ${rec.glass.brand} • Độ phù hợp: ${Math.round(rec.matchScore * 100)}%`, 80, currentY)
          currentY += 25
          
          ctx.fillText(`   ${rec.reasons[0] || 'Phù hợp với khuôn mặt của bạn'}`, 80, currentY)
          currentY += 35
        })
      }
      
      // Footer
      ctx.fillStyle = '#e5e7eb'
      ctx.fillRect(0, reportCanvas.height - 80, reportCanvas.width, 80)
      
      ctx.fillStyle = '#6b7280'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Powered by Google MediaPipe AI • 468 Facial Landmarks Analysis', reportCanvas.width / 2, reportCanvas.height - 45)
      ctx.fillText('Glasses Shop - Professional Face Analysis Service', reportCanvas.width / 2, reportCanvas.height - 20)
      
      // Download the complete report
      const link = document.createElement('a')
      link.download = `MediaPipe-Analysis-Report-${faceAnalysis.shape}-${new Date().toISOString().split('T')[0]}.jpg`
      link.href = reportCanvas.toDataURL('image/jpeg', 0.9)
      link.click()
    }
    
    img.src = canvasRef.current.toDataURL('image/jpeg', 0.9)
  }, [faceAnalysis, recommendations])

  // Initialize MediaPipe when modal opens
  useEffect(() => {
    if (isOpen && !isModelLoaded) {
      initializeMediaPipe()
    }
  }, [isOpen, isModelLoaded, initializeMediaPipe])

  // Cleanup
  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  // Memoized face shape icon to prevent re-renders
  const getFaceShapeIcon = useMemo(() => (shape: FaceAnalysis['shape']) => {
    switch (shape) {
      case 'oval': return <Circle className="w-4 h-4" />
      case 'round': return <Circle className="w-4 h-4" />
      case 'square': return <Square className="w-4 h-4" />
      case 'heart': return <Heart className="w-4 h-4" />
      case 'diamond': return <Sparkles className="w-4 h-4" />
      case 'oblong': return <Square className="w-4 h-4 rotate-90" />
    }
  }, [])

  // Memoized priority colors to prevent re-renders
  const getPriorityColor = useMemo(() => (priority: FaceRecommendation['priority']) => {
    switch (priority) {
      case 'perfect': return 'text-green-800 bg-green-100 border-green-300'
      case 'good': return 'text-blue-800 bg-blue-100 border-blue-300'
      case 'okay': return 'text-gray-800 bg-gray-100 border-gray-300'
    }
  }, [])

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group btn-primary inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Brain className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
        🎯 MediaPipe AI Analysis
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen px-2 sm:px-4 pt-16 pb-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50" 
              onClick={() => setIsOpen(false)}
              aria-label="Đóng modal"
            />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-6xl max-h-[calc(100vh-8rem)] overflow-y-auto mt-4 shadow-2xl animate-fadeIn">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-white dark:bg-gray-800 z-10 pb-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1 pr-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    🎯 Google MediaPipe Face Analysis
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Phân tích chuyên nghiệp với 468 landmark points - Công nghệ Google
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    stopCamera()
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10 flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Đóng modal"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Model Loading Progress */}
              {!isModelLoaded && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
                    <div className="flex-1">
                      <p className="text-blue-800 dark:text-blue-200 font-medium">
                        Đang khởi tạo Google MediaPipe...
                      </p>
                      <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${modelLoadingProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-blue-600 mt-1">
                        {modelLoadingProgress}% - MediaPipe Face Mesh
                      </p>
                      {modelLoadingProgress < 50 && (
                        <p className="text-xs text-blue-500 mt-1">
                          ⚡ Loading tối ưu trên Vercel - Dynamic import
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Debug Info */}
              {debugInfo && (
                <div className="mb-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-700 dark:text-blue-300 text-sm font-mono">{debugInfo}</p>
                </div>
              )}

              {/* Error Display */}
              {cameraError && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-800 dark:text-red-200">{cameraError}</p>
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Camera Section */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    📷 MediaPipe Camera
                    {isModelLoaded && (
                      <span className="text-xs sm:text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        ✓ Google AI Ready
                      </span>
                    )}
                  </h3>

                  {/* Camera Container */}
                  <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden aspect-video">
                    
                    {/* Video Stream */}
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      style={{ 
                        transform: 'scaleX(-1)',
                        display: isCameraOn && !capturedPhoto ? 'block' : 'none'
                      }}
                      playsInline
                      muted
                    />

                    {/* MediaPipe Face Detection Guide */}
                    {isCameraOn && !capturedPhoto && !isAnalyzing && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div 
                            className={`relative border-4 rounded-full transition-all duration-300 ${
                              faceDetected 
                                ? 'border-green-500 shadow-lg shadow-green-500/50' 
                                : 'border-yellow-500 border-dashed animate-pulse'
                            }`}
                            style={{
                              width: '280px',
                              height: '350px',
                              background: faceDetected 
                                ? 'rgba(34, 197, 94, 0.1)' 
                                : 'rgba(251, 191, 36, 0.1)'
                            }}
                          >
                            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                              <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                faceDetected 
                                  ? countdown 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-green-500 text-white' 
                                  : 'bg-yellow-500 text-white animate-bounce'
                              }`}>
                                {/* {faceDetected 
                                  ? countdown 
                                    ? `🎯 Auto analysis in ${countdown}s` 
                                    : '✅ 468 landmarks detected!' 
                                  : '📍 Position your face in circle'} */}
                              </div>
                              {countdown && countdown > 0 && (
                                <div className="mt-2">
                                  <div className="w-10 h-10 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-lg font-bold text-green-600">{countdown}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Real-time face detection overlay with MediaPipe precision */}
                        {faceDetected && facePosition && videoRef.current && (
                          <div 
                            className="absolute border-2 border-green-400 bg-green-400/20 rounded"
                            style={{
                              left: `${(videoRef.current.videoWidth - facePosition.x - facePosition.width) / videoRef.current.videoWidth * 100}%`,
                              top: `${facePosition.y / videoRef.current.videoHeight * 100}%`,
                              width: `${facePosition.width / videoRef.current.videoWidth * 100}%`,
                              height: `${facePosition.height / videoRef.current.videoHeight * 100}%`
                            }}
                          >
                            <div className="absolute -top-8 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              MediaPipe: {Math.round(facePosition.width)}x{Math.round(facePosition.height)}
                            </div>
                            <div className="absolute -top-8 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              468 points
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Analysis Progress */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                        <div className="text-center text-white max-w-xs">
                          <Brain className="w-16 h-16 mx-auto mb-4 animate-spin" />
                          <p className="text-lg font-semibold mb-4">MediaPipe Analyzing...</p>
                          
                          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${analysisProgress}%` }}
                            />
                          </div>
                          
                          <p className="text-sm opacity-80">{debugInfo}</p>
                          <p className="text-xs text-blue-300">{analysisProgress}% - Google AI Processing</p>
                        </div>
                      </div>
                    )}

                    {/* Captured Photo Display */}
                    {capturedPhoto && (
                      <img
                        src={capturedPhoto}
                        alt="Captured analysis"
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Hidden Canvas for Capture - Always Present */}
                    <canvas
                      ref={canvasRef}
                      className="hidden"
                      width={640}
                      height={480}
                    />

                    {/* Camera Off */}
                    {!isCameraOn && !capturedPhoto && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 mb-2">
                            {!isModelLoaded ? 'Initializing MediaPipe...' : 'Start camera for professional analysis'}
                          </p>
                          <p className="text-xs text-gray-400">
                            Powered by Google MediaPipe
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Status Indicators */}
                    {isCameraOn && !capturedPhoto && !isAnalyzing && (
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-2">
                          🎯 MediaPipe LIVE
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-lg text-xs text-white flex items-center gap-2 ${
                          faceDetected ? 'bg-green-500' : 'bg-yellow-500'
                        }`}>
                          {faceDetected ? '👤 468 Landmarks Tracked!' : '🔍 Scanning...'}
                          {faceDetected && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                        </div>
                      </div>
                    )}

                    {/* Manual Analysis Button */}
                    {isCameraOn && !capturedPhoto && !isAnalyzing && faceDetected && !countdown && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2">
                        <button
                          onClick={() => {
                            console.log('🖱️ [DEBUG] Manual analysis button clicked!')
                            performAnalysis()
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg font-bold animate-pulse"
                        >
                          🎯 Analyze with MediaPipe
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Camera Controls */}
                  <div className="flex gap-3">
                    {!isCameraOn ? (
                      <button
                        onClick={startCamera}
                        disabled={!isModelLoaded}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Camera size={20} />
                        {!isModelLoaded ? 'Loading MediaPipe...' : '🎯 Start MediaPipe Camera'}
                      </button>
                    ) : (
                      <div className="flex gap-3 w-full">
                        <div className="flex-1 bg-green-50 dark:bg-green-900/30 border border-green-200 rounded-lg p-3 text-center">
                          <p className="text-sm text-green-700 dark:text-green-300 mb-1">
                            🎯 MediaPipe Active
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {faceDetected 
                              ? countdown 
                                ? `Auto analysis in ${countdown}s...` 
                                : '✅ 468 facial landmarks detected!' 
                              : 'Scanning for face...'}
                          </p>
                        </div>
                        
                        <button
                          onClick={stopCamera}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          🛑 Stop
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Photo Actions */}
                  {capturedPhoto && faceAnalysis && (
                    <div className="space-y-3">
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          <strong>Báo cáo hoàn chỉnh:</strong> Ảnh + Kết quả phân tích + Top gợi ý kính phù hợp
                        </p>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setCapturedPhoto(null)
                            setFaceAnalysis(null)
                            setRecommendations([])
                            startCamera()
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                          <RotateCcw size={20} />
                          Analyze Again
                        </button>
                        <button
                          onClick={downloadResult}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                          title="Download báo cáo phân tích đầy đủ bao gồm ảnh, kết quả phân tích và gợi ý kính"
                        >
                          <Download size={20} />
                          📊 Download Báo Cáo
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      🎯 Kết quả phân tích khuôn mặt
                    </h3>
                    {faceAnalysis && recommendations.length === 0 && (
                      <button
                        onClick={() => {
                          console.log('🔄 Force generating recommendations...')
                          const newRecs = generateRecommendations(faceAnalysis)
                          setRecommendations(newRecs)
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm px-3 py-1 rounded"
                      >
                        🔄 Tạo gợi ý
                      </button>
                    )}
                  </div>

                  {/* Show placeholder when no results */}
                  {!faceAnalysis && !recommendations.length && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 dark:text-gray-500 mb-4">
                        <Brain className="w-16 h-16 mx-auto mb-3 opacity-30" />
                        <p className="text-lg font-medium">Chưa có kết quả phân tích</p>
                        <p className="text-sm mt-2">Bắt đầu camera và đặt mặt vào vùng hướng dẫn để phân tích chuyên nghiệp</p>
                        <p className="text-xs mt-1 text-blue-400">Phân tích với độ chính xác cao từ 468 điểm đặc trưng</p>
                      </div>
                    </div>
                  )}

                  {/* Debug Info for Troubleshooting */}
                  {faceAnalysis && recommendations.length === 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                            Analysis completed but no recommendations generated
                          </p>
                          <p className="text-yellow-600 text-sm">
                            Face shape: {faceAnalysis.shape}, Confidence: {Math.round(faceAnalysis.confidence * 100)}%
                          </p>
                          <p className="text-yellow-600 text-xs">
                            Check console for detailed logs
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Face Analysis Results */}
                  {faceAnalysis && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500 text-white rounded-full">
                          {getFaceShapeIcon(faceAnalysis.shape)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                            Face Shape: {faceAnalysis.shape.charAt(0).toUpperCase() + faceAnalysis.shape.slice(1)}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-blue-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${faceAnalysis.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-blue-700">
                              {Math.round(faceAnalysis.confidence * 100)}% confidence
                            </span>
                          </div>
                          <p className="text-xs text-blue-600 mt-1">MediaPipe 468-point analysis</p>
                        </div>
                      </div>
                        
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            ✨ MediaPipe Features
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">PRECISION</span>
                          </h5>
                          <div className="space-y-2">
                            {faceAnalysis.characteristics.map((char, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{char}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                            <p className="font-semibold text-blue-800">Precise Measurements:</p>
                            <div className="grid grid-cols-2 gap-1 mt-1">
                              <span>Width: {faceAnalysis.features.faceWidth}px</span>
                              <span>Height: {faceAnalysis.features.faceHeight}px</span>
                              <span>Jaw: {faceAnalysis.features.jawWidth}px</span>
                              <span>Eyes: {faceAnalysis.features.eyeDistance}px</span>
                            </div>
                          </div> */}
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">💡 AI Recommendations</h5>
                          <div className="space-y-2">
                            {faceAnalysis.recommendations.map((rec, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <span className="text-green-500 text-sm">👍</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Glasses Recommendations */}
                  {recommendations.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        🥽 Gợi ý kính phù hợp
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">AI POWERED</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {recommendations.map((rec, index) => (
                          <div
                            key={rec.glass.id}
                            className={`border-2 rounded-lg p-4 relative ${getPriorityColor(rec.priority)}`}
                          >
                            {rec.priority === 'perfect' && (
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                🏆 HOÀN HẢO
                              </div>
                            )}
                            
                            <div className="flex gap-4">
                              <div className="w-24 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0 border">
                                <img
                                  src={rec.glass.image}
                                  alt={rec.glass.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://via.placeholder.com/200x150/4F46E5/FFFFFF?text=${encodeURIComponent(rec.glass.name)}`;
                                  }}
                                />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h5 className="font-medium text-gray-900 dark:text-gray-100">{rec.glass.name}</h5>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{rec.glass.brand} • {rec.glass.material}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      {rec.glass.isBestseller && (
                                        <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded font-medium">BESTSELLER</span>
                                      )}
                                      {rec.glass.isNew && (
                                        <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded font-medium">NEW</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 mb-1">
                                      <Star className="w-3 h-3 fill-current text-yellow-500" />
                                      <span className="text-sm text-gray-900 dark:text-gray-100">{rec.glass.rating}</span>
                                      <span className="text-xs text-gray-600 dark:text-gray-400">({rec.glass.reviews})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${rec.glass.price}</span>
                                      {rec.glass.originalPrice && (
                                        <span className="text-sm text-gray-500 line-through">${rec.glass.originalPrice}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="mb-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Độ phù hợp:</span>
                                    <div className="flex-1 bg-gray-300 rounded-full h-2">
                                      <div 
                                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                                        style={{ width: `${rec.matchScore * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-bold text-green-700 dark:text-green-400">{Math.round(rec.matchScore * 100)}%</span>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Tại sao được gợi ý:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {rec.reasons.slice(0, 3).map((reason, reasonIndex) => (
                                      <span key={reasonIndex} className="text-xs bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded border border-gray-300">
                                        {reason}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="mt-3 flex gap-2">
                                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded">
                                    Thử kính ảo
                                  </button>
                                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded">
                                    Thêm vào giỏ
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default VirtualTryOn
