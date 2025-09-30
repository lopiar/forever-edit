import React from "react";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { ImageEditorControls } from "../../components/ImageEditorControls/ImageEditorControls";
import { ImagePreview } from "../../components/ImagePreview/ImagePreview";
import styles from "./EditPage.module.scss";
import { routes } from "@/app/routes/config";
import { DEFAULT_VALUES } from "../../config";

const EditPage: React.FC = () => {
  const { imageId } = useLoaderData();
  const [searchParams] = useSearchParams();

  // Get values from URL params or use defaults
  const width = Number(searchParams.get("width")) || DEFAULT_VALUES.width;
  const height = Number(searchParams.get("height")) || DEFAULT_VALUES.height;
  const grayscale =
    Number(searchParams.get("grayscale")) || DEFAULT_VALUES.grayscale;
  const blur = Number(searchParams.get("blur")) || DEFAULT_VALUES.blur;

  return (
    <>
      <Link to={routes.dashboard}>Back</Link>
      <div className={styles.container}>
        <div className={styles.controlsColumn}>
          <ImageEditorControls
            urlWidth={width}
            urlHeight={height}
            urlGrayscale={grayscale}
            urlBlur={blur}
          />
        </div>

        <div className={styles.previewColumn}>
          <ImagePreview
            imageId={imageId}
            width={width}
            height={height}
            grayscale={grayscale}
            blur={blur}
          />
        </div>
      </div>
    </>
  );
};

export default EditPage;
