import { NavLink } from "react-router";

const Navbar = ( {isLoggedIn}: {isLoggedIn: boolean}) => {

  return (
    <div className="navbar">
    <NavLink 
    to={"/"}
      style={ ({isActive}) => (
    isActive ? linkStyles.activeLink : linkStyles.defaultLink
  )}>
    Home
    </NavLink>

    {isLoggedIn===false
      && <>
      <NavLink
      to="/register"
      style={ ({isActive}) => (
        isActive ? linkStyles.activeLink : linkStyles.defaultLink
        )}>
      Register
      </NavLink>
      <NavLink
      to="/login"
      style={ ({isActive}) => (
        isActive ? linkStyles.activeLink : linkStyles.defaultLink
        )}>
      Login
      </NavLink>
      </>
    }

      <NavLink  
      to="/tree-page"
      style={ ({isActive}) => (
        isActive ? linkStyles.activeLink : linkStyles.defaultLink
        )}>
      Tree
      </NavLink>
      </div>
      );
}

export default Navbar;

const linkStyles = {
  activeLink: {
    color: "gray",
  },
  defaultLink: {
    textDecoration: "none",
    color: "white",
  },
};