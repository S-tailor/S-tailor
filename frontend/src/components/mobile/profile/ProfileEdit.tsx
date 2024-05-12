import React,{useState, useRef, useEffect, startTransition} from "react"
import userStore from "@/store/store"
import { useNavigate } from "react-router-dom"
import styles from '../../../scss/profileedit.module.scss';
import { profileEdit, profileSelect } from "@/api/apiProfile";

const profileEditor: React.FC = () => {
interface userProfile {
    image: string
    profileName: string
    profilePk: number
}
const {setUser, clearUsers} = userStore()

const navigate = useNavigate()
const fileInputRef = useRef<HTMLInputElement>(null);
const [fileUrl, setFileUrl] = useState<string>("")
const [file, setFile] = useState<File>();
const [page1, setPage1] = useState(true)
const [page2, setPage2] = useState(false)
const [page3, setPage3] = useState(false)
const [page4, setPage4] = useState(false)
const [message, setmessage] = useState('')
const [name, setName] = useState<string>("");
const [gender, setGender] = useState<string>("");
const [height, setHeight] = useState<string>("")
const [weight, setWeight] = useState<string>("")
const [profilePk, setProfilePk] = useState<number>()
const formData = new FormData()

const getUser = async() => {
  const pk = Number(sessionStorage.getItem('profilePk'))
  const res =  await profileSelect(pk)
  const profile = res.data.result
  
  setProfilePk(profile.profilePk)
  setFileUrl(profile.image);
  setName(profile.profileName);
  setWeight(profile.weight)
  setHeight(profile.height)
}

useEffect(() => {
  getUser()
}, []);

const changePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
    const fileUrl = URL.createObjectURL(selectedFile); 
    setFileUrl(fileUrl);
    setFile(selectedFile)
    
  } else {
    console.error('No file selected')
  }}


  const complete = async () => {
    
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
      formData.append('profilePk', String(profilePk));
      setmessage('')
      
      const response = await profileEdit(formData)
     
     
      if (response.status == 200) {
        const userName = formData.get('name')
        const Pk = profilePk
        if (typeof userName === 'string' && Pk) {
          const userProfileData: userProfile = {
            profileName: userName,
            profilePk: Pk,
            image: fileUrl
          };
          setUser(userProfileData)
          startTransition(() => {
            clearUsers()
            navigate('/mobile/profile');
          });
        }
    }
    } else {
      setmessage('입력을 완료해주세요')
    }
  };




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



  const goSelect = () => {
    startTransition(() => {
      navigate('/mobile/profile')
    })
  }

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


    return (
        <div className={styles.container}>
          <div className={styles.bgVideo}>
            <video className={styles.bgVideoContent} autoPlay muted loop >
              <source src='/assets/background_light.mp4' />
            </video>
          </div>
          
          {page1 && 
          <>
            <div className={styles.header}>
              <div className={styles.headerInner1}>
                  <img
                    onClick={goSelect}
                    className={styles.backBtn}
                    src="/assets/backBtn.svg"
                    alt="backBtn"
                  />
                </div>
                <div className={styles.headerInner2}>
                  <p className={styles.profileadd}>프로필 수정</p>
                </div>
                <div className={styles.headerInner3}></div>
            </div>

            <section className={styles.create}>
              <div className={styles.profileImg}>
                <img className={styles.uploadedImg} src={fileUrl} alt="Uploaded Profile" />
                <label htmlFor="profileImg" onClick={()=>{fileInputRef.current?.click()}}>
                  <img className={styles.labelImg} src="/assets/edit.svg" alt="edit" />
                  <input id="profileImg" type="file" style={{ display: 'none' }} onChange={changePic} ref={fileInputRef}></input>
                </label>
              </div>
              <input
                className={styles.profileNameInput}
                type="text"
                placeholder={name}
                onChange={handleNameChange}
                autoFocus
              />
              <p className={styles.line}></p>
              <br />
              <p className={`${styles.message} ${message ? styles.showMessage : ''}`}>{message}</p>
            </section>
            
            <section className={styles.bottomButton}>
              <button className={styles.btn} onClick={toGender}>다음</button>
            </section>
          </>
          }

          {page2 && <>
            <div className={styles.header}>
            <div className={styles.headerInner1}>
              <img className={styles.backBtn} src="/assets/backBtn.svg" alt="backBtn" onClick={goName} />
            </div>
            <div className={styles.headerInner2}>
              <p className={styles.profileadd}>프로필 수정</p>
            </div>
            <div className={styles.headerInner3}>
            </div>
          </div>
              <section className={styles.create2}>
          <div className={styles.topInfo}>
            <p className={styles.texts}>성별 선택</p>
          </div>

          <div className={styles.toggleSwitch}>
            <button
              className={styles.toggleButton}
              onClick={handleGenderChange}
              onBlur={handleGenderBlur}
            >
            남성
            </button>
            <button
                className={styles.toggleButton}
                onClick={handleGenderChange}
                onBlur={handleGenderBlur}
              >
              여성
            </button>
          </div>
          <br />
          <p className={`${styles.message} ${message ? styles.showMessage : ''}`}>
              {message}
          </p>
        </section>

        <section className={styles.empty}>
        </section>

        <section className={styles.bottomButton2}>
          <button className={styles.btn2} onClick={toHeight}>다음</button>
        </section>
              </>}
              {page3 &&
      (<>
        <div className={styles.header}>
          <div className={styles.headerInner1}>
            <img className={styles.backBtn} src="/assets/backBtn.svg" alt="backBtn" onClick={goGender} />
          </div>
          <div className={styles.headerInner2}>
            <p className={styles.profileadd}>프로필 수정</p>
          </div>
          <div className={styles.headerInner3}>
          </div>
        </div>

        <section className={styles.create3}>
          <div className={styles.topInfo}>
            <p className={styles.texts}>키 입력</p>
            <p className={styles.subtexts}>가상 피팅 시 맞춤 사이즈 추천에 필요해요!</p>
          </div>

          <div className={styles.middleInfo}>
            <input 
                className={styles.profileNameInput2}
                type="text" 
                placeholder={height}
                value={height}
                onChange={handleHeightChange}
                autoFocus
              />
              <label className={styles.cm} htmlFor="">cm</label>
              <p className={styles.line2}></p>
          </div>

        </section>

        
        <section className={styles.bottomButton3}>
          <p className={styles.subtexts2}>다음이 마지막 단계입니다!</p>
          <p className={`${styles.message} ${message ? styles.showMessage : ''}`}>
            {message}
          </p>
          <button className={styles.btn3} onClick={toWeight}>다음</button>
        </section>
      </>
    )}

  {page4 &&
      (<>
        <div className={styles.header}>
          <div className={styles.headerInner1}>
            <img className={styles.backBtn} src="/assets/backBtn.svg" alt="backBtn" onClick={goHeight} />
          </div>
          <div className={styles.headerInner2}>
            <p className={styles.profileadd}>프로필 수정</p>
          </div>
          <div className={styles.headerInner3}>
          </div>
        </div>

        <section className={styles.create3}>
          <div className={styles.topInfo}>
            <p className={styles.texts}>몸무게 입력</p>
            <p className={styles.subtexts}>가상 피팅 시 맞춤 사이즈 추천에 필요해요!</p>
          </div>

          <div className={styles.middleInfo}>
            <input 
                className={styles.profileNameInput2}
                type="text" 
                placeholder={weight} 
                value={weight}
                onChange={handleWeightChange}
                autoFocus
              />
              <label className={styles.cm} htmlFor="">kg</label>
              <p className={styles.line2}></p>
          </div>

        </section>

        
        <section className={styles.bottomButton3}>
          <p className={styles.subtexts2}>이제 마지막입니다!</p>
          <p className={`${styles.message} ${message ? styles.showMessage : ''}`}>
            {message}
          </p>
          <button className={styles.btn3} onClick={complete}>완료</button>
        </section>
      </>
    )}
</div>
    )

  
}

export default profileEditor