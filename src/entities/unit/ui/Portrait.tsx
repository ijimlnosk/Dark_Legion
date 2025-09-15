export function Portrait({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: string;
  height: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-black/30 shadow-[0_0_0_1px_rgba(0,0,0,0.3)]">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="block  object-cover object-center brightness-[0.9]"
        style={{ width: width, height: height }}
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/40" />
    </div>
  );
}
