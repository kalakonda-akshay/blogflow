const Post    = require('../models/Post');
const Comment = require('../models/Comment');

exports.getPosts = async (req, res, next) => {
  try {
    const { search, category, author, page = 1, limit = 10 } = req.query;
    const filter = { published: true };
    if (category && category !== 'All') filter.category = category;
    if (author) filter.author = author;
    if (search) filter.$text = { $search: search };
    const skip = (Number(page) - 1) * Number(limit);
    const [posts, total] = await Promise.all([
      Post.find(filter).sort('-createdAt').skip(skip).limit(Number(limit))
        .populate('author', 'name avatar').populate('commentCount'),
      Post.countDocuments(filter),
    ]);
    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar bio').populate('commentCount');
    if (!post || !post.published) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { next(err); }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, coverImage, category, tags } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });
    if (!content || !content.trim()) return res.status(400).json({ message: 'Content is required' });
    const post = await Post.create({ title, content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      coverImage, category, tags, author: req.user._id });
    await post.populate('author', 'name avatar');
    res.status(201).json(post);
  } catch (err) { next(err); }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised to edit this post' });
    const { title, content, excerpt, coverImage, category, tags } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (coverImage) post.coverImage = coverImage;
    if (category) post.category = category;
    if (tags) post.tags = tags;
    await post.save();
    await post.populate('author', 'name avatar');
    res.json(post);
  } catch (err) { next(err); }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised to delete this post' });
    await Post.deleteOne({ _id: post._id });
    await Comment.deleteMany({ post: post._id });
    res.json({ message: 'Post deleted' });
  } catch (err) { next(err); }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const uid = req.user._id.toString();
    const liked = post.likes.map(l => l.toString()).includes(uid);
    if (liked) post.likes.pull(req.user._id);
    else post.likes.push(req.user._id);
    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (err) { next(err); }
};
