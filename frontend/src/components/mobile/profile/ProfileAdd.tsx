import React,{ startTransition,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { profileCreate } from '@/api/apiProfile'
import userStore from '@/store/store'

const ProfileAdd: React.FC = () => {
  const [page1, setPage1] = useState(true)
  const [page2, setPage2] = useState(false)
  const [page3, setPage3] = useState(false)
  const [page4, setPage4] = useState(false)
  const [message, setmessage] = useState('')
  const [file, setFile] = useState<File>();
  const [name, setName] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [height, setHeight] = useState<string>("")
  const [weight, setWeight] = useState<string>("")
  const [fileUrl, setFileUrl] = useState<string>("")
 const {setUser} = userStore()
 interface userProfile {
  profileName: string;
  profilePk: number;
}
  const formData = new FormData()
  const navigate = useNavigate()
  const goBack = () => {
    startTransition(() => {
    navigate('/mobile/profile')
    })
  }

  // 입력단계바꾸기
  const toGender = () => {
    if (name.trim() !== "") {
      
      setmessage('')
      setPage1(false);
      setPage2(true);

    } else {
      setmessage('입력을 완료해주세요')
    }
  };

  const toHeight = () => {
    if (gender !== "") {
      
      setmessage('')
      setPage2(false);
      setPage3(true);
    } else {
      setmessage('입력을 완료해주세요')
    }
  };

  const toWeight = () => {
    if (height !== "") {
      
      setmessage('')
      setPage3(false);
      setPage4(true);
    } else {
      setmessage('입력을 완료해주세요')
    }
  };

  const complete = async () => {
    const userPk = String(localStorage.getItem('userPk'))
    if (weight !== "") {
      formData.append('name',name)
      formData.append('height',height)
      formData.append('weight',weight)
      formData.append('gender',gender)
      if (file) {
        formData.append('image', file)
      } else {
        console.error('No file to append')
      }
      formData.append('userPk',userPk)
      setmessage('')
      
      const response = await profileCreate(formData)
     
      if (response.status == 200) {
        const userName = formData.get('name')
        const profilePk = parseInt(userPk); // userPk를 숫자로 변환합니다. 실제 응답 구조에 따라 조정 필요
        if (typeof userName === 'string' && !isNaN(profilePk)) {
          const userProfileData: userProfile = {
            profileName: userName,
            profilePk: profilePk
          };
          setUser(userProfileData)
          startTransition(() => {
            navigate('/mobile/closet');
          });
        }
    }
    } else {
      setmessage('입력을 완료해주세요')
    }
  };

  // 뒤로가기
  const goName = () => {
    setPage2(false)
    setPage1(true)
  }

  const goGender = () => {
    setPage3(false)
    setPage2(true)
  }

  const goHeight = () => {
    setPage4(false)
    setPage3(true)
  }


  const changePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
    const fileUrl = URL.createObjectURL(selectedFile); 
    setFileUrl(fileUrl);
    setFile(selectedFile)
  } else {
    console.error('No file selected')
  }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleGenderChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const selectedGender = e.currentTarget.innerText
    startTransition(() => {
      setGender(selectedGender);
    })
  };

  const handleGenderBlur: React.FocusEventHandler<HTMLButtonElement> = (e) => {
    if (!e.relatedTarget) {
      setGender('');
    }
  };


  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputHeight = e.target.value;
    const numericHeight = parseInt(inputHeight, 10);
    if (!isNaN(numericHeight)) {
      
      setHeight(String(numericHeight));
    } else {
      setHeight("");
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputWeight = e.target.value;
    const numericWeight = parseInt(inputWeight, 10);
    if (!isNaN(numericWeight)) {
      setWeight(String(numericWeight));
    } else {
      setWeight("");
    }
  };

  return (
    <>
      <h1>프로필 추가</h1>
    {page1 && 
    (<div>
      <img src="" alt="back" onClick={goBack} />
      <input id="profileImg" type="file" onChange={changePic}></input>
      {file && <img src={fileUrl} alt="Uploaded Profile" />}
      <input type="text" placeholder='프로필 이름을 입력해주세요.' value={name} onChange={handleNameChange}/>
      <br />
      {message}
      <button onClick={toGender}>다음</button>
    </div>
  )}

    {page2 && 
    (<div>
      <img src="" alt="back" onClick={goName} />
      <h1>성별 선택</h1>
      <button onClick={handleGenderChange} onBlur={handleGenderBlur}>남성</button>
      <button onClick={handleGenderChange} onBlur={handleGenderBlur}>여성</button>
      <br />
      {message}
      <button onClick={toHeight}>다음</button>
    </div>
    )}

    {page3 &&
    (<div>
      <img src="" alt="back" onClick={goGender} />
      <h1>키 입력</h1>
      <p>가상 피팅 시 맞춤 사이즈 추천에 필요해요!</p>
      <input type="text" value={height} onChange={handleHeightChange}/>cm
      <p>다음이 마지막 단계입니다!</p>
      {message}
      <button onClick={toWeight}>다음</button>
    </div>
  )}

    {page4 &&
    (<div>
        <img src="" alt="back" onClick={goHeight} />
        <h1>몸무게 입력</h1>
        <p>가상 피팅 시 맞춤 사이즈 추천에 필요해요!</p>
        <input type="text" value={weight} onChange={handleWeightChange} />kg
        {message}
        <button onClick={complete}>완료</button>
    </div>
  )}


    </>
  )
}

export default ProfileAdd
