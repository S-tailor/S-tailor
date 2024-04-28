import { selector } from 'recoil'
// import { profileListState } from './ProfileAtoms'
import { profileList } from '../api/apiProfile'

export const profileListSelector = selector({
  key: 'profileListSelector',
  get: async () => {
    // const profileList = get(profileListState)
    const response = await profileList()
    return response
  }
})
