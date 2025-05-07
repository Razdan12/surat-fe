import React from "react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };
  
  return (
    <div className="join mt-4">
      <button
        className="join-item btn"
        onClick={handlePrev}
        disabled={page === 1}
      >
        «
      </button>
      <button className="join-item btn cursor-default">Page {page}</button>
      <button
        className="join-item btn"
        onClick={handleNext}
        disabled={page === totalPages}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
