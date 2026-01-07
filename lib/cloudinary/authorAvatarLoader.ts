import type { ImageLoaderProps } from "next/image";

export const authorAvatarLoader = ({
  src,
  width,
  quality,
}: ImageLoaderProps) => {
  return `https://res.cloudinary.com/dxbtkm8zr/image/upload/w_${width},c_limit,q_${
    quality || "auto"
  },f_auto/${src}`;
};
