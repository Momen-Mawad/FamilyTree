import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
// Assuming you are using an SVG component for the logo, or adjust this line if you use <img>
// import LogoIcon from "/icon.svg?react";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const { t } = useTranslation();

  // State to manage the mobile drawer's open/close status
  const [drawerOpen, setDrawerOpen] = useState(false);

  // MUI Hook to check if screen size is 'sm' (small) or larger
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Define navigation items based on auth state
  const navItems = isLoggedIn
    ? [
        {
          label: t("navbar.familyTree"),
          path: "/tree",
          action: () => setDrawerOpen(false),
        },
        { label: t("navbar.logout"), path: "/", action: logout },
      ]
    : [
        {
          label: t("navbar.login"),
          path: "/login",
          action: () => setDrawerOpen(false),
        },
        {
          label: t("navbar.register"),
          path: "/register",
          action: () => setDrawerOpen(false),
        },
        {
          label: t("navbar.familyCode"),
          path: "/family-code",
          action: () => setDrawerOpen(false),
        },
      ];

  // The content of the mobile drawer
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={item.action}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo/Title Area (Centered and Clickable) */}
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
          {/* Using <img> tag as in your code */}
          <img
            srcSet="/icon.svg"
            style={{ height: 40 }}
            alt="FamilyTree Logo"
          />
        </Box>

        {/* Navigation Buttons Area */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            // Desktop Links (Your original code)
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
                  <Button color="inherit" component={Link} to="/get-started">
                    {t("navbar.login")}
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    {t("navbar.register")}
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right" // Anchor the drawer to the right (good for RTL)
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
