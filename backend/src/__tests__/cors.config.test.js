const { createOriginMatcher } = require("../config/cors");

describe("CORS origin matcher", () => {
  test("allows Vercel deployment URLs without adding each one to Railway", () => {
    const matcher = createOriginMatcher({
      corsOrigin: "http://localhost:3000",
      allowVercelPreviewOrigins: true,
    });

    expect(
      matcher.isAllowedOrigin("https://skill-bridge-digital-literacy-git-main-demo.vercel.app")
    ).toBe(true);
  });

  test("still blocks unrelated origins by default", () => {
    const matcher = createOriginMatcher({
      corsOrigin: "http://localhost:3000",
      allowVercelPreviewOrigins: true,
    });

    expect(matcher.isAllowedOrigin("https://malicious-example.com")).toBe(false);
  });

  test("supports wildcard entries when an exact allowlist is preferred", () => {
    const matcher = createOriginMatcher({
      corsOrigin: "https://*.example.com",
      allowVercelPreviewOrigins: false,
    });

    expect(matcher.isAllowedOrigin("https://app.example.com")).toBe(true);
    expect(matcher.isAllowedOrigin("https://other.vercel.app")).toBe(false);
  });
});
