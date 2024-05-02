import React from 'react'


const TryOnCode: React.FC = () => {

const code = 123456


  return (
    <>
    {<div>
      <h3>가상 피팅</h3>
      <p>1. 스마트폰으로 오른쪽 QR코드를 스캔해 S-Tailor 앱을 여십시오. </p>
      <img src="/src/assets/qrCode.png" alt="qr" style={{width:'100px'}} />
      <p>2. 로그인 후 '옷 입어보기'를 선택하십시오.</p>
      <p>3. 아래 코드를 스마트폰에 입력하십시오.</p>
      <div>
        {code}
      </div>
      <br />
      <button>완료</button>
    </div>}

   
    </>
  )
}

export default TryOnCode
