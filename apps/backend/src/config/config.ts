import dotenv from 'dotenv';
dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  MONGOURI: process.env.MONGOURI,
  JWT_SECRET: "dbfdbdbdjbdnkjbdnkbdk",
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
  DEV_ENV: process.env.DEV_MODE,
};


export default config;
