import React, { startTransition, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { QrReader } from 'react-qr-reader'

const BASE_URL = 'https://ourtrip.store/api/tryon'
// const BASE_URL = 'http://localhost:5000/api/tryon'
const [camera, setCamera] = useState(true)


const ClosetCodeInput: React.FC = () => {
  
  const navigate = useNavigate()
  const [data, setData] = useState("");
  const [message, setMessage] = useState('코드 인식이 완료되었습니다. 확인버튼을 눌러주세요.')


  const handleVerify = async (event:React.SyntheticEvent) => {
    event.preventDefault();
    if (data) {
      const result = data.replace(/"/g, "");
    
      const params = {
        profilePk: sessionStorage.getItem('profilePk'),
        id: localStorage.getItem('id'),
        token: localStorage.getItem('accessToken'),
        sessionId: result
      }
     
      await axios
      .post(`${BASE_URL}/verify`, params)
      .then(function (response) {
        if (response.data == 'success') {
          setCamera(false)
          navigate('/mobile/closet/tryon/wait')
          
         
        }
        
      })
      .catch(function (error) {
        setMessage('다시 시도해주세요.')
        console.log('error', error)
      })
    }
    setMessage('')
  }



  return (
    <div>
      <img
        src=""
        alt="back"
        onClick={() =>
          startTransition(() => {
            navigate('/mobile/closet')
          })
        }
      />
      <header>
        <h3>옷 입어보기</h3>
      </header>

      <h1>QR코드 인증</h1>
      <p>기기에 표시된 QR코드를 촬영해주세요.</p>
      <div>
        { camera &&
      <QrReader
        constraints={{ facingMode: 'environment' }}
        onResult={(result: any | null, error) => {
          if (result) {
            setData(result.text);
          }
          if (error) {
            console.info(error);
          }
        }}
        />
      }</div>



      {data &&
        <div>
          
          {message}
        </div>}
        
      <button onClick={handleVerify}>확인</button>
        <form onSubmit={handleVerify}>
        <input
          type="text"
          value={data}
          onChange={(event) => {
            setData(event.target.value)
          }}
        ></input>
        <button type="submit">sessionId 보내기</button>
      </form>
    </div>
  )
}

export default ClosetCodeInput
