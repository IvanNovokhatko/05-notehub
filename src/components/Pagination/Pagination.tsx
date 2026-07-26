import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from './Pagination.module.css';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

interface PaginationProps {
  pageCount: number;
  forcePage: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({ pageCount, forcePage, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      previousLabel={'←'}
      nextLabel={'→'}
      breakLabel={'...'}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={(data: { selected: number }) => onPageChange(data.selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.pageItem}
      previousClassName={css.pageItem}
      nextClassName={css.pageItem}
      breakClassName={css.pageItem}
      forcePage={forcePage}
    />
  );
}
