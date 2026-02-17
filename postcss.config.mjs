import path from "path";

// Use process.cwd() so Tailwind resolves correctly in all environments (local, Vercel, etc.)
const base = process.cwd();

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base,
    },
  },
};

export default config;
