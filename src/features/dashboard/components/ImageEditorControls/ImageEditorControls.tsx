import { useCallback, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Control } from "@/shared/components/Control/Control";
import styles from "./ImageEditorControls.module.scss";
import { DEFAULT_VALUES } from "../../config";

type LocalValues = {
  width: number | string;
  height: number | string;
  grayscale: number;
  blur: number;
};

type ImageEditorControlsProps = {
  urlWidth: number;
  urlHeight: number;
  urlGrayscale: number;
  urlBlur: number;
};

const IMAGE_CONSTRAINTS = {
  width: { min: 50, max: 2000 },
  height: { min: 50, max: 2000 },
  grayscale: { min: 0, max: 100, step: 1 },
  blur: { min: 0, max: 10, step: 0.1 },
};

const LABELS = {
  width: `Width (${IMAGE_CONSTRAINTS.width.min}-${IMAGE_CONSTRAINTS.width.max}px)`,
  height: `Height (${IMAGE_CONSTRAINTS.height.min}-${IMAGE_CONSTRAINTS.height.max}px)`,
  grayscale: `Grayscale (${IMAGE_CONSTRAINTS.grayscale.min}-${IMAGE_CONSTRAINTS.grayscale.max}%)`,
  blur: `Blur (${IMAGE_CONSTRAINTS.blur.min}-${IMAGE_CONSTRAINTS.blur.max}px)`,
} as const;

/**
 * Image editor controls component syncs with the URL search parameters.
 * Allows users to adjust image properties with debounced updates to the URL
 */
export function ImageEditorControls({
  urlWidth,
  urlHeight,
  urlGrayscale,
  urlBlur,
}: ImageEditorControlsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const debounceTimerRef = useRef<number | null>(null);
  const isUserInteractingRef = useRef(false);

  // Local state for immediate UI updates
  const [localValues, setLocalValues] = useState<LocalValues>({
    width: urlWidth,
    height: urlHeight,
    grayscale: urlGrayscale,
    blur: urlBlur,
  });

  /**
   * Debounced function to update URL search params
   * Waits for 300ms of inactivity before applying changes
   * This prevents excessive URL updates while the user is typing
   */
  const debouncedUpdateSearchParams = useCallback(
    (newValues: Partial<typeof localValues>) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const updatedParams = new URLSearchParams(searchParams);

        Object.entries(newValues).forEach(([key, value]) => {
          if (value !== DEFAULT_VALUES[key as keyof typeof DEFAULT_VALUES]) {
            updatedParams.set(key, value.toString());
          } else {
            updatedParams.delete(key);
          }
        });

        setSearchParams(updatedParams);
        isUserInteractingRef.current = false; // Mark interaction as complete
      }, 300) as unknown as number;
    },
    [searchParams, setSearchParams]
  );

  // Handle number inputs differently - allow invalid intermediate values during typing
  const handleNumberInputChange = useCallback(
    (key: keyof Pick<LocalValues, "width" | "height">, value: string) => {
      isUserInteractingRef.current = true;

      // Handle empty input - allow it temporarily for better UX
      if (value === "") {
        // Store empty string for empty state, but don't update URL
        setLocalValues((prev) => ({ ...prev, [key]: value }));
        return;
      }

      const numValue = Number(value);
      setLocalValues((prev) => ({ ...prev, [key]: numValue }));

      // Only update URL if the value is valid and within constraints
      if (
        numValue >= IMAGE_CONSTRAINTS[key].min &&
        numValue <= IMAGE_CONSTRAINTS[key].max
      ) {
        debouncedUpdateSearchParams({ [key]: numValue });
      }
    },
    [debouncedUpdateSearchParams]
  );

  // Handle range inputs
  const handleRangeInputChange = useCallback(
    (key: keyof Pick<LocalValues, "grayscale" | "blur">, value: number) => {
      isUserInteractingRef.current = true;

      setLocalValues((prev) => ({ ...prev, [key]: value }));
      debouncedUpdateSearchParams({ [key]: value });
    },
    [debouncedUpdateSearchParams]
  );

  // Only sync with URL when it's NOT a user interaction (browser back/forward)
  useEffect(() => {
    if (!isUserInteractingRef.current) {
      setLocalValues({
        width: urlWidth,
        height: urlHeight,
        grayscale: urlGrayscale,
        blur: urlBlur,
      });
    }
  }, [urlWidth, urlHeight, urlGrayscale, urlBlur]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const onReset = useCallback(() => {
    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    isUserInteractingRef.current = true;
    setLocalValues(DEFAULT_VALUES);
    setSearchParams(new URLSearchParams());

    // Reset interaction flag after a brief delay
    setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 100);
  }, [setSearchParams]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <Control label={LABELS.width}>
          <input
            type="number"
            value={localValues.width}
            onChange={(e) => handleNumberInputChange("width", e.target.value)}
            className={styles.numberInput}
            min={IMAGE_CONSTRAINTS.width.min}
            max={IMAGE_CONSTRAINTS.width.max}
          />
        </Control>

        <Control label={LABELS.height}>
          <input
            type="number"
            value={localValues.height}
            onChange={(e) => handleNumberInputChange("height", e.target.value)}
            className={styles.numberInput}
            min={IMAGE_CONSTRAINTS.height.min}
            max={IMAGE_CONSTRAINTS.height.max}
          />
        </Control>

        <Control label={LABELS.grayscale}>
          <input
            type="range"
            min={IMAGE_CONSTRAINTS.grayscale.min}
            max={IMAGE_CONSTRAINTS.grayscale.max}
            step={IMAGE_CONSTRAINTS.grayscale.step}
            value={localValues.grayscale}
            onChange={(e) =>
              handleRangeInputChange("grayscale", Number(e.target.value))
            }
            className={styles.rangeInput}
          />
          <span className={styles.value}>{localValues.grayscale}%</span>
        </Control>

        <Control label={LABELS.blur}>
          <input
            type="range"
            min={IMAGE_CONSTRAINTS.blur.min}
            max={IMAGE_CONSTRAINTS.blur.max}
            step={IMAGE_CONSTRAINTS.blur.step}
            value={localValues.blur}
            onChange={(e) =>
              handleRangeInputChange("blur", Number(e.target.value))
            }
            className={styles.rangeInput}
          />
          <span className={styles.value}>{localValues.blur}px</span>
        </Control>
        <button className="red-btn" onClick={onReset}>
          Reset All
        </button>
      </div>
    </div>
  );
}
