import { useMemo } from "react";
import styles from "./ImagePreview.module.scss";
import { DEFAULT_VALUES } from "../../config";

type ImagePreviewProps = {
  imageId: string;
  width: number;
  height: number;
  grayscale: number;
  blur: number;
};

export function ImagePreview({
  imageId,
  width,
  height,
  grayscale,
  blur,
}: ImagePreviewProps) {
  // Always fetch image at base resolution
  const imageUrl = useMemo(
    () =>
      `https://picsum.photos/id/${imageId}/${DEFAULT_VALUES.width}/${DEFAULT_VALUES.height}`,
    [imageId]
  );

  // Calculate scale factors based on user input vs base dimensions
  const scaleX = width / DEFAULT_VALUES.width;
  const scaleY = height / DEFAULT_VALUES.height;

  const imageStyle = useMemo(
    () => ({
      filter: `grayscale(${grayscale}%) blur(${blur}px)`,
      transform: `scale(${scaleX}, ${scaleY})`,
      transformOrigin: "top left",
    }),
    [grayscale, blur, scaleX, scaleY]
  );

  return (
    <div className={styles.imageContainer}>
      <img
        src={imageUrl}
        alt={`Image ${imageId}`}
        style={imageStyle}
        className={styles.previewImage}
      />
    </div>
  );
}
