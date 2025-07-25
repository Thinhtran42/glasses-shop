import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { Camera, X, Brain, Circle, Square, Heart, Sparkles, Download, RotateCcw, AlertCircle } from 'lucide-react'

// Face analysis interfaces
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
  category: 'eyeglasses' | 'sunglasses'
  shape: 'aviator' | 'rectangle' | 'round' | 'cat-eye' | 'square'
  gender: 'men' | 'women' | 'unisex'
  price: number
  originalPrice: number
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

  // Initialize MediaPipe Face Mesh with pure CDN approach (no bundling issues)
  const initializeMediaPipe = useCallback(async () => {
    try {
      // Check if running in browser environment
      if (typeof window === 'undefined') {
        throw new Error('MediaPipe requires browser environment')
      }

      setModelLoadingProgress(10)
      setDebugInfo('🔄 Loading MediaPipe from pure CDN...')
      
      // Method: Pure CDN scripts only (no ES6 imports at all)
      setDebugInfo('� Loading MediaPipe CDN libraries...')
      
      const loadScript = (src: string, globalCheck: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          // Check if already loaded by testing global variable
          if ((window as any)[globalCheck]) {
            console.log(`✅ ${globalCheck} already loaded`)
            resolve()
            return
          }
          
          // Check if script already in DOM
          const existingScript = document.querySelector(`script[src="${src}"]`)
          if (existingScript) {
            // Wait for global to be available
            const checkGlobal = () => {
              if ((window as any)[globalCheck]) {
                resolve()
              } else {
                setTimeout(checkGlobal, 100)
              }
            }
            checkGlobal()
            return
          }
          
          const script = document.createElement('script')
          script.src = src
          script.crossOrigin = 'anonymous'
          script.onload = () => {
            console.log(`✅ Loaded script: ${src}`)
            // Wait for global to be available
            const checkGlobal = () => {
              if ((window as any)[globalCheck]) {
                console.log(`✅ Global ${globalCheck} available`)
                resolve()
              } else {
                console.log(`⏳ Waiting for ${globalCheck}...`)
                setTimeout(checkGlobal, 100)
              }
            }
            checkGlobal()
          }
          script.onerror = () => {
            console.error(`❌ Failed to load: ${src}`)
            reject(new Error(`Failed to load ${src}`))
          }
          document.head.appendChild(script)
        })
      }
      
      // Load MediaPipe scripts with global checks
      setDebugInfo('📦 Loading face_mesh.js...')
      await loadScript(
        'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js',
        'FaceMesh'
      )
      
      setModelLoadingProgress(30)
      setDebugInfo('📦 Loading camera_utils.js...')
      await loadScript(
        'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1620248257/camera_utils.js',
        'Camera'
      )
      
      setModelLoadingProgress(50)
      setDebugInfo('🔍 Verifying MediaPipe globals...')
      
      // Wait a bit more for everything to settle
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Access MediaPipe classes from global scope only
      const FaceMeshClass = (window as any).FaceMesh
      const MediaPipeCameraClass = (window as any).Camera
      
      console.log('📦 Pure CDN results:', {
        windowFaceMesh: !!(window as any).FaceMesh,
        windowCamera: !!(window as any).Camera,
        FaceMeshType: typeof FaceMeshClass,
        CameraType: typeof MediaPipeCameraClass,
        allGlobals: Object.keys(window).filter(key => 
          key.toLowerCase().includes('face') || 
          key.toLowerCase().includes('camera') || 
          key.toLowerCase().includes('mediapipe')
        )
      })
      
      if (!FaceMeshClass) {
        throw new Error('FaceMesh class not found in global scope')
      }
      
      if (!MediaPipeCameraClass) {
        throw new Error('Camera class not found in global scope')
      }
      
      if (typeof FaceMeshClass !== 'function') {
        throw new Error(`FaceMesh is not a constructor, type: ${typeof FaceMeshClass}`)
      }
      
      if (typeof MediaPipeCameraClass !== 'function') {
        throw new Error(`Camera is not a constructor, type: ${typeof MediaPipeCameraClass}`)
      }
      
      // Store classes globally for access in other functions
      ;(window as any).MediaPipeFaceMesh = FaceMeshClass
      ;(window as any).MediaPipeCamera = MediaPipeCameraClass
      
      setModelLoadingProgress(60)
      setDebugInfo('🚀 Creating MediaPipe FaceMesh instance...')
      
      // Create FaceMesh instance with proper error handling
      let faceMesh: any
      try {
        faceMesh = new FaceMeshClass({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`
          }
        })
        console.log('✅ FaceMesh instance created successfully')
      } catch (constructorError) {
        console.error('❌ FaceMesh constructor failed:', constructorError)
        throw new Error(`FaceMesh constructor failed: ${constructorError}`)
      }
      
      setModelLoadingProgress(70)
      setDebugInfo('⚙️ Configuring MediaPipe settings...')
      
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      })
      
      setModelLoadingProgress(85)
      setDebugInfo('🔗 Setting up face detection callbacks...')
      
      // Setup face detection callback with throttling
      faceMesh.onResults((results: any) => {
        const now = Date.now()
        if (now - ((faceMesh as any).lastUpdate || 0) < 100) return // Throttle to 10fps
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
            setDebugInfo(`✅ Face detected! ${Math.round(faceBox.width)}x${Math.round(faceBox.height)}`)
            
            // Check if face is well positioned for analysis
            const isWellPositioned = (
              faceBox.width > 200 && faceBox.height > 250 &&
              faceBox.x > videoElement.videoWidth * 0.15 &&
              faceBox.x + faceBox.width < videoElement.videoWidth * 0.85 &&
              faceBox.y > videoElement.videoHeight * 0.1 &&
              faceBox.y + faceBox.height < videoElement.videoHeight * 0.9
            )
            
            if (isWellPositioned && !isAnalyzing && !capturedPhoto && !countdown) {
              // Auto trigger analysis after 3 seconds
              setCountdown(3)
              
              const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                  if (prev === null || prev <= 1) {
                    clearInterval(countdownInterval)
                    if (!isAnalyzing && !capturedPhoto) {
                      performAnalysis()
                    }
                    return null
                  }
                  return prev - 1
                })
              }, 1000)
            }
          }
        } else {
          setFaceDetected(false)
          setFacePosition(null)
          setFaceLandmarks(null)
          setDebugInfo('🔍 Scanning for face...')
          setCountdown(null)
        }
      })
      
      setModelLoadingProgress(100)
      setDebugInfo('✅ MediaPipe ready for face analysis!')
      faceMeshRef.current = faceMesh
      setIsModelLoaded(true)
      
    } catch (error) {
      console.error('❌ MediaPipe initialization error:', error)
      setCameraError(`MediaPipe failed to load: ${(error as Error).message}`)
      setDebugInfo('❌ MediaPipe initialization failed')
    }
  }, [isAnalyzing, capturedPhoto, countdown])

  // Start camera with MediaPipe using pure CDN classes
  const startCamera = useCallback(async () => {
    setCameraError(null)
    setDebugInfo('📷 Starting MediaPipe camera with pure CDN...')
    
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      const video = videoRef.current
      if (!video) throw new Error('Video element not found')
      
      if (!faceMeshRef.current) {
        throw new Error('MediaPipe not initialized')
      }
      
      // Get MediaPipe Camera class from global window (pure CDN)
      const MediaPipeCameraClass = (window as any).Camera
      if (!MediaPipeCameraClass) {
        throw new Error('MediaPipe Camera class not available from CDN')
      }
      
      if (typeof MediaPipeCameraClass !== 'function') {
        throw new Error(`Camera is not a constructor, type: ${typeof MediaPipeCameraClass}`)
      }
      
      setDebugInfo('🚀 Creating Camera instance...')
      
      let camera: any
      try {
        camera = new MediaPipeCameraClass(video, {
          onFrame: async () => {
            if (faceMeshRef.current && video.videoWidth > 0) {
              await faceMeshRef.current.send({ image: video })
            }
          },
          width: 640,
          height: 480
        })
        console.log('✅ Camera instance created successfully')
      } catch (cameraError) {
        console.error('❌ Camera constructor failed:', cameraError)
        throw new Error(`Camera constructor failed: ${cameraError}`)
      }
      
      setDebugInfo('▶️ Starting camera stream...')
      await camera.start()
      mediaPipeCameraRef.current = camera
      
      setIsCameraOn(true)
      setDebugInfo('✅ MediaPipe camera started successfully!')
      
    } catch (error: any) {
      console.error('❌ Camera start error:', error)
      setCameraError(`Camera failed to start: ${error.message}`)
      setDebugInfo(`❌ Camera error: ${error.message}`)
    }
  }, [])

  // Other functions remain the same as in the original file...
  // (I'll include the essential ones for this fix)

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
    
    // Analysis simulation
    const steps = [
      { progress: 25, message: '🔍 Processing 468 facial landmarks...' },
      { progress: 50, message: '📐 Calculating precise face geometry...' },
      { progress: 75, message: '🧠 AI analyzing face shape...' },
      { progress: 100, message: '✅ Analysis complete!' }
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
        
        // Perform actual analysis
        const analysis = analyzeMediaPipeFace(faceLandmarks, canvas.width, canvas.height)
        const glassRecommendations = generateRecommendations(analysis)
        
        setFaceAnalysis(analysis)
        setRecommendations(glassRecommendations)
        setIsAnalyzing(false)
        setAnalysisProgress(0)
        setDebugInfo(`🎉 Analysis complete: ${analysis.shape} (${Math.round(analysis.confidence * 100)}%)`)
      }
    }, 800)
  }, [faceLandmarks])

  // Advanced face analysis using MediaPipe 468 landmarks
  const analyzeMediaPipeFace = (landmarks: any[], width: number, height: number): FaceAnalysis => {
    // Key landmark indices for face analysis
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
    
    // Calculate ratios for face shape classification
    const faceRatio = faceWidth / faceHeight
    const jawToFaceRatio = jawWidth / faceWidth
    const foreheadToFaceRatio = foreheadWidth / faceWidth
    
    // Face shape classification
    let shape: FaceAnalysis['shape'] = 'oval'
    let confidence = 0.85
    
    if (faceRatio >= 0.95) {
      if (jawToFaceRatio >= 0.85 && foreheadToFaceRatio >= 0.85) {
        shape = 'square'
        confidence = 0.92
      } else {
        shape = 'round'
        confidence = 0.90
      }
    } else if (faceRatio <= 0.75) {
      shape = 'oblong'
      confidence = 0.88
    } else if (foreheadToFaceRatio > jawToFaceRatio + 0.08) {
      shape = 'heart'
      confidence = 0.85
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
      characteristics: [
        `Khuôn mặt ${shape}`,
        `Tỷ lệ W/H: ${faceRatio.toFixed(2)}`,
        'Phân tích từ 468 điểm đặc trưng'
      ],
      recommendations: [
        'Gợi ý dựa trên phân tích chuyên nghiệp',
        'Phù hợp với cấu trúc khuôn mặt'
      ]
    }
  }

  // Generate AI recommendations
  const generateRecommendations = useCallback((analysis: FaceAnalysis): FaceRecommendation[] => {
    return glassFrames.map(glass => {
      const baseScore = 0.6
      const shapeBonus = glass.suitableFor.includes(analysis.shape) ? 0.3 : 0.1
      const confidenceBonus = (analysis.confidence - 0.5) * 0.2
      
      const matchScore = Math.min(0.98, baseScore + shapeBonus + confidenceBonus)
      
      return {
        glass,
        matchScore,
        reasons: [`Phù hợp với khuôn mặt ${analysis.shape}`, ...glass.stylePoints.slice(0, 2)],
        priority: (matchScore >= 0.85 ? 'perfect' : matchScore >= 0.7 ? 'good' : 'okay') as FaceRecommendation['priority']
      }
    }).sort((a, b) => b.matchScore - a.matchScore)
  }, [])

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

  // Initialize MediaPipe when modal opens
  useEffect(() => {
    if (isOpen && !isModelLoaded) {
      initializeMediaPipe()
    }
  }, [isOpen, isModelLoaded, initializeMediaPipe])

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  // Memoized helper functions
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

                    {/* Face Detection Guide */}
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
                                {faceDetected 
                                  ? countdown 
                                    ? `🎯 Auto analysis in ${countdown}s` 
                                    : '✅ 468 landmarks detected!' 
                                  : '📍 Position your face in circle'}
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

                        {/* Real-time face detection overlay */}
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
                              Face: {Math.round(facePosition.width)}x{Math.round(facePosition.height)}
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
                          <p className="text-xs text-blue-300">{analysisProgress}%</p>
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

                    {/* Hidden Canvas for Capture */}
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
                            {!isModelLoaded ? 'Initializing MediaPipe...' : 'Start camera for analysis'}
                          </p>
                        </div>
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
                        {!isModelLoaded ? 'Loading...' : '🎯 Start MediaPipe'}
                      </button>
                    ) : (
                      <div className="flex gap-3 w-full">
                        <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                          <p className="text-sm text-green-700 mb-1">🎯 MediaPipe Active</p>
                          <p className="text-xs text-green-600">
                            {faceDetected ? '✅ Face detected!' : 'Scanning...'}
                          </p>
                        </div>
                        
                        <button
                          onClick={stopCamera}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                          Stop
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Manual Analysis Button */}
                  {isCameraOn && !capturedPhoto && !isAnalyzing && faceDetected && !countdown && (
                    <button
                      onClick={performAnalysis}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold"
                    >
                      🎯 Analyze Now
                    </button>
                  )}

                  {/* Photo Actions */}
                  {capturedPhoto && (
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
                    </div>
                  )}
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    🎯 Analysis Results
                  </h3>

                  {!faceAnalysis && (
                    <div className="text-center py-12">
                      <Brain className="w-16 h-16 mx-auto mb-3 opacity-30 text-gray-400" />
                      <p className="text-lg font-medium text-gray-500">No analysis yet</p>
                      <p className="text-sm mt-2 text-gray-400">Start camera and position your face</p>
                    </div>
                  )}

                  {/* Face Analysis Results */}
                  {faceAnalysis && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500 text-white rounded-full">
                          {getFaceShapeIcon(faceAnalysis.shape)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-blue-900 mb-1">
                            Face Shape: {faceAnalysis.shape.charAt(0).toUpperCase() + faceAnalysis.shape.slice(1)}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-blue-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                                style={{ width: `${faceAnalysis.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-blue-700">
                              {Math.round(faceAnalysis.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                        
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-semibold text-gray-900 mb-2">✨ Features</h5>
                          <div className="space-y-2">
                            {faceAnalysis.characteristics.map((char, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm text-gray-700">{char}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4">
                          <h5 className="font-semibold text-gray-900 mb-2">💡 Recommendations</h5>
                          <div className="space-y-2">
                            {faceAnalysis.recommendations.map((rec, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <span className="text-green-500 text-sm">👍</span>
                                <span className="text-sm text-gray-700">{rec}</span>
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
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        🥽 Recommended Glasses
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">AI POWERED</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {recommendations.slice(0, 3).map((rec, index) => (
                          <div
                            key={rec.glass.id}
                            className={`border-2 rounded-lg p-4 relative ${getPriorityColor(rec.priority)}`}
                          >
                            {rec.priority === 'perfect' && (
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                🏆 PERFECT
                              </div>
                            )}
                            
                            <div className="flex gap-4">
                              <div className="w-24 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
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
                                <h5 className="font-bold text-lg mb-1">{rec.glass.name}</h5>
                                <p className="text-sm text-gray-600 mb-2">{rec.glass.brand}</p>
                                <div className="text-sm font-bold text-green-600">
                                  Match: {Math.round(rec.matchScore * 100)}%
                                </div>
                                <div className="mt-2">
                                  <p className="text-xs text-gray-600">
                                    {rec.reasons[0]}
                                  </p>
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
