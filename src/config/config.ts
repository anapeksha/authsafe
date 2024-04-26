export default () => ({
  port: !Number.isNaN(Number(process.env.PORT))
    ? Number(process.env.PORT)
    : 3000,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  secrets: {
    jwt: process.env.JWT_SECRET,
    cookie: process.env.COOKIE_SECRET,
  },
});
