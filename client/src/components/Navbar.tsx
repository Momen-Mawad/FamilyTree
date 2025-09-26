import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Placeholder Box: Ensures symmetry on the left */}
        <Box sx={{ minWidth: 100, flexGrow: 1 }} />

        {/* Logo: Centered and clickable */}
        <Box
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            position: "absolute",
            left: 0,
            right: 0,
            margin: "0 auto",
            maxWidth: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
          }}
        >
          <img srcSet="/icon.svg" loading="lazy" style={{ height: 40 }} />
        </Box>

        {/* Links/Buttons: Pushed to the far right (or left in RTL) */}
        <Box
          sx={{
            minWidth: 100,
            flexGrow: 1,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
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
              <Button color="inherit" component={Link} to="/get-started">
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
