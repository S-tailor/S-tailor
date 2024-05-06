import React, { useState, startTransition } from 'react'
import { closetSearch } from '@/api/apiCloset'
import { useNavigate } from 'react-router-dom'
import styles from '../../../scss/closetsearch.module.scss'

const ClosetSearch: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const navigate = useNavigate()
  const profilePk = sessionStorage.getItem('profilePk')

  function saveText(event: string) {
    setSearchText(event)
  }

  const handleSearch = async () => {
    if (!searchText) {
      alert('검색어를 입력해주세요!')
      return
    }
    try {
      const response = await closetSearch({ profilePk, content: searchText })
      console.log(profilePk)
      console.log(response.data)
      setSearchResults(response.data.result)
    } catch (error) {
      console.log('에러 발생:', error)
    }
  }

  const clearSearch = () => {
    setSearchText('')
  }

  const goCloset = () => {
    startTransition(() => {
      navigate('/mobile/closet')
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInner}>

          <img onClick={goCloset} className={styles.backBtn} src="/assets/backBtn.svg" alt="backBtn" />
          
          <div className={styles.searchbar}>
            <input
              className={styles.searchbarInner}
              type="text"
              value={searchText}
              onChange={(e) => saveText(e.target.value)}
              placeholder="옷장 안의 옷을 검색해보세요 :)"
              autoFocus
            />
            <img
              className={styles.search}
              src="/assets/search.svg"
              alt="search"
              onClick={handleSearch}
            />
          </div>

          <button className={styles.clearBtn} onClick={clearSearch}>취소</button>

        </div>
      </div> 
 
      <div className={styles.searchClothes}>
        {searchResults.map((item, index) => (
          <div key={index} className={styles.resultItem}>
            <img className={styles.resultItemImg} src={item.image} alt={item.name} />
            <p className={styles.clothesSource}>판매처: {item.source}</p>
            <p className={styles.clothesName}>{item.name}</p>
            <p className={styles.clothesPrice}>가격: {item.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClosetSearch
