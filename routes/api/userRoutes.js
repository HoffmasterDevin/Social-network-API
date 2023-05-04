const router = require('express').Router();
const {
  addUser,
  getAllUsers,
  getSingleUser,
  editUser,
  deleteUser,
  addFriend,
  deleteFriend
} = require('../../controllers/userController.js');

router.route('/')
  .post(addUser)
  .get(getAllUsers);

router.route('/:userId')
  .get(getSingleUser)
  .put(editUser)
  .delete(deleteUser);

router.route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(deleteFriend);

module.exports = router;
