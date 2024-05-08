import React, { startTransition, useMemo, useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { chatbot, reset } from '@/api/apiAsk'
import userStore from '@/store/store'
import styles from '../../../scss/ask.module.scss'

const Ask: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false)
  const [fileUrl, setFileUrl] = useState<string>('')
  const [file, setFile] = useState<File | null>()
  const [text, setText] = useState<string>('')
  const [messages, setMessages] = useState<{ sender: string; text: string; image: string }[]>([])
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formData = new FormData()
  const { cartCount } = userStore()
  // const {user} = userStore()
  const [isLoading, setIsLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLImageElement>(null)

  const { user } = userStore() as {
    user: { profilePk: number; image?: string; profileName: string }[]
  }
  const userName = user[0]?.profileName ?? 'Guest'

  const profilePk = String(sessionStorage.getItem('profilePk'))
  const saveText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const resetConversation = async () => {
    await reset(profilePk)
      .then((response) => {
        console.log(response)
      })
      .catch(() => {
        console.error
      })
  }

  const sendInfo = async () => {
    setText('')
    setFileUrl('')
    setFile(null)
    if (!text) return // 텍스트가 비어있는 경우 전송하지 않음

    const newMessage = { sender: 'user', text: text, image: fileUrl }
    setMessages([...messages, newMessage])

    setIsLoading(true)
    formData.append('profile', profilePk)
    formData.append('text', text)
    if (file) {
      formData.append('image', file)
    }

    await chatbot(formData)
      .then((response) => {
        const botResponse = { sender: 'bot', text: response.data.body, image: fileUrl }
        setMessages((prev) => [...prev, botResponse])
      })
      .catch(() => {
        const errorMessage = { sender: 'bot', text: '오류가 발생했습니다.', image: fileUrl }
        setMessages((prev) => [...prev, errorMessage])
      })

    setIsLoading(false)
    handleFocus()
  }

  const changePic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile)
      setFileUrl(fileUrl)
      setFile(selectedFile)
    } else {
      console.error('No file selected')
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  // const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
  //   console.log(e.type)
  //   if (e.type == 'blur' && !buttonRef.current) {
  //     setIsFocused(false)
  //   }
  // }

  const handleClickOutside = (event: TouchEvent | any) => {
    if (event.target.tagName !== 'IMG' && event.target.tagName !== 'input') {
      setIsFocused(false)
    }
  }

  useEffect(() => {
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [inputRef, buttonRef])

  /////////// 하단 내비게이션 바 선택 시 아이콘(컬러) 변경 //////////////
  const getIconSrc = (iconName: string) => {
    const path = location.pathname
    const iconPaths: { [key: string]: { [icon: string]: string } } = {
      '/mobile/closet': {
        closet: '/assets/closetFill.png',
        'add-cloth': '/assets/upload.png',
        ask: '/assets/shirt.png',
        mypage: user[0]?.image || '/assets/avatar.PNG'
      },
      '/mobile/add-cloth': {
        closet: '/assets/closet.png',
        'add-cloth': '/assets/uploadFill.png',
        ask: '/assets/shirt.png',
        mypage: user[0]?.image || '/assets/avatar.PNG'
      },
      '/mobile/ask': {
        closet: '/assets/closet.png',
        'add-cloth': '/assets/upload.png',
        ask: '/assets/shirtFill.png',
        mypage: user[0]?.image || '/assets/avatar.PNG'
      },
      '/mobile/mypage': {
        closet: '/assets/closet.png',
        'add-cloth': '/assets/upload.png',
        ask: '/assets/shirt.png',
        mypage: user[0]?.image || '/assets/avatar.PNG'
      }
    }
    return iconPaths[path][iconName] || '/assets/' + iconName + '.png'
  }

  const getMypageImgStyle = useMemo(() => {
    return location.pathname === '/mobile/mypage'
      ? { border: '2px solid #9091FB', width: '9.5vw', height: '4.5vh', marginTop: '-2px' }
      : { filter: 'drop-shadow(0px 0px 1.5px #000000)' }
  }, [location.pathname])

  const getActiveStyle = (path: string) => {
    return location.pathname === path
      ? { fontFamily: 'Pretendard-Bold', color: '#9091FB', marginTop: '1px' }
      : {}
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerInner1}>
            <img className={styles.logo} src="/assets/styleReco.png" alt="logo" />
          </div>

          <div className={styles.headerInner2}>
            <img
              className={styles.search}
              src="/assets/search.svg"
              alt="search"
              onClick={() => {
                startTransition(() => {
                  resetConversation()
                  navigate('/mobile/closet/search')
                })
              }}
            />
          </div>

          <div className={styles.headerInner3}>
            <img
              className={styles.cart}
              src="/assets/shoppingbag.svg"
              alt="cart"
              onClick={() => {
                startTransition(() => {
                  resetConversation()
                  navigate('/mobile/closet/wishlist')
                })
              }}
            />
            <span className={styles.cartAdd}>{cartCount}</span>
          </div>
        </div>
      </div>

      <section className={styles.askMain}>
        <div className={styles.askMainInner}>
          <p className={styles.infoText}>* 페이지를 벗어나면 대화가 사라집니다!</p>
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender === 'user' ? styles.userMsg : styles.botMsg}>
              <div className={msg.sender === 'user' ? styles.userNameRight : styles.userNameLeft}>
                {msg.sender === 'user' ? `${userName}님` : 'S-Tailor'}
              </div>
              <span
                className={msg.sender === 'user' ? styles.userMessageText : styles.botMessageText}
                >
                {msg.image && <img className={styles.sentPhoto} src={msg.image} alt="전송한 사진" />}
                {msg.text}
              </span>
            </div>
          ))}
        </div>
      </section>
      <div className={styles.loadingInner}>
        {isLoading && <img className={styles.loading} src="/assets/loading.gif" alt="로딩중" />}
      </div>

      <section className={`${styles.textSend} ${isFocused ? styles.fixedInput : ''}`}>
        <div className={styles.textSendInner}>
          <img
            className={styles.addImg}
            src="/assets/add.svg"
            alt="플러스버튼"
            onClick={() => {
              fileInputRef.current?.click()
            }}
            ref={buttonRef}
          />
          <input
            id="profileImg"
            type="file"
            style={{ display: 'none' }}
            onChange={changePic}
            ref={fileInputRef}
          ></input>
          {file && <img className={styles.temporaryImage} src={fileUrl} alt="Uploaded Image" />}
          <img
            className={styles.deleteImg}
            src="/assets/delete.svg"
            alt="이미지삭제"
            onClick={() => {
              setFileUrl('')
              setFile(null)
            }}
            ref={buttonRef}
          />
          <input
            className={styles.textField}
            type="text"
            onChange={saveText}
            value={text}
            onFocus={handleFocus}
            // onBlur={handleBlur}
            ref={inputRef}
          />
          <img
            className={styles.sendImg}
            src="/assets/send.svg"
            alt="삼각형의 전송버튼"
            onClick={sendInfo}
            ref={buttonRef}
          />
        </div>
      </section>

      <footer className={styles.bottomNav} style={{ display: isFocused ? 'none' : 'flex' }}>
        <div className={styles.bottomNavInner}>
          <label className={styles.bottomNavInnerBtn}>
            <img
              className={styles.closetImg}
              src={getIconSrc('closet')}
              alt="closet-home"
              onClick={() => {
                startTransition(() => {
                  navigate('/mobile/closet')
                })
              }}
            />
            <p className={styles.bottomNavLabel1} style={getActiveStyle('/mobile/closet')}>
              옷장 홈
            </p>
          </label>

          <label className={styles.bottomNavInnerBtn}>
            <img
              className={styles.addClothesImg}
              src={getIconSrc('add-cloth')}
              alt="clothes-add"
              onClick={() => {
                startTransition(() => {
                  navigate('/mobile/add-cloth')
                })
              }}
            />
            <p className={styles.bottomNavLabel2} style={getActiveStyle('/mobile/add-cloth')}>
              옷 추가하기
            </p>
          </label>

          <label className={styles.bottomNavInnerBtn}>
            <img
              className={styles.recommendImg}
              src={getIconSrc('ask')}
              alt="style-recomm"
              onClick={() => {
                startTransition(() => {
                  navigate('/mobile/ask')
                })
              }}
            />
            <p className={styles.bottomNavLabel3} style={getActiveStyle('/mobile/ask')}>
              스타일추천
            </p>
          </label>

          <label className={styles.bottomNavInnerBtn}>
            <img
              className={styles.mypageImg}
              src={getIconSrc('mypage')}
              alt="myPage"
              style={getMypageImgStyle}
              onClick={() => {
                startTransition(() => {
                  navigate('/mobile/mypage')
                })
              }}
            />
            <p className={styles.bottomNavLabel4} style={getActiveStyle('/mobile/mypage')}>
              마이페이지
            </p>
          </label>
        </div>
      </footer>
    </div>
  )
}

export default Ask
