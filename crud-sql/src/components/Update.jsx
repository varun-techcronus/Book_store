import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Grid, Stack, TextField, Typography, Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

export const Update = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    title: '',
    desc: '',
    price: '',
    cover: null,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const resp = await axios.get(`http://localhost:8080/books/${id}`);
        const bookDetails = resp.data;

        setBookData((prevData) => ({
          ...prevData,
          title: bookDetails.title,
          desc: bookDetails.desc,
          price: bookDetails.price.toString(),
          cover: bookDetails.cover ? null : prevData.cover, // Set to null if no cover, otherwise keep current cover
        }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookDetails();
  }, [id]);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cover') {
      setBookData((prev) => ({
        ...prev,
        cover: files.length > 0 ? files[0] : null,
      }));
    } else {
      setBookData((prev) => ({
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
      formData.append('title', bookData.title);
      formData.append('desc', bookData.desc);
      formData.append('price', parseFloat(bookData.price));
      if (bookData.cover) {
        formData.append('cover', bookData.cover);
      }

      await axios.put(`http://localhost:8080/books/${id}`, formData);

      setSnackbarMessage('Book updated successfully');
      setSnackbarOpen(true);
      navigate('/');
    } catch (error) {
      console.error('Error updating book:', error);
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
            Update a Book
          </Typography>
          <TextField
            id="title"
            label="Title"
            variant="outlined"
            name="title"
            value={bookData.title} // Bind the value to bookData.title
            onChange={handleChange}
          />
          <TextField
            id="desc"
            label="Description"
            variant="outlined"
            name="desc"
            value={bookData.desc} // Bind the value to bookData.desc
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
            value={bookData.price}
            onChange={handleChange}
            type="number"
          />

          <Box display="flex" justifyContent="left" marginTop="2rem">
            <Button variant="outlined" width="10rem" onClick={handleSubmit}>
              Update
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
