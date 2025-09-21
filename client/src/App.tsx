import { NuqsAdapter } from "nuqs/adapters/react";
import Router from "./router/router";

function App() {
  return (
    <NuqsAdapter>
      <Router />
    </NuqsAdapter>
  );
}

export default App;
