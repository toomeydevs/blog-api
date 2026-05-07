const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true
    },

    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters']
    },

    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters']
    },

    author: {
      type: String,
      default: 'Anonymous',
      trim: true
    }
  },
  {
    timestamps: true,

    // Clean API response
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;