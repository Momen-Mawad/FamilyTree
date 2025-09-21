import { Box } from "@mui/material";
import { useNavigation } from "react-router";
import Loading from "./Loading";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const BaseLayout = ({ children }: Props) => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative", // Enable stacking of elements
      }}
    >
      <Box
        sx={{
          minHeight: "84vh",
          opacity: isLoading ? 0.8 : 1, // Reduce opacity when loading
          transition: "opacity 0.3s, filter 0.3s", // Smooth transition for styles
        }}
      >
        {children}
      </Box>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0)", // Semi-transparent background
            zIndex: 10, // Ensure it appears on top
            pointerEvents: "none", // Make the overlay non-interactive
          }}
        >
          <Loading /> {/* Render Loading component on top */}
        </Box>
      )}
    </Box>
  );
};

export default BaseLayout;
