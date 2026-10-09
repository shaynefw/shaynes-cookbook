import { BRAND, BrandMark } from "@/lib/brand";

export const OG_SIZE = { width: 1200, height: 630 };

/** Fit text into `max` characters: end on a full sentence if one fits, else a whole word. */
export function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const head = text.slice(0, max);
  const lastSentence = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "));
  if (lastSentence > max * 0.5) return head.slice(0, lastSentence + 1);
  return `${head.replace(/\s+\S*$/, "")}…`;
}

function Pill({ text, strong }: { text: string; strong?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        padding: "10px 24px",
        borderRadius: 999,
        fontSize: 26,
        color: strong ? BRAND.amberLight : BRAND.text,
        border: `2px solid ${strong ? BRAND.amber : "rgba(212,201,168,0.35)"}`,
        background: strong ? "rgba(217,119,6,0.18)" : "transparent",
      }}
    >
      {text}
    </div>
  );
}

/** The 1200x630 card shown when a link is shared in WhatsApp, SMS, etc. */
export function OgCard({
  title,
  blurb,
  facts,
  tags,
}: {
  title: string;
  blurb: string;
  facts: string[];
  tags: string[];
}) {
  const titleSize = title.length > 40 ? 64 : title.length > 26 ? 76 : 92;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 80px 60px 96px",
        position: "relative",
        color: BRAND.cream,
        background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.darker} 100%)`,
      }}
    >
      {/* amber edge */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 18,
          background: BRAND.amber,
        }}
      />
      {/* faint bowl watermark */}
      <div
        style={{
          position: "absolute",
          right: -30,
          bottom: -50,
          display: "flex",
          opacity: 0.1,
        }}
      >
        <BrandMark size={520} tile={false} />
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <BrandMark size={64} />
        <div
          style={{
            display: "flex",
            marginLeft: 20,
            fontSize: 28,
            letterSpacing: 5,
            color: BRAND.amberLight,
          }}
        >
          SHAYNE&apos;S COOKBOOK
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.08,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 32,
            lineHeight: 1.35,
            color: BRAND.text,
            maxWidth: 900,
          }}
        >
          {blurb}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        {facts.map((f) => (
          <Pill key={f} text={f} strong />
        ))}
        {tags.map((t) => (
          <Pill key={t} text={t} />
        ))}
      </div>
    </div>
  );
}
