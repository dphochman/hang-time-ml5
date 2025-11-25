'use client';

export type AnalysisComment = {
  id: string;
  text: string;
};

export default function AnalysisPanel({ comments }: { comments: AnalysisComment[] | null }) {
  if (!comments) return <p className="muted">Upload a video and click Analyze to see insights.</p>;
  if (comments.length === 0) return <p className="muted">No insights yet.</p>;
  return (
    <ul className="comments">
      {comments.map(c => <li key={c.id}>{c.text}</li>)}
    </ul>
  );
}
