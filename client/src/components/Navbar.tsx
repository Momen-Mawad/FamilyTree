import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            {t("navbar.title")}
          </Link>
        </Typography>
        <Box>
          {isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/tree">
                {t("navbar.familyTree")}
              </Button>
              <Button color="inherit" onClick={logout}>
                {t("navbar.logout")}
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                {t("navbar.login")}
              </Button>
              <Button color="inherit" component={Link} to="/register">
                {t("navbar.register")}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
