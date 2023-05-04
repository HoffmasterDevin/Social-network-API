const Thought = require("../models/Thought");
const User = require("../models/User");

module.exports = {
  addUser(req, res) {
    User
      .create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  getAllUsers(req, res) {
    User
      .find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  getSingleUser(req, res) {
    User
      .findOne({ _id: req.params.userId })
      .populate('friends')
      .populate('thoughts')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  editUser(req, res) {
    User
      .findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteUser(req, res) {
    User
      .findOneAndDelete({ _id: req.params.userId })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'No user with that ID' })
        } else {
          Thought
            .deleteMany({ _id: { $in: user.thoughts } })
            .then( res.json({ message: 'User and thoughts were successfully deleted' }))
        }
      })
      .catch((err) => res.status(500).json(err));
  },
  addFriend(req, res) {
    User
      .findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteFriend(req, res) {
    User
      .findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  }
}