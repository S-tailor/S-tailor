import React, { useRef, useState, useEffect, useMemo } from 'react'
import { CSSProperties } from 'react'
import { tryOnGenerate } from '@/api/apiTryOn'

const TryOn: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [fileImage, setFileImage] = useState<File>()
  const [fileUrl, setFileUrl] = useState<string>('')
  const [resultUrl, setResultUrl] = useState<string>('')

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileImage(file)
    if (file) {
      setFileUrl(URL.createObjectURL(file))
    }
  }

  const handleTryOnButton = async () => {
    const formData = new FormData()
    if (fileImage instanceof File) {
      formData.append('model', fileImage)
    }
    formData.append(
      'cloth',
      'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQrZOJkf9outGmhW7vnfRic8qHvuJ-ZbpQ9ucUQJAeITpd5inhVtjN7_e-acDIFNS-tWUG2IcKEctJ27M2xELGtB2RuUwSrPw6wWEngHikdk_k8SmVDje45_g&usqp=CAE'
    )
    formData.append('profilePk', '12')
    formData.append('category', 'lower_body')

    const response = await tryOnGenerate(formData)
    setResultUrl(response.data.generatedImageURL)
  }
  return (
    <>
      <h1>TryOn Component</h1>
      <button onClick={toggleCamera}>{isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}</button>
      <button onClick={handleTryOnButton}>Try On</button>
      <div>{fileUrl && <img alt="originModel" src={fileUrl} />}</div>
      <label htmlFor="imgFile">
        <input type="file" name="imgFile" id="imgFile" onChange={handleFileChange} />
      </label>

      <div>{resultUrl && <img alt="result" src={resultUrl} />}</div>
      <video autoPlay muted ref={videoRef} style={videoStyle}></video>
    </>
  )
}

export default TryOn
