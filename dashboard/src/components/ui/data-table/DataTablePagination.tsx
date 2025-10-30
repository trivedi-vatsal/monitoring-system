import { Button } from "@/components/Button"
import { cx } from "@/lib/utils"
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
} from "@remixicon/react"
import { Table } from "@tanstack/react-table"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSize: number
  totalRows?: number
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
}

export function DataTablePagination<TData>({
  table,
  pageSize,
  totalRows: externalTotalRows,
  onPaginationChange,
}: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex
  const totalRows = externalTotalRows ?? table.getFilteredRowModel().rows.length
  const pageCount = Math.ceil(totalRows / pageSize)
  
  const handlePageChange = (newPageIndex: number) => {
    if (onPaginationChange) {
      onPaginationChange(newPageIndex, pageSize)
    } else {
      table.setPageIndex(newPageIndex)
    }
  }
  
  const paginationButtons = [
    {
      icon: RiArrowLeftDoubleLine,
      onClick: () => handlePageChange(0),
      disabled: currentPage === 0,
      srText: "First page",
      mobileView: "hidden sm:block",
    },
    {
      icon: RiArrowLeftSLine,
      onClick: () => handlePageChange(currentPage - 1),
      disabled: currentPage === 0,
      srText: "Previous page",
      mobileView: "",
    },
    {
      icon: RiArrowRightSLine,
      onClick: () => handlePageChange(currentPage + 1),
      disabled: currentPage >= pageCount - 1,
      srText: "Next page",
      mobileView: "",
    },
    {
      icon: RiArrowRightDoubleLine,
      onClick: () => handlePageChange(pageCount - 1),
      disabled: currentPage >= pageCount - 1,
      srText: "Last page",
      mobileView: "hidden sm:block",
    },
  ]

  const firstRowIndex = currentPage * pageSize + 1
  const lastRowIndex = Math.min(totalRows, (currentPage + 1) * pageSize)

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm tabular-nums text-gray-500">
        {/* Empty div to maintain layout */}
      </div>
      <div className="flex items-center gap-x-6 lg:gap-x-8">
        <p className="hidden text-sm tabular-nums text-gray-500 sm:block">
          Showing{" "}
          <span className="font-medium text-gray-900 dark:text-gray-50">
            {totalRows > 0 ? firstRowIndex : 0}-{lastRowIndex}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-900 dark:text-gray-50">
            {totalRows}
          </span>
        </p>
        <div className="flex items-center gap-x-1.5">
          {paginationButtons.map((button, index) => (
            <Button
              key={index}
              variant="secondary"
              className={cx(button.mobileView, "p-1.5")}
              onClick={button.onClick}
              disabled={button.disabled}
            >
              <span className="sr-only">{button.srText}</span>
              <button.icon className="size-4 shrink-0" aria-hidden="true" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
