import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./models/index.js";
import initAdmin from "./utils/initAdmin.js";

import { pengurusRoute } from "./routes/pengurusRoute.js";
import { adminRoute } from "./routes/adminRoute.js";
import { prestasiRoute } from "./routes/prestasiRoute.js";
import { carouselRoute } from "./routes/carouselRoute.js";
import { blogRoute } from "./routes/blogRoute.js";
import { galleryRoute } from "./routes/galleryRoute.js";
import { getOnly } from "./routes/getOnlyRoute.js";
import { upComingEventRoute } from "./routes/upComingEventRoute.js";

await initAdmin();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://jayastockclub-website.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(pengurusRoute);
app.use(adminRoute);
app.use(prestasiRoute);
app.use(carouselRoute);
app.use(blogRoute);
app.use(galleryRoute)
app.use(getOnly)
app.use(upComingEventRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});