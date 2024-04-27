import { atom } from 'recoil'

// 주 계정의 프로필 고유 번호
export const selectedProfilePkState = atom<number | null>({
  key: 'selectedProfilePk',
  default: null
})
