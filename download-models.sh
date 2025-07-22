#!/bin/bash

# Download face-api.js models
echo "Downloading face-api.js models..."

# Create models directory
mkdir -p models

# Download TinyFaceDetector
curl -L "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/tiny_face_detector_model-weights_manifest.json" -o "tiny_face_detector_model-weights_manifest.json"
curl -L "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/tiny_face_detector_model-shard1.bin" -o "tiny_face_detector_model-shard1.bin"

# Download Face Landmark 68
curl -L "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-weights_manifest.json" -o "face_landmark_68_model-weights_manifest.json"
curl -L "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-shard1.bin" -o "face_landmark_68_model-shard1.bin"

# Download Face Recognition
curl -L "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-weights_manifest.json" -o "face_recognition_model-weights_manifest.json"
curl -L "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-shard1.bin" -o "face_recognition_model-shard1.bin"
curl -L "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-shard2.bin" -o "face_recognition_model-shard2.bin"

# Download Face Expression
curl -L "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_expression_model-weights_manifest.json" -o "face_expression_model-weights_manifest.json"
curl -L "https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_expression_model-shard1.bin" -o "face_expression_model-shard1.bin"

echo "Models downloaded successfully!"
