import { NuqsAdapter } from "nuqs/adapters/react";
import Router from "./router/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <NuqsAdapter>
      <Router />
    </NuqsAdapter>
  );
}

export default App;
