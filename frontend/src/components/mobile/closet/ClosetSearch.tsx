import React from 'react'
// import { closetImgSearch, closetTextSearch } from '@/api/apiCloset'

// 이 화면에서는 각 프로필의 옷장 DB에 있는 옷을 검색할 수 있게 해야합니다.

const ClosetSearch: React.FC = () => {
  return (
    <div>
      <h1>ClosetSearch Component</h1>
      <input type="text" placeholder="옷장 안의 옷을 검색해보세요 :)" />
      <button>검색</button>
    </div>
  )
}

export default ClosetSearch
