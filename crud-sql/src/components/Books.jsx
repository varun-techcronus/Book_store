import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Box, AppBar, Toolbar, IconButton } from '@mui/material';

export const Books = () => {
    const [books, setBooks] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const resp = await axios.get("http://localhost:8080/books");
                setBooks(resp.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAllBooks();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/books/${id}`);
            setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
            setSnackbarOpen(true); // Open the Snackbar after successful deletion
        } catch (error) {
            console.error(error);
        }
    }

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            {/* <h2 style={{ marginLeft: "2rem" }}>TBS Book Store</h2> */}
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color='black' fontWeight='bold' fontSize='x-large'>
                            TBS Book Store
                        </Typography>
                        <Button variant="contained" className="add">
                            <Link
                                to="/add"
                                style={{
                                    textDecoration: "none",
                                    color: "white",
                                    fontWeight: "bolder",
                                }}
                            >
                                Add
                            </Link>
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>

            <div className="books" style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", margin: "auto" }} >
                {books.map(book => (
                    <Card key={book.id} className="book" sx={{ height: "15%", width: "30%", mx: 2, my: 2 }}>
                        {book.cover && (
                            <CardMedia
                                component="img"
                                alt="book image"
                                height='200rem'
                                width='30rem'
                                image={`http://localhost:8080/uploads/${book.cover}`}
                            />
                        )}
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {book.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {book.desc}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Price: {book.price}
                            </Typography>
                            <Box>
                                <Button variant="contained" color="primary" className="Update" sx={{ mx: 1, my: 1 }}>
                                    <Link
                                        to={`/update/${book.id}`}
                                        style={{
                                            textDecoration: "none",
                                            color: "black",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Update
                                    </Link>
                                </Button>

                                <Button variant="contained" color="error" className="delete" onClick={() => handleDelete(book.id)} style={{
                                    textDecoration: "none",
                                    color: "black",
                                    fontWeight: "bold",
                                }}>
                                    Delete
                                </Button>

                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </div >

            {/* Snackbar for showing the book deleted message */}
            <Snackbar Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} >
                <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
                    Book deleted successfully
                </MuiAlert>
            </Snackbar>
        </>
    );
};
