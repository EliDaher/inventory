import React, { useState, useMemo, useEffect } from "react";
import SearchInput from "./SearchInput";

interface TableProps {
  data: { [key: string]: string | number }[];
  columns: string[];
  onRowClick?: (row: { [key: string]: string | number }) => void;
}

const Table: React.FC<TableProps> = ({ data, columns, onRowClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const rowsPerPage = 15;

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      columns.some((col) =>
        String(row[col]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data, columns]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const isRowSelected = (row: any) => {
    return selectedRows.some((r) => JSON.stringify(r) === JSON.stringify(row));
  };

  const toggleRowSelection = (row: any) => {
    setSelectedRows((prev) => {
      const isSelected = isRowSelected(row);
      if (isSelected) {
        return prev.filter((r) => JSON.stringify(r) !== JSON.stringify(row));
      } else {
        return [...prev, row];
      }
    });
  };

  useEffect(()=>{
    console.log(selectedRows)
  }, [selectedRows])

  return (
    <div className="space-y-4">
      <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="ابحث في الجدول" />

      <div className="overflow-x-auto rounded-2xl shadow-md transition-all duration-300 border border-primary/30">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-4 text-left text-sm font-inter font-semibold tracking-wide uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 text-text dark:text-dark-text divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-primary-hover/10 dark:hover:bg-primary-hover/10 transition-colors cursor-pointer text-center"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    className="p-2"
                    key={col}
                    onClick={(e) => col === "بيع" && e.stopPropagation()}
                  >
                    {col === "بيع" ? (
                      <input
                        type="checkbox"
                        className="w-full cursor-pointer"
                        checked={isRowSelected(row)}
                        onChange={() => toggleRowSelection(row)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      row[col]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-row-reverse justify-center items-center gap-2 text-sm font-inter">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="font-cairo bg-primary px-3 py-1 rounded-md dark:bg-dark-primary text-gray-700 dark:text-gray-200 hover:bg-primary-hover dark:hover:bg-dark-primary-hover disabled:opacity-40"
        >
          السابق
        </button>
        <span className="font-cairo text-gray dark:text-gray-300">
          صفحة {currentPage} من {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="font-cairo bg-primary px-3 py-1 rounded-md dark:bg-dark-primary text-gray-700 dark:text-gray-200 hover:bg-primary-hover dark:hover:bg-dark-primary-hover disabled:opacity-40"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default Table;
