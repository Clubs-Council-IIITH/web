import { useState } from "react";

import {
    Table as MUITable,
    TableRow,
    TableBody,
    TableHead,
    TableCell,
    TableContainer,
    TablePagination,
} from "@mui/material";

export default function Table({ data, header: Header, row: Row, pagination = true }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.length) : 0;

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <TableContainer sx={{ borderRadius: 1 }}>
                <MUITable>
                    <TableHead>
                        <Header />
                    </TableHead>

                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, key) => (
                                <Row key={key} {...row} />
                            ))}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </MUITable>
            </TableContainer>

            {pagination ? (
                <TablePagination
                    rowsPerPageOptions={[10, 20, 30]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, value) => setPage(value)}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            ) : null}
        </>
    );
}
