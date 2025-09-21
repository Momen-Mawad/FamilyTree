import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          backgroundImage: "url(/family-tree-background.png)", // Use the new image
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ zIndex: 2, p: 2 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
          >
            Preserve Your Family Legacy
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{ mb: 4, textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
          >
            Create and explore your family tree with ease.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              border: "2px solid white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            }}
            onClick={() => navigate("/register")}
          >
            Get Started
          </Button>
        </Box>
      </Box>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Welcome to Family Tree
        </Typography>
        <Typography variant="body1" align="center">
          Family Tree is a powerful tool to help you document, share, and
          visualize your family history. Whether you are a beginner or a
          seasoned genealogist, our platform provides a simple and intuitive way
          to connect with your past.
        </Typography>
      </Container>
    </Box>
  );
};

export default Home;
