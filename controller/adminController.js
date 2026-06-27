import Admin from "../models/modelAdmin.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";

export const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findByPk(id);
        if (!admin) return res.status(404).json({ message: "Admin tidak ditemukan" });
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findAll();
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginAdmin = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi"
      });
    }

    const admin = await Admin.findOne({
      where: { email: email }
    });

    if (!admin) {
      return res.status(404).json({
        message: "Email belum terdaftar"
      });
    }

    if (!admin.password) {
      return res.status(500).json({
        message: "Password admin tidak ditemukan di database"
      });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(400).json({
        message: "Password salah"
      });
    }

    const payload = {
      adminId: admin.id,
      email: admin.email
    };

    const accessToken = jwt.sign(
      payload,
      process.env.SECRET_ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.SECRET_REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    await Admin.update(
      { refresh_token: refreshToken },
      { where: { id: admin.id } }
    );

    res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

    res.json({
      message: "Login berhasil"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const logoutAdmin = async (req, res) => {
  try {

    console.log("cookies:", req.cookies);

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res.status(200).json({
        message: "Logout berhasil"
      });
    }

    const admin = await Admin.findOne({
      where: { refresh_token: refreshToken }
    });

    if (admin) {
      await Admin.update(
        { refresh_token: null },
        { where: { id: admin.id } }
      );
    }

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res.status(200).json({
      message: "Logout berhasil"
    });

  } catch (error) {

    console.log("Logout error:", error);
    console.log("cookies:", req.cookies);
    console.log("refreshToken:", req.cookies?.refreshToken);

    return res.status(500).json({
      message: error.message
    });

  }
};