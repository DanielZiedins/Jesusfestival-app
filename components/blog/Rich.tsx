import type { Block } from "@/lib/blog";

/**
 * Renders post blocks as real elements. Inline syntax supports [label](url),
 * **bold** and *italic* — parsed into React nodes rather than injected as HTML,
 * so post content can never become markup.
 */
function inline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  // Links first, then emphasis inside the remaining plain text.
  const linkRe = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  const emphasise = (chunk: string, k: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
    let cur = 0;
    let mm: RegExpExecArray | null;
    let j = 0;
    while ((mm = re.exec(chunk))) {
      if (mm.index > cur) parts.push(chunk.slice(cur, mm.index));
      if (mm[1]) parts.push(<strong key={`${k}-b${j}`} className="font-bold text-white">{mm[1]}</strong>);
      else parts.push(<em key={`${k}-i${j}`} className="italic">{mm[2]}</em>);
      cur = mm.index + mm[0].length;
      j++;
    }
    if (cur < chunk.length) parts.push(chunk.slice(cur));
    return parts;
  };

  while ((m = linkRe.exec(text))) {
    if (m.index > last) out.push(...emphasise(text.slice(last, m.index), `${keyBase}-t${i}`));
    const external = !m[2].includes("jesusfestival.app");
    out.push(
      <a
        key={`${keyBase}-l${i}`}
        href={m[2]}
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
        className="font-semibold text-gold-400 underline decoration-gold-400/40 underline-offset-2 hover:decoration-gold-400"
      >
        {m[1]}
      </a>,
    );
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) out.push(...emphasise(text.slice(last), `${keyBase}-t${i}`));
  return out;
}

export default function Rich({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === "h2")
          return (
            <h2 key={i} className="mt-9 font-display text-2xl font-bold leading-snug text-white sm:text-[26px]">
              {b.text}
            </h2>
          );
        if (b.t === "quote")
          return (
            <blockquote key={i} className="my-7 border-l-[3px] border-gold pl-5">
              <p className="font-display text-lg italic leading-relaxed text-white/90 sm:text-xl">
                &ldquo;{b.text}&rdquo;
              </p>
              <cite className="mt-2 block text-[12px] font-bold uppercase not-italic tracking-[0.18em] text-gold-400">
                {b.ref}
              </cite>
            </blockquote>
          );
        if (b.t === "list")
          return (
            <ul key={i} className="my-5 space-y-3">
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-3 text-[16.5px] leading-relaxed text-white/75">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span>{inline(it, `l${i}-${j}`)}</span>
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i} className="mt-5 text-[16.5px] leading-[1.75] text-white/75">
            {inline(b.text, `p${i}`)}
          </p>
        );
      })}
    </>
  );
}
