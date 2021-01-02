const { check, validationResult } = require('express-validator');
const BaseError = require('../exceptions/BasrError');
const catchAsync = require('../utils/catchAsync');
const Post = require('../models/postModel');
const User = require('../models/userModel');

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find().sort({ date: -1 });
  res.json(posts);
});

exports.validatePostModel = [
  check('text', 'Text is required')
    .not()
    .isEmpty()
];

exports.createPost = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BaseError('invalid inputs', 400, errors.array());
  }

  const user = await Post.findById(req.user.id).select('-password');

  const newPost = new Post({
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id
  });

  const post = await newPost.save();

  res.json(post);
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.json(post);
});

exports.deletePostById = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Check user
  if (post.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  await post.remove();

  res.json({ message: 'Post removed' });
});

exports.likePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  // Check if the post has already been liked
  if (post.likes.some(like => like.user.toString() === req.user.id)) {
    return res.status(400).json({ message: 'Post already liked' });
  }

  post.likes.unshift({ user: req.user.id });

  await post.save();

  return res.json(post.likes);
});

exports.unlikePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  // Check if the post has not yet been liked
  if (!post.likes.some(like => like.user.toString() === req.user.id)) {
    return res.status(400).json({ message: 'Post has not yet been liked' });
  }

  // remove the like
  post.likes = post.likes.filter(({ user }) => user.toString() !== req.user.id);

  await post.save();

  return res.json(post.likes);
});

exports.validateCommentModel = [
  check('text', 'Text is required')
    .not()
    .isEmpty()
];

exports.commentOnPost = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BaseError('invalid inputs', 400, errors.array());
  }

  const user = await User.findById(req.user.id).select('-password');
  const post = await Post.findById(req.params.id);

  const newComment = {
    text: req.body.text,
    name: user.name,
    avatar: user.avatar,
    user: req.user.id
  };

  post.comments.unshift(newComment);

  await post.save();

  res.json(post.comments);
});

exports.deleteCommentFromPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  // Pull out comment
  const comment = post.comments.find(c => c.id === req.params.comment_id);
  // Make sure comment exists
  if (!comment) {
    return res.status(404).json({ message: 'Comment does not exist' });
  }
  // Check user
  if (comment.user.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  post.comments = post.comments.filter(
    ({ id }) => id !== req.params.comment_id
  );

  await post.save();

  return res.json(post.comments);
});
