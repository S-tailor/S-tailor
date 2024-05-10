import React, { useRef, useState, useEffect, useMemo } from 'react'
import { CSSProperties } from 'react'
const TryOn: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = isCameraOn ? stream : null
        }
      } catch (error) {
        console.error(error)
      }
    }
    initCamera()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [isCameraOn])

  const toggleCamera = () => {
    setIsCameraOn((prevState) => !prevState)
  }

  const videoStyle: CSSProperties = useMemo(
    () => ({
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
      transform: 'scaleX(-1)'
    }),
    []
  )

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh'
  }

  const buttonStyle: CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 10,
    width: '500px',
    height: '250px',
    fontSize: '100px'
  }

  return (
    <div style={containerStyle}>
      <button onClick={toggleCamera} style={buttonStyle}>
        {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
      <video autoPlay ref={videoRef} style={videoStyle}></video>
    </div>
  )
}

export default TryOn
