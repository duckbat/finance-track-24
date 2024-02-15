import {create} from 'zustand';

type ExampleState = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

export const useExampleStore = create<ExampleState>((set) => ({
  count: 0,
  increment: () => {
    return set((state) => {
      return {
        count: state.count + 1,
      };
    });
  },
  decrement: () => set((state) => ({count: state.count - 1})),
}));
