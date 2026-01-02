import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import stringWidth from "string-width";
import useSWRImmutable from "swr";

export default function ApiDocs() {
  const apiUrl =
    "https://raw.githubusercontent.com/openmrs/openmrs-esm-core/main/packages/framework/esm-framework/docs/API.md";
  const githubUrl =
    "https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md";

  const fetcher = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
      // Provide more context in error messages
      const statusText = response.statusText || `HTTP ${response.status}`;
      const error = new Error(`Failed to fetch API docs: ${statusText}`);
      error.status = response.status;
      throw error;
    }

    return response.text();
  };

  const { data, error } = useSWRImmutable(apiUrl, fetcher, {
    // Retry with exponential backoff for transient failures
    shouldRetryOnError: (error) => {
      // Don't retry on 404 (not found) or 403 (forbidden) - these are likely permanent
      return error?.status !== 404 && error?.status !== 403;
    },
    errorRetryCount: 2,
    errorRetryInterval: 5000,
  });

  const transformMarkdown = (markdown) => {
    const lines = markdown.split("\n");
    const transformedMarkdown = lines.length > 3 ? lines.slice(3).join("\n") : markdown;

    // Base URL for GitHub docs
    const docsBaseUrl = "https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs";

    // Transform anchor links within API.md to local anchors
    let transformed = transformedMarkdown.replace(/\(API\.md#(\w+)\)/g, "(/docs/framework-api-reference#$1)");

    // Transform relative markdown file links to GitHub URLs
    // Matches patterns like: [text](functions/file.md) or [text](interfaces/file.md) etc.
    transformed = transformed.replace(
      /\[([^\]]+)\]\(((?:functions|interfaces|classes|type-aliases|variables|enumerations)\/[^)]+\.md)\)/g,
      (match, linkText, relativePath) => {
        // Check if it's already an absolute URL
        if (relativePath.startsWith("http")) {
          return match;
        }
        const githubUrl = `${docsBaseUrl}/${relativePath}`;
        return `[${linkText}](${githubUrl})`;
      }
    );

    // Transform relative links that start with ../ (from within function files)
    transformed = transformed.replace(
      /\[([^\]]+)\]\(\.\.\/((?:functions|interfaces|classes|type-aliases|variables|enumerations)\/[^)]+\.md)\)/g,
      (match, linkText, relativePath) => {
        const githubUrl = `${docsBaseUrl}/${relativePath}`;
        return `[${linkText}](${githubUrl})`;
      }
    );

    return transformed;
  };

  // Always show fallback link to GitHub
  const githubLink = (
    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
      <a className="underline nx-text-primary-600" href={githubUrl} rel="noopener noreferrer" target="_blank">
        View API documentation on GitHub
      </a>
    </p>
  );

  if (error) {
    const isNotFound = error.status === 404;
    const isForbidden = error.status === 403;

    return (
      <div className="py-4 space-y-2 prose dark:prose-invert">
        {isNotFound ? (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              API documentation not found. The documentation may have been moved or is temporarily unavailable.
            </p>
            {githubLink}
          </>
        ) : isForbidden ? (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Unable to load API documentation due to access restrictions. Please check GitHub directly.
            </p>
            {githubLink}
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Unable to load API documentation. Please check GitHub for the latest documentation.
            </p>
            {githubLink}
          </>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-4 space-y-2 prose dark:prose-invert">
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading API documentation...</p>
        {githubLink}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-4 space-y-2 prose dark:prose-invert">
        <p className="text-sm text-gray-600 dark:text-gray-400">No documentation found.</p>
        {githubLink}
      </div>
    );
  }

  const transformedMarkdown = transformMarkdown(data);

  return (
    <div className="py-4 space-y-2 prose dark:prose-invert prose-table:border-neutral-950 prose-code:bg-slate-100 dark:prose-code:bg-slate-600 prose-headings:mt-8 prose-headings:mb-4 prose-h1:mt-0 prose-h2:mt-8 prose-h2:mb-4 prose-h3:mt-6 prose-h3:mb-3 prose-h4:mt-4 prose-h4:mb-2">
      <Markdown
        children={transformedMarkdown}
        remarkPlugins={[
          [remarkGithub, { repository: "https://github.com/openmrs/openmrs-esm-core" }],
          [remarkGfm, { stringLength: stringWidth }],
        ]}
        rehypePlugins={[rehypeSlug]}
        components={{
          a: ({ node, href, children, ...props }) => {
            // Check if it's an external link (GitHub or other external URLs)
            const isExternal = href?.startsWith("http") || href?.startsWith("//");
            // Check if it's a GitHub link (to open in new tab)
            const isGitHubLink = href?.includes("github.com");

            if (isExternal) {
              return (
                <a
                  href={href}
                  target={isGitHubLink ? "_blank" : undefined}
                  rel={isGitHubLink ? "noopener noreferrer" : undefined}
                  className="underline nx-text-primary-600 hover:nx-text-primary-700"
                  {...props}
                >
                  {children}
                </a>
              );
            }

            // Internal links (like anchor links) render normally
            return (
              <a href={href} {...props}>
                {children}
              </a>
            );
          },
        }}
      />
    </div>
  );
}
