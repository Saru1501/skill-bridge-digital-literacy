const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

const parseOriginList = (...values) =>
  values
    .flatMap((value) => (value || "").split(","))
    .map((origin) => origin.trim())
    .filter(Boolean);

const escapeRegExp = (value) => value.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");

const wildcardToRegExp = (pattern) =>
  new RegExp(`^${pattern.split("*").map(escapeRegExp).join(".*")}$`);

const isVercelDeploymentOrigin = (origin) => {
  try {
    const { protocol, hostname } = new URL(origin);
    return protocol === "https:" && hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

const createOriginMatcher = ({
  corsOrigin = process.env.CORS_ORIGIN,
  frontendUrl = process.env.FRONTEND_URL,
  allowVercelPreviewOrigins = process.env.ALLOW_VERCEL_PREVIEW_ORIGINS !== "false",
} = {}) => {
  const configuredOrigins = Array.from(
    new Set([...DEFAULT_ALLOWED_ORIGINS, ...parseOriginList(corsOrigin, frontendUrl)])
  );

  const allowAllOrigins = configuredOrigins.includes("*");
  const wildcardOrigins = configuredOrigins.filter((origin) => origin.includes("*"));
  const exactOrigins = new Set(configuredOrigins.filter((origin) => origin !== "*" && !origin.includes("*")));
  const wildcardPatterns = wildcardOrigins.map(wildcardToRegExp);

  const isAllowedOrigin = (origin) => {
    if (!origin || allowAllOrigins) {
      return true;
    }

    if (exactOrigins.has(origin)) {
      return true;
    }

    if (wildcardPatterns.some((pattern) => pattern.test(origin))) {
      return true;
    }

    if (allowVercelPreviewOrigins && isVercelDeploymentOrigin(origin)) {
      return true;
    }

    return false;
  };

  return {
    allowAllOrigins,
    allowVercelPreviewOrigins,
    allowedOrigins: configuredOrigins,
    isAllowedOrigin,
  };
};

const buildCorsOptions = (matcher = createOriginMatcher()) => ({
  origin(origin, callback) {
    if (matcher.isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
  exposedHeaders: ["Authorization", "Content-Type"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
});

module.exports = {
  buildCorsOptions,
  createOriginMatcher,
  isVercelDeploymentOrigin,
};
