import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#007BFF" }, // Blue Theme
    secondary: { main: "#6c757d" },
    background: { default: "#f4f6f8" },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default theme;
