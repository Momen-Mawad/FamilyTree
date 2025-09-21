// context/screenSizeContext.js

import { useMediaQuery, useTheme } from "@mui/material";
import { createContext, useContext } from "react";
import { type ReactNode } from "react";

const ScreenSizeContext = createContext(null);

type Props = {
  children: ReactNode;
};
export const ScreenSizeProvider = ({ children }: Props) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ScreenSizeContext.Provider value={isSmallScreen}>
      {children}
    </ScreenSizeContext.Provider>
  );
};

export const useScreenSize = () => {
  return useContext(ScreenSizeContext);
};
