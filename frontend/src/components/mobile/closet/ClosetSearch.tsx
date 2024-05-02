import React, { useState } from 'react'
import { closetSearch } from '@/api/apiCloset'

const ClosetSearch: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any[]>([])

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

  return (
    <div>
      <h1>ClosetSearch Component</h1>
      <input
        type="text"
        value={searchText}
        onChange={(e) => saveText(e.target.value)}
        placeholder="옷장 안의 옷을 검색해보세요 :)"
      />
      <button onClick={handleSearch}>검색</button>
      <div>
        {searchResults.map((item, index) => (
          <div key={index}>
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>가격: {item.price}</p>
            <p>판매처: {item.source}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClosetSearch
