import { useState, useEffect, useCallback } from "react";

export type Image = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

const IMAGES_PER_PAGE = 15;
const TOTAL_IMAGES = 100; // To simplify, assuming 100 images max

// Simple cache to store previously loaded pages
const pageCache = new Map<number, Image[]>();

export function usePicsumImages() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadPage = useCallback(async (page: number) => {
    // Check cache first
    const cachedImages = pageCache.get(page);
    if (cachedImages) {
      setImages(cachedImages);
      setCurrentPage(page);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${page}&limit=${IMAGES_PER_PAGE}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load images: ${response.status} ${response.statusText}`
        );
      }

      const images = await response.json();
      pageCache.set(page, images);

      setImages(images);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load images";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const pagination: PaginationInfo = {
    currentPage,
    totalPages: Math.ceil(TOTAL_IMAGES / IMAGES_PER_PAGE),
    hasNext: currentPage < Math.ceil(TOTAL_IMAGES / IMAGES_PER_PAGE),
    hasPrev: currentPage > 1,
  };

  return {
    images,
    loading,
    error,
    pagination,
    loadPage,
  };
}
