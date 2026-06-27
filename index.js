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

app.use(cors({
  origin: ["http://localhost:5173"],
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