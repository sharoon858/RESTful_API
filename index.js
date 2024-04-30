const express = require('express');
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override')

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

// Initialize posts array with UUIDs as IDs
let posts = [
    {
        id: uuidv4(),
        username: "apna college",
        content: "I love coding"
    },
    {
        id: uuidv4(),
        username: "Shradha Kapra",
        content: "EX Microsoft"
    },
    {
        id: uuidv4(),
        username: "Sharoon Daniel",
        content: "I got my 1st internship at Microsoft"
    }
];

// Get all posts
app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts });
});

// Render the form for creating a new post
app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

// Create a new post
app.post("/posts", (req, res) => {
    const { username, content } = req.body;
    
    // Generate a new UUID for the post
    const newPost = {
        id: uuidv4(),
        username,
        content
    };
    
    // Add the new post to the posts array
    posts.push(newPost);
    
    // Redirect to the posts page
    res.redirect("/posts");
});

// Get a specific post by its ID
app.get("/posts/:id", (req, res) => {
    const { id } = req.params;
    
    // Find the post with the given ID
    const post = posts.find(p => p.id === id);
    
    // Define a default user object (with an empty username) if no user data is available
    const user = { username: "" };
    
    // Use logical expressions to set the user data
    user.username = post ? post.username : "";
    
    // Render the 'show' view and pass the 'post' and 'user' objects to the template
    res.render("show", { post: post || {}, user });
});
app.patch("/posts/:id", (req, res) =>{
    const { id } = req.params;
    let newContent= req.body.content;
    let post = posts.find(p => p.id === id);
    post.content=newContent;

    console.log(post);

    res.redirect("patch request working")
});

app.get("/posts/:id/edit", (req, res) => {
    // Retrieve the post ID from the route parameters
    const { id } = req.params;

    // Find the post in your data source (e.g., an array of posts)
    const post = posts.find(p => p.id === id);

    // Check if the post was found
    if (!post) {
        // If the post is not found, respond with a 404 status and message
        res.status(404).send('Post not found');
        return;
    }

    // Render the 'edit.ejs' view and pass the 'post' data
    // This allows the template to display the post's details
    res.render("edit.ejs", { post });
});
app.post("/posts/:id", (req, res) => {
    // Retrieve the post ID from the route parameters
    const { id } = req.params;

    const newContent = req.body.content;
    const post = posts.find(p => p.id === id);
    if (!post) {
        res.status(404).send('Post not found');
        return;
    }
        post.content = newContent;
    res.redirect("/posts");
});

app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === id); // Find the post to delete
  
    if (!post) {
      return res.status(404).send("Post not found"); // Handle non-existent post
    }
  
    // Filter the post out of the array (alternative approach)
    posts = posts.filter(p => p.id !== id);
  
    res.redirect("/posts"); // Redirect to the posts list (optional)
  });
  

// app.delete("/posts/:id", (req, res) => {
//     const { id } = req.params;

//     // Log the incoming request for debugging
//     console.log(`Received DELETE request for post ID: ${id}`);

//     // Find the index of the post in the posts array
//     const index = posts.findIndex(p => p.id === id);

//     if (index !== -1) {
//         // Post found, delete it from the array
//         posts.splice(index, 1);
//         res.status(204).end(); // 204 No Content response
//     } else {
//         // Post not found, respond with a 404 Not Found status code
//         console.log(`Post with ID ${id} not found.`);
//         res.status(404).send("Post not found");
//     }
// });






// Start the server
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
