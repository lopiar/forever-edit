import { usePicsumImages } from "../../hooks/usePicsumImages";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner/LoadingSpinner";
import styles from "./ImageSelector.module.scss";
import { useNavigate, generatePath } from "react-router-dom";
import { routes } from "@/app/routes/config";

export function ImageSelector() {
  const { images, loading, pagination, loadPage } = usePicsumImages();
  const navigate = useNavigate();

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      loadPage(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      loadPage(pagination.currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    loadPage(page);
  };

  const renderPaginationNumbers = () => {
    const current = pagination.currentPage;
    const total = pagination.totalPages;
    const pages = [];

    // Show first page
    if (current > 3) {
      pages.push(1);
      if (current > 4) pages.push("...");
    }

    // Show 2 pages around current
    for (
      let i = Math.max(1, current - 2);
      i <= Math.min(total, current + 2);
      i++
    ) {
      pages.push(i);
    }

    // Show last page
    if (current < total - 2) {
      if (current < total - 3) pages.push("...");
      pages.push(total);
    }

    return pages.map((page, index) => (
      <button
        key={index}
        className={`${styles.pageButton} ${
          page === current ? styles.active : ""
        }`}
        onClick={() =>
          typeof page === "number" ? handlePageClick(page) : undefined
        }
        disabled={typeof page !== "number"}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>1. Select an Image</h2>
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={handlePrevPage}
            disabled={!pagination.hasPrev}
          >
            Previous
          </button>
          {renderPaginationNumbers()}
          <button
            className={styles.pageButton}
            onClick={handleNextPage}
            disabled={!pagination.hasNext}
          >
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading images..." />
      ) : (
        <div className={styles.imageGrid}>
          {images.map((image) => (
            <div
              className={styles.imageCard}
              key={image.id}
              onClick={() =>
                navigate(generatePath(routes.edit, { imageId: image.id }))
              }
            >
              <img
                src={`https://picsum.photos/id/${image.id}/300/200`}
                alt={`Photo by ${image.author}`}
                className={styles.image}
              />

              <div className={styles.imageInfo}>
                <p className={styles.author}>by {image.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
