import React,{ startTransition, useEffect,useState,useRef }  from 'react'
import { useNavigate } from 'react-router-dom'

const ClosetCodeInput: React.FC = () => {
  const navigate = useNavigate()
  const inputsRef = Array(6).fill(0).map(() => useRef<HTMLInputElement>(null));
  const [code, setCode] = useState(Array(6).fill(''));
  const [confirmCode, setConfirmCode] = useState('')
  const token = localStorage.getItem('accessToken')
  useEffect(()=>{
    if (code.length > 5){
      const res = (code.join(''))
      setConfirmCode(res)
      confirmCode
    }
  },[code])

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = [...code];
    newCode[index] = event.target.value;
    setCode(newCode);

    if (index < 5) {
      inputsRef[index + 1].current?.focus();
    }
  };

  return (
    <>
    <div>
      <img src="" alt="back" onClick={() => startTransition(() => { navigate('/mobile/closet'); })} />
      <header>
        <h3>옷 입어보기</h3>
      </header>
      <h1>인증코드 입력</h1>
      <p>기기에 표시된 6자리 번호를 입력해주세요.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {code.map((_, idx) => (
          <input
          key={idx}
          ref={inputsRef[idx]}
          type="text"
          maxLength={1}
          style={{ width: '40px', textAlign: 'center', fontSize: '16px' }}
          value={code[idx]}
          onChange={(e) => handleChange(idx, e)}
          />
        ))}
      </div>
      <button onClick={() => {
        startTransition(() => {
          navigate('/mobile/closet/tryon/wait')
          localStorage.removeItem('phase')
        });
      }}>완료</button>
    </div>

    {!token && <div style={{
      position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: 'white', padding: '20px', zIndex: 1000, width: '100%', maxWidth: '600px', height:'200px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2>로그인 필요</h2>
      <p>서비스를 이용하기 위해서는 로그인이 필요합니다.</p>
      <button onClick={()=>{startTransition(()=>{
        navigate('/mobile/start')
        localStorage.setItem('phase','2')
      })}}>로그인하러 가기</button>
     
    </div>}
      </>
  )
}

export default ClosetCodeInput
