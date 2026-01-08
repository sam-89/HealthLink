import React, { ReactNode, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns3, X } from 'lucide-react';

type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => string | number | null | undefined;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  resizable?: boolean;
  hideable?: boolean;
  minWidth?: number;
  width?: number;
  className?: string;
}

export interface BulkAction<T> {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  onAction: (selectedRows: T[]) => void;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
  className?: string;
  selectable?: boolean;
  bulkActions?: BulkAction<T>[];
  getRowId?: (row: T) => string;
  onSelectionChange?: (selectedRows: T[]) => void;
}

interface SortState {
  column: string | null;
  direction: SortDirection;
}

export function DataTable<T>({
  data,
  columns,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  onRowClick,
  emptyState,
  className,
  selectable = false,
  bulkActions = [],
  getRowId,
  onSelectionChange,
}: DataTableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    const visibility: Record<string, boolean> = {};
    columns.forEach((col) => {
      visibility[col.id] = true;
    });
    return visibility;
  });
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const widths: Record<string, number> = {};
    columns.forEach((col) => {
      widths[col.id] = col.width || 150;
    });
    return widths;
  });
  const [resizing, setResizing] = useState<{ columnId: string; startX: number; startWidth: number } | null>(null);

  // Helper to get row ID
  const getRowIdFn = useCallback((row: T, index: number): string => {
    if (getRowId) return getRowId(row);
    if ((row as any).id) return String((row as any).id);
    return String(index);
  }, [getRowId]);

  // Get selected rows
  const getSelectedRows = useCallback((): T[] => {
    return data.filter((row, index) => selectedRowIds.has(getRowIdFn(row, index)));
  }, [data, selectedRowIds, getRowIdFn]);

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(getSelectedRows());
    }
  }, [selectedRowIds, onSelectionChange, getSelectedRows]);

  // Clear selection when data changes
  useEffect(() => {
    setSelectedRowIds(new Set());
  }, [data]);

  // Handle column visibility toggle
  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  // Show all columns
  const showAllColumns = () => {
    const visibility: Record<string, boolean> = {};
    columns.forEach((col) => {
      visibility[col.id] = true;
    });
    setColumnVisibility(visibility);
  };

  // Get visible columns
  const visibleColumns = columns.filter((col) => columnVisibility[col.id] !== false);
  const hideableColumns = columns.filter((col) => col.hideable !== false);
  const hiddenCount = hideableColumns.filter((col) => !columnVisibility[col.id]).length;

  // Handle sorting
  const handleSort = (columnId: string) => {
    setSortState((prev) => {
      if (prev.column === columnId) {
        if (prev.direction === 'asc') return { column: columnId, direction: 'desc' };
        if (prev.direction === 'desc') return { column: null, direction: null };
      }
      return { column: columnId, direction: 'asc' };
    });
    setCurrentPage(1);
  };

  // Handle row selection
  const handleRowSelect = (rowId: string, checked: boolean) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(rowId);
      } else {
        next.delete(rowId);
      }
      return next;
    });
  };

  // Handle select all (current page)
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageRowIds = paginatedData.map((row, index) => {
        const dataIndex = (currentPage - 1) * pageSize + index;
        return getRowIdFn(row, dataIndex);
      });
      setSelectedRowIds((prev) => new Set([...prev, ...pageRowIds]));
    } else {
      const pageRowIds = new Set(
        paginatedData.map((row, index) => {
          const dataIndex = (currentPage - 1) * pageSize + index;
          return getRowIdFn(row, dataIndex);
        })
      );
      setSelectedRowIds((prev) => new Set([...prev].filter((id) => !pageRowIds.has(id))));
    }
  };

  // Handle select all rows across all pages
  const handleSelectAllRows = () => {
    const allRowIds = data.map((row, index) => getRowIdFn(row, index));
    setSelectedRowIds(new Set(allRowIds));
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedRowIds(new Set());
  };

  // Get cell value for sorting
  const getCellValue = (row: T, column: Column<T>): string | number | null | undefined => {
    if (column.accessorFn) return column.accessorFn(row);
    if (column.accessorKey) return row[column.accessorKey] as string | number | null | undefined;
    return null;
  };

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (!sortState.column || !sortState.direction) return 0;

    const column = columns.find((col) => col.id === sortState.column);
    if (!column) return 0;

    const aValue = getCellValue(a, column);
    const bValue = getCellValue(b, column);

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    }

    return sortState.direction === 'desc' ? -comparison : comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  // Check if all rows on current page are selected
  const allPageRowsSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row, index) => {
      const dataIndex = (currentPage - 1) * pageSize + index;
      return selectedRowIds.has(getRowIdFn(row, dataIndex));
    });

  const somePageRowsSelected =
    paginatedData.some((row, index) => {
      const dataIndex = (currentPage - 1) * pageSize + index;
      return selectedRowIds.has(getRowIdFn(row, dataIndex));
    }) && !allPageRowsSelected;

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Handle page size change
  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1);
  };

  // Column resizing handlers
  const handleResizeStart = (e: React.MouseEvent, columnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing({
      columnId,
      startX: e.clientX,
      startWidth: columnWidths[columnId],
    });
  };

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - resizing.startX;
      const column = columns.find((col) => col.id === resizing.columnId);
      const minWidth = column?.minWidth || 80;
      const newWidth = Math.max(minWidth, resizing.startWidth + diff);

      setColumnWidths((prev) => ({
        ...prev,
        [resizing.columnId]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, columns]);

  // Sort indicator component
  const SortIcon = ({ columnId }: { columnId: string }) => {
    if (sortState.column !== columnId) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }
    if (sortState.direction === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    }
    return <ArrowDown className="h-4 w-4" />;
  };

  const selectedCount = selectedRowIds.size;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {/* Bulk Actions Bar */}
        {selectable && selectedCount > 0 ? (
          <div className="flex items-center gap-3 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">
                {selectedCount} selected
              </span>
              {selectedCount < data.length && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAllRows}
                  className="h-7 text-xs text-primary hover:text-primary"
                >
                  Select all {data.length}
                </Button>
              )}
            </div>
            <div className="h-4 w-px bg-primary/20" />
            <div className="flex items-center gap-1">
              {bulkActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant || 'ghost'}
                  size="sm"
                  onClick={() => action.onAction(getSelectedRows())}
                  className="h-7 gap-1.5"
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearSelection}
              className="h-7 w-7 ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div />
        )}

        {/* Column visibility dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Columns3 className="h-4 w-4" />
              Columns
              {hiddenCount > 0 && (
                <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                  {hiddenCount} hidden
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {hideableColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={columnVisibility[column.id]}
                onCheckedChange={() => toggleColumnVisibility(column.id)}
              >
                {column.header}
              </DropdownMenuCheckboxItem>
            ))}
            {hiddenCount > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={false}
                  onCheckedChange={showAllColumns}
                  className="font-medium"
                >
                  Show all columns
                </DropdownMenuCheckboxItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="relative w-full overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm" style={{ minWidth: 'max-content' }}>
          <thead className="[&_tr]:border-b bg-muted/30">
            <tr>
              {selectable && (
                <th className="h-12 w-12 px-4 text-left align-middle">
                  <Checkbox
                    checked={allPageRowsSelected}
                    ref={(el) => {
                      if (el) {
                        (el as any).indeterminate = somePageRowsSelected;
                      }
                    }}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all rows on this page"
                  />
                </th>
              )}
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    'h-12 px-4 text-left align-middle font-medium text-muted-foreground relative select-none',
                    column.sortable && 'cursor-pointer hover:bg-muted/50 transition-colors',
                    column.className
                  )}
                  style={{ width: columnWidths[column.id], minWidth: column.minWidth || 80 }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="truncate">{column.header}</span>
                    {column.sortable && <SortIcon columnId={column.id} />}
                  </div>
                  {column.resizable && (
                    <div
                      className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-primary/30 transition-colors"
                      onMouseDown={(e) => handleResizeStart(e, column.id)}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + (selectable ? 1 : 0)} className="h-24 text-center">
                  {emptyState || <span className="text-muted-foreground">No results.</span>}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const dataIndex = (currentPage - 1) * pageSize + index;
                const rowId = getRowIdFn(row, dataIndex);
                const isSelected = selectedRowIds.has(rowId);

                return (
                  <tr
                    key={rowId}
                    className={cn(
                      'border-b transition-colors',
                      onRowClick && 'cursor-pointer',
                      isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="w-12 px-4 align-middle">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleRowSelect(rowId, !!checked)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}
                    {visibleColumns.map((column) => (
                      <td
                        key={column.id}
                        className={cn('p-4 align-middle', column.className)}
                        style={{ width: columnWidths[column.id], minWidth: column.minWidth || 80 }}
                      >
                        {column.cell
                          ? column.cell(row)
                          : column.accessorKey
                          ? String(row[column.accessorKey] ?? '')
                          : column.accessorFn
                          ? String(column.accessorFn(row) ?? '')
                          : null}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page:</span>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {startIndex + 1}-{Math.min(startIndex + pageSize, sortedData.length)} of {sortedData.length}
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}