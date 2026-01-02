import useSWRImmutable from "swr";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import Markdown from "react-markdown";

export default function LatestRelease({ repo }) {
  // Use our API route instead of direct GitHub API
  // This provides server-side caching and better rate limit handling
  const apiUrl = `/api/github/releases/${repo}`;
  const repoUrl = `https://github.com/openmrs/${repo}/releases`;

  const fetcher = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle rate limiting from our API route
      if (response.status === 429 || errorData.error === "RATE_LIMIT") {
        const error = new Error("RATE_LIMIT");
        error.rateLimitReset = errorData.rateLimitReset;
        throw error;
      }

      throw new Error(errorData.message || `Failed to fetch releases for ${repo}`);
    }

    return response.json();
  };

  const { data, error } = useSWRImmutable(apiUrl, fetcher, {
    // Retry with exponential backoff, but not for rate limits
    shouldRetryOnError: (error) => error?.message !== "RATE_LIMIT",
    errorRetryCount: 2,
    errorRetryInterval: 5000,
  });

  // Always show the releases link, even on error
  const releasesLink = (
    <h3 className="py-2">
      <a className="underline nx-text-primary-600" href={repoUrl} rel="noopener noreferrer" target="_blank">
        View all releases on GitHub
      </a>
    </h3>
  );

  if (error) {
    const isRateLimit = error.message === "RATE_LIMIT";
    const rateLimitReset = error.rateLimitReset;

    return (
      <div className="py-4 space-y-2 prose dark:prose-invert">
        {isRateLimit ? (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Unable to load latest release due to API rate limiting. Please check GitHub directly for the latest
              updates.
            </p>
            {rateLimitReset && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Rate limit resets at: {new Date(rateLimitReset).toLocaleString()}
              </p>
            )}
            {releasesLink}
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Unable to load latest release. Please check GitHub for the latest updates.
            </p>
            {releasesLink}
          </>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-4 space-y-2 prose dark:prose-invert">
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading latest release...</p>
        {releasesLink}
      </div>
    );
  }

  const latestRelease = data;

  return (
    <div className="py-4 space-y-2 prose dark:prose-invert">
      <h1 className="text-lg font-bold">{latestRelease?.name}</h1>

      <Markdown
        children={latestRelease?.body}
        remarkPlugins={[remarkGfm, [remarkGithub, { repository: `https://github.com/openmrs/${repo}` }]]}
      />

      {releasesLink}
    </div>
  );
}
