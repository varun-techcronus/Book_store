import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Grid, Stack, TextField, Typography, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export const AddBook = () => {
  const navigate = useNavigate();
  // const location = useLocation();

  // const bookId = location.pathname.split("/")[2];

  const [addBook, setAddBook] = useState({
    title: '',
    desc: '',
    cover: null,
    price: '',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cover') {
      setAddBook((prev) => ({
        ...prev,
        cover: files.length > 0 ? files[0] : null,
      }));
    } else {
      setAddBook((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', addBook.title);
      formData.append('desc', addBook.desc);
      formData.append('price', parseFloat(addBook.price));
      if (addBook.cover) {
        formData.append('cover', addBook.cover);
      }

      await axios.post('http://localhost:8080/books', formData);

      setSnackbarMessage('Book added successfully');
      setSnackbarOpen(true);
      navigate('/');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item md={6} marginLeft={'5rem'}>
        <Stack className="form" spacing={2} width={'25rem'} marginTop={'2rem'}>
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'center',
              fontWeight: 'bold',
              mt: 3,
              fontSize: '25px',
              marginBottom: '1rem',
            }}
          >
            Add a Book
          </Typography>
          <TextField
            id="title"
            label="Title"
            variant="outlined"
            name="title"
            onChange={handleChange}
          />
          <TextField
            id="desc"
            label="Description"
            variant="outlined"
            name="desc"
            onChange={handleChange}
          />

          <TextField
            id="cover"
            variant="outlined"
            name="cover"
            type="file"
            placeholder="Cover Photo"
            onChange={handleChange}
          />

          <TextField
            id="price"
            label="Price"
            variant="outlined"
            name="price"
            onChange={handleChange}
            type="number"
          />

          <Box display="flex" justifyContent="left" marginTop="2rem">
            <Button variant="outlined" width="10rem" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Stack>
      </Grid>

      {/* Snackbar for showing the book added message */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};
