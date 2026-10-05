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
        if (b.t === "cta")
          return (
            <aside
              key={i}
              aria-label={b.eyebrow}
              className="relative my-9 overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-gold/15 via-purple-900/35 to-navy-950 p-7 text-center shadow-glow"
            >
              <div aria-hidden className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />
              <p className="relative text-[11px] font-black uppercase tracking-[0.24em] text-gold-400">{b.eyebrow}</p>
              <p className="relative mt-2 font-display text-[26px] font-extrabold leading-tight text-white">{b.title}</p>
              <p className="relative mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/75">{inline(b.text, `c${i}`)}</p>
              <a
                href={b.href}
                target="_blank"
                rel="noopener"
                className="relative mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 font-display text-[15px] font-extrabold text-navy-950 transition active:scale-[0.98]"
              >
                {b.label} <span aria-hidden>→</span>
              </a>
            </aside>
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
