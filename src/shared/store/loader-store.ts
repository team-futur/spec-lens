import { create } from 'zustand';

type LoaderState = {
  isLoading: boolean;
  loadingType: 'bar' | 'circle';
  loadingText?: string;
  timer: NodeJS.Timeout | null;
};

type LoaderStore = LoaderState & {
  actions: {
    show: ({
      loadingType,
      loadingText,
    }: {
      loadingType?: 'bar' | 'circle';
      loadingText?: string;
    }) => void;
    debounceShow: (
      options?: {
        loadingType?: 'bar' | 'circle';
        loadingText?: string;
      },
      delay?: number,
    ) => void;
    hide: () => void;
  };
};

const initialState: LoaderState = {
  isLoading: false,
  loadingType: 'bar',
  timer: null,
};

export const useLoaderStore = create<LoaderStore>()((setState, getState) => {
  return {
    ...initialState,
    actions: {
      show: ({ loadingType, loadingText }) => {
        setState({
          isLoading: true,
          loadingType,
          loadingText,
        });
      },
      debounceShow: (showOptions = {}, delay = 300) => {
        const existingTimer = getState().timer;
        if (existingTimer) {
          clearTimeout(existingTimer);
        }

        const timer = setTimeout(() => {
          getState().actions.show(showOptions);
          // 타이머가 실행되면 null로 설정
          setState((prevState) => {
            return {
              ...prevState,
              timer: null,
            };
          });
        }, delay);

        setState((prevState) => {
          return {
            ...prevState,
            timer,
          };
        });
      },
      hide: () => {
        const { timer } = getState();
        if (timer) {
          clearTimeout(timer);
          setState((prevState) => {
            return {
              ...prevState,
              timer: null,
            };
          });
        }

        setState(initialState);
      },
    },
  };
});

export const loader = useLoaderStore.getState().actions;
