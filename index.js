import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];

// Render all posts
app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

// Submit new post
app.post("/submit", (req, res) => {
  const postId = posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  const postTitle = req.body["title"];
  const postContent = req.body["content"];
  posts.push({ id: postId, title: postTitle, content: postContent });
  res.redirect("/");
});

// Render update form with existing post data
app.get("/update/:postId", (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = posts.find(p => p.id === postId);
  if (post) {
    res.render("update.ejs", {
      postId: post.id,
      postTitle: post.title,
      postContent: post.content
    });
  } else {
    res.redirect("/");
  }
});

// Update post
app.post("/update/:postId", (req, res) => {
  const postId = parseInt(req.params.postId);
  const postTitle = req.body["title"];
  const postContent = req.body["content"];

  // Find the post and update it
  let post = posts.find(p => p.id === postId);
  if (post) {
    post.title = postTitle;
    post.content = postContent;
  }

  res.redirect("/");
});


app.get("/delete/:postId", (req, res) => {
  const postId = parseInt(req.params.postId);
  posts = posts.filter(post => post.id !== postId);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
