import mongoose, { Document, Schema } from 'mongoose';
import { Product } from './product.model';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Prevent user from reviewing the same product twice
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to get average rating and save
reviewSchema.statics.calcAverageRatings = async function (productId: mongoose.Types.ObjectId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      numReviews: stats[0].numReviews,
      ratings: Math.round(stats[0].averageRating * 10) / 10,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      numReviews: 0,
      ratings: 0,
    });
  }
};

// Call calcAverageRatings after save and remove
reviewSchema.post('save', function () {
  (this.constructor as any).calcAverageRatings(this.product);
});
reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    (doc.constructor as any).calcAverageRatings(doc.product);
  }
});

export const Review = mongoose.model<IReview>('Review', reviewSchema);
