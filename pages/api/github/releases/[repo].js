/**
 * Next.js API route to proxy GitHub releases API requests
 * This provides server-side caching to reduce GitHub API rate limit issues
 *
 * Uses ISR (Incremental Static Regeneration) to cache responses for 1 hour
 * and revalidate in the background when needed
 *
 * In-memory cache to store responses even when GitHub rate limits
 */
const cache = new Map();
const CACHE_TTL = 3600 * 1000; // 1 hour in milliseconds
const STALE_CACHE_TTL = 24 * 3600 * 1000; // 24 hours for stale cache

function getCachedData(repo) {
  const cached = cache.get(repo);
  if (!cached) return null;

  const now = Date.now();
  const age = now - cached.timestamp;

  // Return fresh data if within TTL
  if (age < CACHE_TTL) {
    return cached.data;
  }

  // Return stale data if within stale TTL (for rate limit scenarios)
  if (age < STALE_CACHE_TTL) {
    return { ...cached.data, _stale: true };
  }

  // Cache expired, remove it
  cache.delete(repo);
  return null;
}

function setCachedData(repo, data) {
  cache.set(repo, {
    data,
    timestamp: Date.now(),
  });
}

export default async function handler(req, res) {
  const { repo } = req.query;

  if (!repo) {
    return res.status(400).json({ error: "Repository name is required" });
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check cache first
  const cachedData = getCachedData(repo);
  if (cachedData && !cachedData._stale) {
    // Serve fresh cached data
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json(cachedData);
  }

  try {
    const githubApiUrl = `https://api.github.com/repos/openmrs/${repo}/releases/latest`;

    const response = await fetch(githubApiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "OpenMRS-O3-Docs",
      },
    });

    // Handle rate limiting
    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
      const rateLimitReset = response.headers.get("x-ratelimit-reset");

      if (rateLimitRemaining === "0") {
        // If we have stale cached data, serve it
        if (cachedData && cachedData._stale) {
          res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=86400");
          res.setHeader("X-Cache-Status", "STALE");
          return res.status(200).json(cachedData);
        }

        // No cached data available, return rate limit error
        return res.status(429).json({
          error: "RATE_LIMIT",
          message: "GitHub API rate limit exceeded",
          rateLimitReset: rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toISOString() : null,
        });
      }
    }

    if (!response.ok) {
      // Try to serve stale cache on other errors too
      if (cachedData && cachedData._stale) {
        res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=86400");
        res.setHeader("X-Cache-Status", "STALE");
        return res.status(200).json(cachedData);
      }

      return res.status(response.status).json({
        error: "GITHUB_API_ERROR",
        message: `Failed to fetch releases for ${repo}`,
        status: response.status,
      });
    }

    const data = await response.json();

    // Cache the successful response
    setCachedData(repo, data);

    // Set cache headers for ISR
    // Cache for 1 hour, revalidate in background
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");

    return res.status(200).json(data);
  } catch (error) {
    // Try to serve stale cache on network errors
    if (cachedData && cachedData._stale) {
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=86400");
      res.setHeader("X-Cache-Status", "STALE");
      return res.status(200).json(cachedData);
    }

    console.error(`Error fetching GitHub release for ${repo}:`, error);
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "An error occurred while fetching the release",
    });
  }
}
