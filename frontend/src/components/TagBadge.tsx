type Props = {
  tag: string;
};

export default function TagBadge({ tag }: Props) {
  return (
    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 text-violet-700">
      {tag}
    </span>
  );
}
