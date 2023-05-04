const router = require('express').Router();
const {
  addThought,
  getAllThoughts,
  getSingleThought,
  editThought,
  deleteThought,
  addReaction,
  deleteReaction
} = require('../../controllers/thoughtController.js');

router.route('/')
  .post(addThought)
  .get(getAllThoughts);

router.route('/:thoughtId')
  .get(getSingleThought)
  .put(editThought)
  .delete(deleteThought);

router.route('/:thoughtId/reactions')
  .post(addReaction)

router.route('/:thoughtId/reactions/:reactionId')
  .delete(deleteReaction);

module.exports = router;