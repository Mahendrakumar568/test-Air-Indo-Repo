import Image from "next/image";
import { images, type ImageKey } from "@/lib/images";
import { alts } from "@/lib/alts";

type Props = {
  slot: ImageKey;
  alt?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/** Renders an image slot through next/image (AVIF/WebP, responsive sizes). */
export function Img({ slot, alt, priority, sizes = "100vw", className }: Props) {
  const s = images[slot];
  return (
    <Image
      src={s.src}
      alt={alt ?? alts[slot]}
      width={s.width}
      height={s.height}
      priority={priority}
      sizes={sizes}
      className={className}
      quality={80}
    />
  );
}
