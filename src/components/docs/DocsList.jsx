'use client';

import { useState, Error } from 'react';
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import DocItem from './DocItem';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { useRouter } from 'next/navigation';

import { useToast } from 'components/Toast';
import Icon from 'components/Icon';
import DocForm from 'components/docs/DocForm';

import { deleteStorageFile } from "actions/storagefiles/delete/server_action";

dayjs.extend(customParseFormat)

export default function DocsList({ allFiles, priviliged = false }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editFile, setEditFile] = useState(null);

  const { triggerToast } = useToast();
  const router = useRouter();

  const handleViewClick = (file) => {
    setSelectedFile(file);
  };
  const handleViewClose = () => {
    setSelectedFile(null);
  };

  const handleEditClick = (file) => {
    setEditFile(file);
    setShowForm(true);
  };
  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditFile(null);
    setShowForm(false);
  };

  async function handleDeleteClick(file) {
    try {
      if (!file) {
        throw new Error("File not found to delete");
      }
      const res = await deleteStorageFile(file._id);
      if (res.error) {
        throw new Error("Deleting file from database failed!");
      }
      triggerToast({
        title: 'Success!',
        messages: ['Document deleted.'],
        severity: 'success',
      });
      router.refresh();
    } catch (error) {
      triggerToast({
        title: 'Error',
        messages: [error.message],
        severity: 'error',
      });
    }
  };


  const formatDate = (dateString) => {
    try {
      const date = dayjs(dateString.replace(' IST', ''), 'DD-MM-YYYY hh:mm A', true);
      if (!date.isValid()) {
        console.error('Invalid date parsing for:', cleanDateString);
        return dateString; // Return original string if parsing fails
      }
      return date.format('hh:mm:ss A, DD MMMM YYYY');
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString; // Return original string if there's an error
    }
  };


  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography variant="h3" sx={{mb: 2}}>Import Documents</Typography>
        { priviliged ? (
          <Button
            variant="contained"
            align="right"
            sx={{ minWidth: 100, minHeight: 50, m: 3 }}
            onClick={handleAddClick}
            startIcon={<Icon variant="add" />}
          >
            Add New File
          </Button>
        ) : null }
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Modified Date</TableCell>
              <TableCell align="right" sx={{ pr: 7.5 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allFiles?.map((file, index) => (
              <TableRow key={index}>
                <TableCell>{file.title}</TableCell>
                <TableCell>
                  {formatDate(file.modifiedTime)}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    sx={{ minWidth: 100, mr: 3  }}
                    onClick={() => handleViewClick(file)}
                  >
                    View
                  </Button>
                  { priviliged ? (
                    <>
                      <IconButton
                        onClick={() => handleEditClick(file)}
                        sx={{ fontSize: '1.25rem', minWidth: 30}}
                      >
                        <Icon variant="edit" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(file)}
                        sx={{ fontSize: '1.25rem', minWidth: 30}}
                      >
                        <Icon variant="delete" />
                      </IconButton>
                    </>
                  ) : null }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showForm ? (
        <DocForm
          editFile={editFile}
          onClose={handleFormClose}
          open={showForm}
        />
      ): null}
      {selectedFile ? (
        <DocItem
          editFile={selectedFile}
          onClose={handleViewClose}
          open={Boolean(selectedFile)}
          priviliged={priviliged}
        />
      ): null}
    </>
  );
}
