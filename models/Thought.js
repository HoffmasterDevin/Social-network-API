const mongoose = require('mongoose');

function formatDateTime(dateTime) {
  let formattedDateTime = dateTime.toLocaleDateString(
    'en-us',
    { month:'short', day:'numeric', year:'numeric', hour:'numeric', minute:'numeric' }
  );
  return formattedDateTime;
}

const reactionSchema = new mongoose.Schema(
  {
    reactionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: formatDateTime,
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

const thoughtSchema = new mongoose.Schema(
  {
    thoughText: {
      type: String,
      required: true,
      minLength: [1, 'Please add 1 to 280 characters'],
      maxLength: [280, 'Please add 1 to 280 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: formatDateTime,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

thoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length;
  });

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;