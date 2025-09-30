import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePicsumImages } from "./usePicsumImages";

const mockImages = [
  {
    id: "1",
    author: "Test Author 1",
    width: 1200,
    height: 800,
    url: "test-url-1",
  },
  {
    id: "2",
    author: "Test Author 2",
    width: 1000,
    height: 600,
    url: "test-url-2",
  },
];

describe("usePicsumImages", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  globalThis.fetch = vi.fn();

  it("should fetch and display images on initial load", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockImages,
    } as Response);

    const { result } = renderHook(() => usePicsumImages());

    // Wait for the async operation to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(result.current.images).toEqual(mockImages);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.pagination.currentPage).toBe(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://picsum.photos/v2/list?page=1&limit=15"
    );
  });

  it("should calculate pagination info correctly", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockImages,
    } as Response);

    const { result } = renderHook(() => usePicsumImages());

    // Wait for initial load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    const pagination = result.current.pagination;

    expect(pagination.totalPages).toBe(7); // Math.ceil(100 / 15)
    expect(pagination.currentPage).toBe(1);
    expect(pagination.hasNext).toBe(true);
    expect(pagination.hasPrev).toBe(false);
  });

  it("should update pagination state when loading different pages", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockImages,
    } as Response);

    const { result } = renderHook(() => usePicsumImages());

    // Wait for initial load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(result.current.pagination.currentPage).toBe(1);
    expect(result.current.pagination.hasNext).toBe(true);
    expect(result.current.pagination.hasPrev).toBe(false);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: "30",
          author: "Test Author 30",
          width: 800,
          height: 600,
          url: "test-url-30",
        },
      ],
    } as Response);

    await act(async () => {
      await result.current.loadPage(3);
    });

    expect(result.current.pagination.currentPage).toBe(3);
    expect(result.current.pagination.hasPrev).toBe(true);
    expect(result.current.pagination.hasNext).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://picsum.photos/v2/list?page=3&limit=15"
    );
  });
});
