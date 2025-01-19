type MissionPaginationProps = {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
};

const MissionPagination = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
}: MissionPaginationProps) => {
  // totalPagesが0の場合の表示を考慮
  const isPaginationDisabled = totalPages === 0;

  return (
    <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
      <span>
        Page {isPaginationDisabled ? 0 : currentPage} of {totalPages}
      </span>
      <div className="flex space-x-2">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1 || isPaginationDisabled}
          className={`px-2 py-1 rounded ${
            currentPage === 1 || isPaginationDisabled
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          &lt;
        </button>
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages || isPaginationDisabled}
          className={`px-2 py-1 rounded ${
            currentPage === totalPages || isPaginationDisabled
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default MissionPagination;
