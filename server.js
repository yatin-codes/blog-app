require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Blog = require("./models/Blog");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/blogDB")
    .then(() => console.log("MongoDB Connected ✅"))
    .catch(err => console.log("Mongo Error:", err));

// Test Route
app.get("/", (req, res) => {
    res.send("Social Blog API Running 🚀");
});


// ================= ADD POST =================
app.post("/add-blog", async (req, res) => {
    try {
        const { username, image, title, content } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Caption required" });
        }

        const blog = new Blog({
            username,
            image,
            title,
            content
        });

        await blog.save();
        res.status(201).json(blog);

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= GET POSTS =================
app.get("/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= LIKE =================
app.post("/like-blog/:id", async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (!blog) return res.status(404).json({ message: "Not found" });

        res.json(blog);
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= DISLIKE =================
app.post("/dislike-blog/:id", async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $inc: { dislikes: 1 } },
            { new: true }
        );

        if (!blog) return res.status(404).json({ message: "Not found" });

        res.json(blog);
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= SHARE =================
app.post("/share-blog/:id", async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $inc: { shares: 1 } },
            { new: true }
        );

        if (!blog) return res.status(404).json({ message: "Not found" });

        res.json(blog);
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= FOLLOW =================
app.post("/follow-blog/:id", async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $inc: { follows: 1 } },
            { new: true }
        );

        if (!blog) return res.status(404).json({ message: "Not found" });

        res.json(blog);
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= ADD COMMENT =================
app.post("/add-comment/:id", async (req, res) => {
    try {
        const { username, text } = req.body;

        if (!username || !text) {
            return res.status(400).json({ message: "All fields required" });
        }

        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).json({ message: "Not found" });

        blog.comments.push({ username, text });
        await blog.save();

        res.json(blog);

    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= DELETE COMMENT =================
app.delete("/delete-comment/:blogId/:commentId", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) return res.status(404).json({ message: "Not found" });

        blog.comments = blog.comments.filter(
            c => c._id.toString() !== req.params.commentId
        );

        await blog.save();

        res.json({ message: "Comment Deleted ✅" });

    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= DELETE POST =================
app.delete("/delete-blog/:id", async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: "Not found" });

        res.json({ message: "Post Deleted ✅" });

    } catch {
        res.status(500).json({ message: "Server Error" });
    }
});


// ================= SERVER =================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🚀`);
});