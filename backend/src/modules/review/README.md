# Modul 5 - Review & Rating System

## 📋 Deskripsi
Modul untuk mengelola review dan rating dari client ke freelancer/layanan setelah order selesai.

## 🎯 User Stories
- **R-1**: Client memberi rating & komentar
- **R-2**: Freelancer melihat review diterima
- **R-3**: Pelaporan review tidak pantas
- **R-4**: Sistem menampilkan rata-rata rating
- **R-5**: Admin menghapus review melanggar
- **R-6**: Review terbaru ditampilkan

## 📂 Struktur DDD

```
review/
├── domain/
│   ├── entities/
│   │   └── Review.js            # Entity Review
│   ├── value-objects/
│   │   └── Rating.js            # Value Object (1-5)
│   └── services/
│       └── RatingCalculator.js  # Calculate average rating
├── application/
│   ├── use-cases/
│   │   ├── CreateReview.js      # Buat review
│   │   ├── UpdateReview.js      # Update review
│   │   ├── DeleteReview.js      # Hapus review
│   │   ├── ReportReview.js      # Report review
│   │   └── GetReviews.js        # Get reviews service/freelancer
│   └── dtos/
│       ├── CreateReviewDto.js
│       └── ReviewResponseDto.js
├── infrastructure/
│   ├── repositories/
│   │   └── MongoReviewRepository.js
│   ├── models/
│   │   └── ReviewModel.js
│   └── services/
│       └── ModerationService.js # Auto-moderation kata kasar
└── presentation/
    ├── controllers/
    │   └── ReviewController.js
    └── routes/
        └── reviewRoutes.js
```

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/reviews` | Buat review | Client |
| GET | `/api/reviews/service/:id` | Reviews untuk service | Public |
| GET | `/api/reviews/freelancer/:id` | Reviews untuk freelancer | Public |
| PUT | `/api/reviews/:id` | Update review | Client (owner) |
| DELETE | `/api/reviews/:id` | Hapus review | Admin |
| POST | `/api/reviews/:id/report` | Report review | Private |
| GET | `/api/reviews/latest` | Review terbaru | Public |

## 📦 Database Schema (ReviewModel)

```javascript
{
  orderId: ObjectId (ref: Order, unique),
  clientId: ObjectId (ref: User),
  freelancerId: ObjectId (ref: User),
  serviceId: ObjectId (ref: Service),
  rating: Number (min: 1, max: 5, required),
  comment: String,
  images: [String],        // Optional: screenshot hasil
  isReported: Boolean (default: false),
  reportReason: String,
  isDeleted: Boolean (default: false),
  deletedBy: ObjectId,
  deletedReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 💡 Tips Implementasi

### Create Review Use Case
```javascript
class CreateReview {
  constructor(reviewRepository, orderRepository, serviceRepository) {
    this.reviewRepository = reviewRepository;
    this.orderRepository = orderRepository;
    this.serviceRepository = serviceRepository;
  }

  async execute(dto) {
    // 1. Validasi order selesai
    const order = await this.orderRepository.findById(dto.orderId);
    if (!order) throw new Error('Order not found');
    if (order.status !== 'completed') {
      throw new Error('Can only review completed orders');
    }

    // 2. Validasi client adalah pemilik order
    if (order.clientId !== dto.clientId) {
      throw new Error('Unauthorized');
    }

    // 3. Validasi belum pernah review
    const existingReview = await this.reviewRepository.findByOrderId(dto.orderId);
    if (existingReview) {
      throw new Error('Order already reviewed');
    }

    // 4. Buat review entity
    const review = new Review({
      orderId: dto.orderId,
      clientId: dto.clientId,
      freelancerId: order.freelancerId,
      serviceId: order.serviceId,
      rating: new Rating(dto.rating), // Value Object
      comment: dto.comment
    });

    // 5. Save review
    await this.reviewRepository.save(review);

    // 6. Update rating service
    await this.updateServiceRating(order.serviceId);

    return review;
  }

  async updateServiceRating(serviceId) {
    const reviews = await this.reviewRepository.findByServiceId(serviceId);
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    await this.serviceRepository.updateRating(serviceId, {
      average: averageRating,
      count: reviews.length
    });
  }
}
```

### Rating Value Object (domain/value-objects/Rating.js)
```javascript
class Rating {
  constructor(value) {
    if (value < 1 || value > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Rating must be an integer');
    }
    this.value = value;
  }

  toStars() {
    return '⭐'.repeat(this.value);
  }

  isGood() {
    return this.value >= 4;
  }
}

module.exports = Rating;
```

### Get Reviews with Pagination
```javascript
class GetReviews {
  async execute(serviceId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const reviews = await this.reviewRepository.find(
      { serviceId, isDeleted: false },
      { createdAt: -1 },
      skip,
      limit
    );

    const total = await this.reviewRepository.count({ serviceId, isDeleted: false });

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
```

### Report Review Use Case
```javascript
class ReportReview {
  async execute(reviewId, reporterId, reason) {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) throw new Error('Review not found');

    review.report(reason);
    await this.reviewRepository.update(review);

    // Notifikasi admin
    await this.notificationService.notifyAdmin({
      type: 'review_reported',
      reviewId: review.id,
      reason
    });

    return { success: true, message: 'Review reported' };
  }
}
```

## 🚀 Frontend Integration

### Create Review (Client)
```javascript
POST /api/reviews
Headers: { Authorization: "Bearer <token>" }
Body: {
  orderId: "order_id",
  rating: 5,
  comment: "Kerja cepat dan hasilnya memuaskan!"
}
Response: {
  success: true,
  data: {
    reviewId: "review_id",
    rating: 5,
    createdAt: "2025-01-20"
  }
}
```

### Get Reviews for Service
```javascript
GET /api/reviews/service/:serviceId?page=1&limit=10
Response: {
  success: true,
  data: {
    reviews: [
      {
        reviewId: "...",
        client: { name: "John Doe", avatar: "..." },
        rating: 5,
        comment: "Excellent work!",
        createdAt: "2025-01-20"
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 45,
      totalPages: 5
    },
    summary: {
      averageRating: 4.7,
      totalReviews: 45,
      ratingDistribution: {
        5: 30,
        4: 10,
        3: 3,
        2: 1,
        1: 1
      }
    }
  }
}
```

### Report Review
```javascript
POST /api/reviews/:id/report
Headers: { Authorization: "Bearer <token>" }
Body: {
  reason: "Inappropriate content"
}
Response: {
  success: true,
  message: "Review reported successfully"
}
```

## 📊 Rating Distribution Calculation

```javascript
class RatingCalculator {
  calculateDistribution(reviews) {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach(review => {
      distribution[review.rating]++;
    });

    // Convert to percentage
    const total = reviews.length;
    Object.keys(distribution).forEach(rating => {
      distribution[rating] = {
        count: distribution[rating],
        percentage: ((distribution[rating] / total) * 100).toFixed(1)
      };
    });

    return distribution;
  }

  calculateAverage(reviews) {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }
}
```

## 🛡️ Content Moderation

### Auto-filter Kata Kasar
```javascript
class ModerationService {
  constructor() {
    this.bannedWords = ['kata_kasar1', 'kata_kasar2', ...];
  }

  moderate(text) {
    let moderated = text;
    this.bannedWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      moderated = moderated.replace(regex, '***');
    });
    return moderated;
  }

  containsBannedWords(text) {
    return this.bannedWords.some(word =>
      text.toLowerCase().includes(word.toLowerCase())
    );
  }
}
```
