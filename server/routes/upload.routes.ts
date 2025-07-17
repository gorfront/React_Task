// import express, { Request, Response } from "express";
// import multer, { FileFilterCallback } from "multer";
// import path from "path";

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) => {
//     cb(null, "uploads/");
//   },
//   filename: (
//     req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, filename: string) => void
//   ) => {
//     const ext = path.extname(file.originalname);
//     const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, name);
//   },
// });

// const upload = multer({ storage });

// router.post(
//   "/upload-avatar",
//   upload.single("avatar"),
//   async (req: Request, res: Response) => {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
//       req.file.filename
//     }`;

//     res.json({ avatarUrl: fileUrl });
//   }
// );

// export default router;

import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

router.post(
  "/upload-avatar",
  upload.single("avatar"),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    res.json({ avatarUrl: fileUrl });
  }
);

export default router;
