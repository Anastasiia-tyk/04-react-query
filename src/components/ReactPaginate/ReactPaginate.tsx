// src/components/ReactPaginate/ReactPaginate.tsx

import ReactPaginate from "react-paginate";

import css from '../App/App.module.css';

interface ReactPaginateProps {
    totalPages: number;
    setPage: (nextPage: number) => void;
    page: number;
}

export default function ReactPagination({ totalPages, setPage, page }: ReactPaginateProps) {
    return (
        <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
        />
    );
}
