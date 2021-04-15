import "./App.css";
import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import Dashboard from "./components/Dashboard";

function App() {
  // Theme of app can be specified, can set default to dark.
  // Uncomment line 13 to switch defaults
  let defaultThemeMode = useMediaQuery("(prefers-color-scheme: light)");
  defaultThemeMode = useMediaQuery("(prefers-color-scheme: dark)");
  const prefersDarkMode = defaultThemeMode;
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
