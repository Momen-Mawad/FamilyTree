import React from "react";
import { Container, Typography, Box } from "@mui/material";

const Home: React.FC = () => (
  <Container maxWidth="md">
    <Box
      sx={{
        mt: 8,
        mb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to the Family Tree App
      </Typography>
      <Typography variant="h5" component="p" color="text.secondary">
        Explore and preserve your family's history in a beautiful and
        interactive way.
      </Typography>
    </Box>

    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        This is the home page for your family tree website. Here, you can learn
        about the project, sign up, and log in. Once you are authenticated, you
        will be able to view and manage your family tree.
      </Typography>
      <Typography variant="body1" sx={{ fontStyle: "italic" }}>
        If you are not logged in, you will be redirected here when trying to
        access the secret page.
      </Typography>
    </Box>
  </Container>
);

export default Home;
