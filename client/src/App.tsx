import { NuqsAdapter } from "nuqs/adapters/react";
import Router from "./router/router";

function App() {
  return (
    <NuqsAdapter>
      <Router />
    </NuqsAdapter>
    // <Router>
    //   <Navbar isLoggedIn={isLoggedIn} />
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route
    //       path="/login"
    //       element={
    //         isLoggedIn ? <Navigate to="/tree-page" /> : <Login login={login} />
    //       }
    //     />
    //     <Route
    //       path="/register"
    //       element={isLoggedIn ? <Navigate to="/tree-page" /> : <Register />}
    //     />
    //     <Route
    //       path="/tree-page"
    //       element={
    //         !isLoggedIn ? (
    //           <Navigate to="/" />
    //         ) : (
    //           <TreePage logout={logout} user={user} />
    //         )
    //       }
    //     />
    //   </Routes>
    // </Router>
  );
}

export default App;
