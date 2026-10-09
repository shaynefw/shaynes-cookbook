// Shared artwork for the tab icon, phone icon and link-preview cards.
// Uses only inline SVG so it renders inside next/og ImageResponse.

export const BRAND = {
  amber: "#d97706",
  amberLight: "#fbbf24",
  cream: "#fdf6e3",
  text: "#d4c9a8",
  dark: "#3d3425",
  darker: "#241e14",
};

/** A steaming bowl on an amber tile. */
export function BrandMark({
  size,
  rounded = true,
  tile = true,
}: {
  size: number;
  rounded?: boolean;
  tile?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      {tile && (
        <rect width="64" height="64" rx={rounded ? 14 : 0} fill={BRAND.amber} />
      )}
      <path
        d="M10 34H54C54 46.5 44 54 32 54C20 54 10 46.5 10 34Z"
        fill={BRAND.cream}
      />
      <path
        d="M24 27C20 23 28 19 24 13M32 27C28 23 36 19 32 13M40 27C36 23 44 19 40 13"
        fill="none"
        stroke={BRAND.cream}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
