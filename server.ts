import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

// Initialize Firebase Admin
// In Cloud Run, it will use default credentials if no service account is provided
if (!admin.apps.length) {
  try {
    admin.initializeApp();
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
  }
}

const db = admin.firestore();
const auth = admin.auth();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // 1. Basic Security Headers with Helmet
  // Configured to allow images from trusted sources (Unsplash, Picsum)
  // frameguard is disabled to allow the app to be rendered in the AI Studio iframe
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "img-src": ["'self'", "data:", "https:", "http:", "https://maps.gstatic.com", "https://maps.googleapis.com"],
          "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://maps.googleapis.com", "https://*.firebaseapp.com", "https://apis.google.com"],
          "connect-src": ["'self'", "https://*.googleapis.com", "https://*.firebaseio.com", "wss://*.firebaseio.com", "https://*.firebaseapp.com"],
          "frame-ancestors": ["'self'", "https://*.google.com", "https://*.run.app"],
          "frame-src": ["'self'", "https://*.firebaseapp.com", "https://*.google.com"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
      frameguard: false,
    })
  );

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).send("OK");
  });

  // 2. Rate Limiting to prevent brute force/DoS
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: "Too many requests from this IP, please try again later." }
  });
  app.use("/api/", limiter);

  // 3. CORS Configuration
  app.use(cors({
    origin: process.env.APP_URL || true, // Allow the app's own URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));

  // Middleware to parse JSON
  app.use(express.json({ limit: '10kb' })); // Limit body size to prevent large payload attacks

  // API Route for approving user role updates and creating auth accounts
  app.post("/api/admin/approve-user", async (req, res) => {
    const { approvalId, adminId } = req.body;

    if (!approvalId) {
      return res.status(400).json({ error: "Approval ID is required." });
    }

    try {
      // 1. Get the approval document
      const approvalRef = db.collection('pending_approvals').doc(approvalId);
      const approvalDoc = await approvalRef.get();

      if (!approvalDoc.exists) {
        return res.status(404).json({ error: "Approval request not found." });
      }

      const approval = approvalDoc.data();
      if (approval?.status !== 'pending') {
        return res.status(400).json({ error: "Approval request is already processed." });
      }

      if (approval?.type !== 'UPDATE_USER_ROLE') {
        return res.status(400).json({ error: "Invalid approval type for this endpoint." });
      }

      const userData = approval?.data;
      const targetId = approval?.targetId;

      let uid = targetId;

      // 2. Handle User Authentication
      if (!uid) {
        // This is a new user, create their Firebase Auth account
        try {
          const userRecord = await auth.createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.name,
          });
          uid = userRecord.uid;
          console.log(`Created new Firebase Auth user: ${uid}`);
        } catch (error: any) {
          if (error.code === 'auth/email-already-exists') {
            // User already exists in Auth, get their UID
            const userRecord = await auth.getUserByEmail(userData.email);
            uid = userRecord.uid;
            console.log(`User already exists in Auth, using UID: ${uid}`);
          } else {
            throw error;
          }
        }
      } else {
        // Existing user, ensure they exist in Auth
        try {
          await auth.getUser(uid);
        } catch (error: any) {
          if (error.code === 'auth/user-not-found') {
            // If they have a Firestore doc but no Auth account (e.g. manual entry)
            // We might want to create them if we have an email
            if (userData.email) {
              const userRecord = await auth.createUser({
                uid: uid,
                email: userData.email,
                displayName: userData.name,
              });
              console.log(`Created missing Auth account for existing Firestore user: ${uid}`);
            }
          } else {
            throw error;
          }
        }
      }

      // 3. Set Custom Claims (Role)
      // This is the "identification of the role of the user by using a custom token" part
      await auth.setCustomUserClaims(uid, { role: userData.role });
      console.log(`Set custom claims for user ${uid}: ${userData.role}`);

      // 4. Update/Create User Document in Firestore
      const userRef = db.collection('users').doc(uid);
      const { password, ...firestoreData } = userData; // Don't store password in Firestore
      await userRef.set({
        ...firestoreData,
        id: uid,
        status: 'active',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // 5. Mark Approval as Approved
      await approvalRef.update({
        status: 'approved',
        targetId: uid,
        reviewedBy: adminId || 'system',
        reviewedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 6. Generate a custom token (optional, but requested by user)
      const customToken = await auth.createCustomToken(uid);

      res.json({ 
        success: true, 
        message: "User approved and authentication set up successfully.",
        uid,
        customToken // They can use this to sign in if they want
      });

    } catch (error: any) {
      console.error("Error in approve-user endpoint:", error);
      res.status(500).json({ error: error.message || "An internal error occurred." });
    }
  });

  // API Route Example: Accessing a private secret key
  app.get("/api/secret-data", (req, res) => {
    const secretKey = process.env.THIRD_PARTY_API_SECRET;
    
    if (!secretKey) {
      return res.status(500).json({ 
        error: "THIRD_PARTY_API_SECRET is not configured in environment variables." 
      });
    }

    // In a real app, you would use the secretKey to call an external API
    res.json({ 
      message: "Successfully accessed private data using the secret key.",
      // Never send the actual secret back to the client!
      status: "Authenticated"
    });
  });

  // Vite middleware for development
  const isProd = process.env.NODE_ENV === "production";
  
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Explicit fallback for SPA in dev mode if vite.middlewares doesn't handle it
    app.get("*", async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) return next();
      try {
        const fs = await import('fs');
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("VITE_GOOGLE_MAPS_API_KEY present:", !!process.env.VITE_GOOGLE_MAPS_API_KEY);
    console.log("GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);
  });
}

startServer();
