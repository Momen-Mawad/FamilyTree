import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth(); // Get isLoggedIn and logout from AuthContext

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Family Tree
          </Link>
        </Typography>
        <Box>
          {isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/tree">
                Family Tree
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
