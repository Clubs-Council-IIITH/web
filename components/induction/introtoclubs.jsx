import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
    Grid,
    Box,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

export default function IntroToClubs({ jsonfile }) {
    return (
        <>
            {jsonfile ? (
                <Box display="flex" justifyContent="center" width="100%" p={2}>
                    <Grid container spacing={2}>
                        {
                            jsonfile.map((slot, index) => (
                                <Grid item xs={12} sm={6} lg={4}>
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell>{slot.header}</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {slot.rows.map((row) => (
                                                    <StyledTableRow key={row}>
                                                        <StyledTableCell component="th" scope="row">
                                                            {row}
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Box>
            ) : null}
        </>
    );
}