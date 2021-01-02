const express = require('express');
const postController = require('../controllers/postController');
const authenticateUser = require('../middleware/auth');
const checkObjectId = require('../middleware/checkObjectId');

const postRouter = express.Router();

// @route    GET api/posts
// @desc     Get all posts
// @access   Public
//postRouter.get('/', postController.getAllposts);

// @route    POST api/posts
// @desc     Register post
// @access   Public
// postRouter.post(
//   '/',
//   postController.validatepostModel,
//   postController.createpost
// );

// @route    POST api/posts
// @desc     Create a post
// @access   Private
postRouter.post(
  '/',

  authenticateUser,
  postController.validatePostModel,
  postController.createPost
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
postRouter.get('/', authenticateUser, postController.getAllPosts);

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
postRouter.get(
  '/:id',
  authenticateUser,
  checkObjectId('id'),
  postController.getPostById
);

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
postRouter.delete(
  '/:id',
  authenticateUser,
  checkObjectId('id'),
  postController.deletePostById
);

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
postRouter.put(
  '/like/:id',
  authenticateUser,
  checkObjectId('id'),
  postController.likePost
);

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
postRouter.put(
  '/unlike/:id',
  authenticateUser,
  checkObjectId('id'),
  postController.unlikePost
);

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
postRouter.post(
  '/comment/:id',

  authenticateUser,
  checkObjectId('id'),
  postController.validateCommentModel,
  postController.commentOnPost
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
postRouter.delete(
  '/comment/:id/:comment_id',
  authenticateUser,
  postController.deleteCommentFromPost
);

module.exports = postRouter;
