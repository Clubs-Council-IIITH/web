"use client";

import { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import DocItem from "./DocItem";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { useRouter } from "next/navigation";

dayjs.extend(customParseFormat);

export default function DocsList({ allFiles, priviliged = false }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const router = useRouter();

  const handleViewClick = (file) => {
    setSelectedFile(file);
  };
  const handleViewClose = () => {
    setSelectedFile(null);
  };

  const formatDate = (dateString) => {
    try {
      const date = dayjs(
        dateString.replace(" IST", ""),
        "DD-MM-YYYY hh:mm A",
        true
      );
      if (!date.isValid()) {
        console.error("Invalid date parsing for:", cleanDateString);
        return dateString; // Return original string if parsing fails
      }
      return date.format("hh:mm:ss A, DD MMMM YYYY");
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString; // Return original string if there's an error
    }
  };

  return (
    <>
      <Typography variant="h3" sx={{ mb: 2, ml: 1 }}>
        Important Documents
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell align="right" sx={{ pr: 7.5 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allFiles?.map((file, index) => (
              <TableRow key={index}>
                <TableCell>{file.title}</TableCell>
                <TableCell>{formatDate(file.modifiedTime)}</TableCell>
                <TableCell align="right">
                  {priviliged ? (
                    <Button
                      variant="contained"
                      sx={{ minWidth: 100, mr: 1.5 }}
                      onClick={() => router.push(`/docs/${file._id}`)}
                    >
                      Edit
                    </Button>
                  ) : null}
                  <Button
                    variant="outlined"
                    sx={{ minWidth: 100, mr: 1 }}
                    onClick={() => handleViewClick(file)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedFile ? (
        <DocItem
          file={selectedFile}
          onClose={handleViewClose}
          open={Boolean(selectedFile)}
        />
      ) : null}
    </>
  );
}
