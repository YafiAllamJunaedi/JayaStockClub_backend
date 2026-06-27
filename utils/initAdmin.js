import bcrypt from "bcrypt";
import Admin from "../models/modelAdmin.js";
// import Admin from "../models/modelAdmin.js";

export default async function initAdmin() {

    const existing = await Admin.findOne({
        where: {
            email: process.env.ADMIN_EMAIL
        }
    });

    if(existing) return;

    const hash = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
    );

    await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: hash
    });

    console.log("Default admin created");
}