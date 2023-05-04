const Thought = require("../models/Thought");
const User = require("../models/User");

module.exports = {
  addThought(req, res) {
    let thoughtData = {
      'thoughText': req.body.thoughtText,
      'username': req.body.username,
    };
    Thought
      .create(thoughtData)
      .then((thought) => {
        User
          .findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: thought._id }},
            { runValidators: true, new: true }
          )
          .catch((err) => res.status(500).json(err));
          res.json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },
  getAllThoughts(req, res) {
    Thought
      .find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  getSingleThought(req, res) {
    Thought
      .findOne({ _id: req.params.thoughtId })
      .populate('reactions')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  editThought(req, res) {
    let thoughtData = {
      'thoughText': req.body.thoughtText,
      'username': req.body.username,
    };
    Thought
      .findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: thoughtData },
        { runValidators: true, new: true }
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteThought(req, res) {
    Thought
      .findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with that ID' })
        } else {
          User
            .findOneAndUpdate(
              { thoughts: { $elemMatch: { $eq: req.params.thoughtId } } },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
            .then((user) => {
              if (!user) {
                res.status(404).json({ message: 'Thought successfully deleted but there was no associated user' })
              } else {
                res.json({ message: 'Thought successfully deleted and removed from User' })
              }
            })

        }
      })
      .catch((err) => res.status(500).json(err));
  },
  addReaction(req, res) {
    Thought
      .findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true },
      )
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      })
      .catch((err) => res.status(500).json(err));
  },
  deleteReaction(req, res) {
    Thought
      .findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      )
      .then((thought) => {
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      })
      .catch((err) => res.status(500).json(err));
  }
}