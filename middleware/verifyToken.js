import jwt from "jsonwebtoken";
import "dotenv/config";

export const verifyToken = (req, res, next) => {
  try {

    console.log("========== VERIFY TOKEN ==========");
    console.log("Origin:", req.headers.origin);
    console.log("Cookie Header:", req.headers.cookie);
    console.log("Parsed Cookies:", req.cookies);

    const token = req.cookies?.accessToken;

    console.log("Access Token:", token);

    if (!token) {
      console.log("Token tidak ditemukan");
      return res.status(403).json({
        message: "Token not found"
      });
    }

    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {

      console.log("JWT Error:", err);
      console.log("Decoded:", decoded);

      if (err) {
        return res.status(403).json({
          message: "The token is incorrect or has expired"
        });
      }

      req.user = decoded;
      next();
    });

  } catch (error) {

    console.error("Verify Token Error:", error);

    return res.status(500).json({
      message: "Internal Server Error"
    });

  }
};