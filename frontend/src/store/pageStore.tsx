// pageStore.ts
import create from "zustand";

interface State {
  profileSetting: string;
}

interface Actions {
  setProfileSetting: (value: string) => void;
}

const pageStore = create<State & Actions>((set) => ({
  profileSetting: '',
  
  setProfileSetting: (value: string) =>
    set(() => ({
      profileSetting: value
    })),
}));

export default pageStore;
