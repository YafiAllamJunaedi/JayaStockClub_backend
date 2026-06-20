import express from "express"
import { verifyToken } from "../middleware/verifyToken.js";
import { getAdmin, loginAdmin, logoutAdmin } from "../controller/adminController.js";

const adminRoute = express.Router();

adminRoute.post("/admin/login", loginAdmin)
adminRoute.delete("/admin/logout", logoutAdmin)
adminRoute.get("/admin/get",  getAdmin)
adminRoute.get("/auth/me", verifyToken, (req, res) => {
  res.json({
    user: req.user
  });
});

export { adminRoute }