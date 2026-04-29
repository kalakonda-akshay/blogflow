const mongoose = require('mongoose');
const slugify  = require('slugify');

const postSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 160 },
  slug: { type: String, unique: true },
  content: { type: String, required: [true, 'Content is required'], minlength: 10 },
  excerpt: { type: String, maxlength: 300 },
  coverImage: { type: String, default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800' },
  category: { type: String, enum: ['Tech','Lifestyle','Travel','Food','Health','Business','Other'], default: 'Other' },
  tags: [{ type: String, trim: true, lowercase: true }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  readTime: { type: Number, default: 1 },
  published: { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

postSchema.virtual('commentCount', { ref: 'Comment', localField: '_id', foreignField: 'post', count: true });

postSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    const base = slugify(this.title, { lower: true, strict: true });
    this.slug = `${base}-${Date.now()}`;
  }
  if (this.isModified('content') && !this.excerpt)
    this.excerpt = this.content.replace(/<[^>]+>/g, '').substring(0, 200) + '…';
  if (this.isModified('content')) {
    const words = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(words / 200));
  }
  next();
});

postSchema.index({ title: 'text', content: 'text' });
module.exports = mongoose.model('Post', postSchema);
