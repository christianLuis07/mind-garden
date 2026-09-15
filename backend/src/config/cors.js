/**
 * Unified CORS Configuration for MindGarden
 * Handles local dev, Vercel deployments, and custom domain (with or without www, trailing slashes)
 */

const isOriginAllowed = (origin) => {
  // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
  if (!origin) return true;

  // Clean the incoming origin: trim and remove trailing slash
  const cleanOrigin = origin.trim().replace(/\/+$/, "");

  // Allowed domain patterns (localhost, any vercel preview, custom domain + subdomains)
  const allowedPatterns = [
    /^https?:\/\/localhost(:[0-9]+)?$/,
    /^https?:\/\/127\.0\.0\.1(:[0-9]+)?$/,
    /^https?:\/\/([a-zA-Z0-9-]+\.)*mindgarden-porting\.my\.id$/,
    /^https?:\/\/([a-zA-Z0-9-]+\.)*vercel\.app$/,
  ];

  if (allowedPatterns.some((pattern) => pattern.test(cleanOrigin))) {
    return true;
  }

  // Also check against CLIENT_URL if provided
  if (process.env.CLIENT_URL) {
    const clientUrl = process.env.CLIENT_URL.trim().replace(/\/+$/, "");
    const clientWithoutWww = clientUrl.replace("://www.", "://");
    const clientWithWww = clientUrl.includes("://www.")
      ? clientUrl
      : clientUrl.replace("://", "://www.");

    if (
      cleanOrigin === clientUrl ||
      cleanOrigin === clientWithoutWww ||
      cleanOrigin === clientWithWww
    ) {
      return true;
    }
  }

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy violation: ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

module.exports = {
  isOriginAllowed,
  corsOptions,
};
