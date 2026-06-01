import { clsx } from "clsx";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  renderImage?: (props: { src: string; alt: string; className: string }) => React.ReactNode;
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export function Avatar({ src, alt = "", size = "md", className, renderImage }: AvatarProps) {
  const initials = alt
    ? alt
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (src) {
    if (renderImage) {
      return renderImage({
        src,
        alt,
        className: clsx("rounded-full object-cover", sizeClasses[size], className),
      });
    }
    return (
      <img
        src={src}
        alt={alt}
        className={clsx("rounded-full object-cover", sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full bg-[var(--bankng-surface-muted)] font-medium text-[var(--bankng-text-secondary)]",
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}