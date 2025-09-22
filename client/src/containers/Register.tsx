import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { URL } from "../config";
import { useTranslation } from "react-i18next";

const Register: React.FC = () => {
  const [form, setValues] = useState({
    email: "",
    password: "",
    password2: "",
    familyName: "",
  });

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({ text: "", type: "" });
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(`${URL}/register`, {
        email: form.email,
        password: form.password,
        password2: form.password2,
        family: form.familyName,
      });

      if (response.data.ok) {
        setMessage({ text: response.data.message, type: "success" });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage({ text: response.data.message, type: "error" });
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || t("register.unexpectedError");
      setMessage({ text: errorMessage, type: "error" });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("register.title")}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label={t("register.email")}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label={t("register.password")}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label={t("register.repeatPassword")}
            name="password2"
            type="password"
            value={form.password2}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label={t("register.familyName")}
            name="familyName"
            type="text"
            value={form.familyName}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {t("register.submit")}
          </Button>
        </Box>
        {message.text &&
          (message.type === "success" || message.type === "error") && (
            <Alert severity={message.type} sx={{ mt: 2 }}>
              {message.text}
            </Alert>
          )}
      </Paper>
    </Box>
  );
};

export default Register;
