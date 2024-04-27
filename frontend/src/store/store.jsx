import create from "zustand";
// yarn add zustand

const useStore = create((set) => ({
    example: 0,
    
    setExample: () => set((state)=> ({
        count: state.count+1
    })),

  }));
  
  export default useStore;