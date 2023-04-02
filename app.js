const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Content = require("./content");

const app = express();
const port = 23000;

const mongoURL = "mongodb://db:27017/dudeDB";

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

app.use(bodyParser.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/content", async (req, res) => {
  const content = req.body;
  const slug = getSlug(content.content);
  const newContent = new Content({ slug, content: content.content });
  await newContent.save();
  res.json(newContent);
});

function getSlug(content) {
  const words = content.trim().split(/\s+/);
  return words[words.length - 1];
}

app.get("/api/content", async (req, res) => {
  try {
    const contentList = await Content.find();
    const formattedContentList = contentList.map((content, index) => {
      const isLastItem = index === contentList.length - 1;
      return `  { slug: '${content.slug}', content: '${content.content}' }${
        isLastItem ? "" : ",\n"
      }`;
    });

    const formattedResponse = `[\n${formattedContentList.join("")}\n]`;

    res.status(200).send(`<pre>${formattedResponse}</pre>`);
  } catch (error) {
    console.error("Error retrieving content:", error);
    res.status(500).send("Something went wrong!");
  }
});

app.get("/api/content/:slug", async (req, res) => {
  try {
    const contentList = await Content.find();
    const slugs = contentList.map((content, index) => {
      const isLastItem = index === contentList.length - 1;
      return `  '${content.slug}'${isLastItem ? '' : ',\n'}`;
    });

    const formattedResponse = `[\n${slugs.join('')}\n]`;

    res.status(200).send(`<pre>${formattedResponse}</pre>`);
  } catch (error) {
    console.error("Error retrieving content:", error);
    res.status(500).send("Something went wrong!");
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
