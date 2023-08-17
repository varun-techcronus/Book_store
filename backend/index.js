import express from "express";
import mysql from 'mysql';
import cors from 'cors';
import multer from "multer";
import {
    fileURLToPath
} from 'url';
import {
    dirname
} from 'path';

const app = express();

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

app.get('/', (req, res) => {
    res.send("Hello, this is the backend side. Good Afternoon!");
});

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
})); // Adjust the frontend URL accordingly

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "test"
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const uploads = multer({
    storage: storage
});

app.use('/uploads', express.static('uploads'));

app.post('/books', uploads.single('cover'), (req, res) => {
    try {
        const {
            title,
            desc,
            price
        } = req.body;
        const cover = req.file ? req.file.filename : null;

        if (!title || !desc || !price || !cover) {
            return res.status(400).json({
                error: "All fields are required."
            });
        }

        const q = "INSERT INTO books(`title`, `desc`, `cover`, `price`) VALUES (?, ?, ?, ?)";
        const values = [title, desc, cover, price];

        db.query(q, values, (err, result) => {
            if (err) {
                console.error("Error adding book:", err);
                return res.status(500).json({
                    error: "An error occurred while adding the book."
                });
            }

            return res.status(201).json({
                message: "Book has been added successfully."
            });
        });
    } catch (error) {
        console.error("Error adding book:", error);
        return res.status(500).json({
            error: "An error occurred while processing the request."
        });
    }
});

app.get('/books', (req, res) => {
    const q = "SELECT * FROM books";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({
            error: "An error occurred while fetching books."
        });
        return res.status(200).json(data);
    });
});

app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const q = "DELETE FROM books WHERE id = ?";

    db.query(q, [bookId], (err, data) => {
        if (err) return res.status(500).json({
            error: "An error occurred while deleting books."
        });
        return res.status(200).json(data);
    })
})

app.put('/books/:id', uploads.single('cover'), (req, res) => {
    const bookId = req.params.id;
    const q = "UPDATE books SET `title` = ? , `desc` = ? , `price` = ? , `cover` = ?  WHERE id = ?";

    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.file ? req.file.filename : null, // Use req.file to get the updated cover filename
    ]

    db.query(q, [...values, bookId], (err, data) => {
        if (err) return res.status(500).json({
            error: "An error occurred while updating books."
        });
        return res.status(200).json(data);
    })
})

app.get('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const q = "SELECT * FROM books WHERE id = ?";

    db.query(q, [bookId], (err, data) => {
        if (err) {
            console.error("Error fetching book details:", err);
            return res.status(500).json({
                error: "An error occurred while fetching book details."
            });
        }

        if (data.length === 0) {
            return res.status(404).json({
                error: "Book not found."
            });
        }

        const bookDetails = data[0];
        return res.status(200).json(bookDetails);
    });
});

app.listen(8080, () => {
    console.log("Connected to the database!");
});