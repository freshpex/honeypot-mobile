import { useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 10;

export const usePagination = <T,>(items: T[], pageSize = DEFAULT_PAGE_SIZE) => {
  const [page, setPage] = useState(1);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize],
  );

  const currentPage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [currentPage, items, pageSize]);

  return {
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
    goNext: () => setPage((currentPage) => Math.min(currentPage + 1, totalPages)),
    goPrevious: () => setPage((currentPage) => Math.max(currentPage - 1, 1)),
    page: currentPage,
    pageItems,
    pageSize,
    setPage,
    totalItems: items.length,
    totalPages,
  };
};
