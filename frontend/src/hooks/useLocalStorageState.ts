import { useEffect, useState } from 'react';

export const useLocalStorageState = <T>(
  key: string,
  initialState: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    const item = window.localStorage.getItem(key);

    return item ? JSON.parse(item) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
    console.log('Updating local storage');
    console.log(state);
  }, [state, key]);

  return [state, setState];
};
