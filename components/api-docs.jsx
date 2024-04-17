import useSWRImmutable from "swr";
import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import stringWidth from "string-width";

export default function ApiDocs() {
  const fetcher = (url) => fetch(url).then((r) => r.text());
  const apiUrl =
    "https://raw.githubusercontent.com/openmrs/openmrs-esm-core/main/packages/framework/esm-framework/docs/API.md";
  const { data, error } = useSWRImmutable(apiUrl, fetcher);

  const transformMarkdown = (markdown) => {
    const lines = markdown.split("\n");
    const transformedMarkdown = lines.slice(3).join("\n");
    return transformedMarkdown.replace(/\(API.md#(\w+)\)/g, "(/docs/framework-api-reference#$1)");
  };

  if (error) return <div className="py-4">Failed to load</div>;
  if (!data) return <div className="py-4">Loading...</div>;
  if (data.length === 0) return <div className="py-4">.</div>;

  const transformedMarkdown = transformMarkdown(data);

  return (
    <div className="py-4 space-y-2 prose dark:prose-invert prose-table:border-neutral-950">
      <Markdown
        children={transformedMarkdown}
        className="markdown"
        remarkPlugins={[
          [remarkGithub, { repository: "https://github.com/openmrs/openmrs-esm-core" }],
          [remarkGfm, { stringLength: stringWidth }],
        ]}
        rehypePlugins={[rehypeSlug]}
      />
    </div>
  );
}
