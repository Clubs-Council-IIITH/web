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
  Grid,
} from "@mui/material";
import DocItem from "./DocItem";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import Icon from "components/Icon";

import { useRouter } from "next/navigation";

dayjs.extend(customParseFormat);

export default function DocsList({ allFiles, priviliged = false }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [version, setVersion] = useState(null);

  const router = useRouter();

  const handleViewClick = (file) => {
    setSelectedFile(file);
    setVersion(file.latestVersion);
  };
  const handleViewClose = () => {
    setSelectedFile(null);
    setVersion(null);
  };

  const formatDate = (dateString) => {
    try {
      const date = dayjs(
        dateString.replace(" IST", ""),
        "YYYY-MM-DD HH:mm:ss",
        true,
      );
      if (!date.isValid()) {
        console.error("Invalid date parsing for:", dateString);
        return dateString; // Return original string if parsing fails
      }
      return date.format("hh:mm A, DD MMMM YYYY IST");
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString; // Return original string if there's an error
    }
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography variant="h3" sx={{ mb: 2, ml: 1 }}>
          Important Documents
        </Typography>
        {priviliged ? (
          <Button
            variant="contained"
            align="right"
            sx={{ minWidth: 100, minHeight: 50, m: 3 }}
            onClick={() => router.push(`/docs/new`)}
            startIcon={<Icon variant="add" />}
          >
            Add New File
          </Button>
        ) : null}
      </Grid>
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
                  <Grid container spacing={1.5} justifyContent="flex-end">
                    {priviliged && (
                      <Grid item>
                        <Button
                          variant="contained"
                          sx={{ minWidth: 100 }}
                          onClick={() => router.push(`/docs/${file._id}`)}
                        >
                          Edit
                        </Button>
                      </Grid>
                    )}
                    <Grid item>
                      <Button
                        variant="outlined"
                        sx={{ minWidth: 100 }}
                        onClick={() => handleViewClick(file)}
                      >
                        View
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedFile ? (
        <DocItem
          file={selectedFile}
          version={version}
          versionChange={setVersion}
          maxVersion={selectedFile.latestVersion}
          onClose={handleViewClose}
          open={Boolean(selectedFile)}
        />
      ) : null}
    </>
  );
}
