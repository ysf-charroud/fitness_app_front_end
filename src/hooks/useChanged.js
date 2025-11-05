import { useEffect } from "react";

const useChanged = (state) => {
  useEffect(() => {
    console.log(state);
  }, [state]);
};

export default useChanged;
