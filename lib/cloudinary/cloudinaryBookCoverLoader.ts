import type { ImageLoaderProps } from "next/image";

const ASPECT_RATIO = 450 / 320;

export const cloudinaryBookCoverLoader = ({
  src,
  width,
  quality,
}: ImageLoaderProps) => {
  const height = Math.round(width * ASPECT_RATIO);

  return `https://res.cloudinary.com/dxbtkm8zr/image/upload/w_${width},h_${height},c_fill,g_auto,q_${
    quality || "auto"
  },f_auto/${src}`;
};
