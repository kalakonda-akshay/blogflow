const Comment = require('../models/Comment');
const Post    = require('../models/Post');

exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort('createdAt').populate('author', 'name avatar');
    res.json(comments);
  } catch (err) { next(err); }
};

exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ message: 'Comment cannot be empty' });
    if (content.length > 1000) return res.status(400).json({ message: 'Comment too long (max 1000 chars)' });
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = await Comment.create({ content: content.trim(), author: req.user._id, post: post._id });
    await comment.populate('author', 'name avatar');
    res.status(201).json(comment);
  } catch (err) { next(err); }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised' });
    await Comment.deleteOne({ _id: comment._id });
    res.json({ message: 'Comment deleted' });
  } catch (err) { next(err); }
};
