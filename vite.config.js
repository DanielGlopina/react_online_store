import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/react_online_store/", // <-- добавь сюда имя своего репозитория с косой чертой
  plugins: [react()],
});
