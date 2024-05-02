import React, { useRef, useState } from 'react'

type CameraMode = 'user' | 'environment'

const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [camera, setCamera] = useState<CameraMode>('environment')

  const CameraClick = () => {
    const constraints = { video: { facingMode: camera } }
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
        }
      })
      .catch((error) => {
        console.error('카메라 접근 오류:', error)
      })
  }

  const handleCapture = () => {
    const canvas = document.createElement('canvas')
    const video = videoRef.current
    if (video && video.videoWidth > 0) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            console.log(url) // 로그로 URL을 찍어 확인
            const img = document.createElement('img')
            img.onload = () => {
              URL.revokeObjectURL(url)
            }
            img.src = url
            document.body.appendChild(img)
          }
        })
      }
    }
  }

  const toggleCamera = () => {
    setCamera((prevCamera) => (prevCamera === 'environment' ? 'user' : 'environment'))
    const video = videoRef.current
    if (video && video.srcObject) {
      const tracks = (video.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    CameraClick()
  }

  return (
    <div>
      <button onClick={CameraClick}>카메라 켜기</button>
      <button onClick={handleCapture}>사진 촬영</button>
      <button onClick={toggleCamera}>카메라 전환</button>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }}></video>
    </div>
  )
}

export default Camera
