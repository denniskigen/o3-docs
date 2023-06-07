import useSWRImmutable from "swr";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function LatestRelease({ repo }) {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const apiUrl = `https://api.github.com/repos/openmrs/${repo}/releases`;
  const repoUrl = `https://github.com/openmrs/${repo}/releases`;
  const { data, error } = useSWRImmutable(apiUrl, fetcher);

  if (error) return <div className="py-4">Failed to load</div>;
  if (!data) return <div className="py-4">Loading...</div>;
  if (data.length === 0) return <div className="py-4">No releases found.</div>;

  const latestRelease = data && data[0];

  return (
    <div className="py-4 space-y-2">
      <h1 className="font-bold text-lg">{latestRelease?.name}</h1>
      <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
        {latestRelease?.body}
      </ReactMarkdown>

      {data?.length > 1 ? (
        <h1 className="py-2">
          <a
            className="text-sky-500 underline"
            href={repoUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Older releases
          </a>
        </h1>
      ) : null}
    </div>
  );
}
