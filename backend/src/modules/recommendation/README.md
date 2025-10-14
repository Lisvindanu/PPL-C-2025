# Modul 8 - Recommendation & Personalization System

## 📋 Deskripsi
Modul untuk sistem rekomendasi layanan berdasarkan riwayat user, preferensi, dan machine learning sederhana.

## 🎯 User Stories
- **R-1**: Rekomendasi layanan berdasarkan riwayat pesanan
- **R-2**: Personalization tampilan beranda pengguna
- **R-3**: Analisis data rating dan transaksi untuk rekomendasi
- **R-4**: Sistem preferensi pengguna (favorit, minat)
- **R-5**: Statistik efektivitas rekomendasi
- **R-6**: Pembaruan model rekomendasi secara berkala

## 📂 Struktur DDD

```
recommendation/
├── domain/
│   ├── entities/
│   │   ├── UserPreference.js    # Entity preferensi user
│   │   └── Recommendation.js    # Entity rekomendasi
│   └── services/
│       ├── RecommendationEngine.js  # Core recommendation logic
│       └── SimilarityCalculator.js  # Hitung similarity
├── application/
│   ├── use-cases/
│   │   ├── GetPersonalizedRecommendations.js
│   │   ├── GetSimilarServices.js    # Similar services
│   │   ├── UpdateUserPreferences.js
│   │   ├── AddToFavorites.js
│   │   └── TrackRecommendationClick.js  # Track effectiveness
│   └── dtos/
│       ├── RecommendationDto.js
│       └── PreferenceDto.js
├── infrastructure/
│   ├── repositories/
│   │   ├── SequelizePreferenceRepository.js
│   │   └── SequelizeRecommendationLogRepository.js
│   ├── models/
│   │   ├── UserPreferenceModel.js
│   │   └── RecommendationLogModel.js
│   └── services/
│       └── RecommendationAlgorithm.js  # Pure JavaScript algorithm
└── presentation/
    ├── controllers/
    │   └── RecommendationController.js
    └── routes/
        └── recommendationRoutes.js
```

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/recommendations` | Get personalized recommendations | Private |
| GET | `/api/recommendations/similar/:serviceId` | Get similar services | Public |
| GET | `/api/recommendations/popular` | Popular services (trending) | Public |
| POST | `/api/recommendations/preferences` | Update user preferences | Private |
| POST | `/api/recommendations/favorites/:serviceId` | Add to favorites | Private |
| DELETE | `/api/recommendations/favorites/:serviceId` | Remove from favorites | Private |
| GET | `/api/recommendations/favorites` | Get user favorites | Private |
| POST | `/api/recommendations/track-click` | Track recommendation click | Private |

## 📦 Database Schema

### 1. `favorit` (Favorite Services)

```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Favorite = sequelize.define('favorit', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    layanan_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'layanan', key: 'id' },
      onDelete: 'CASCADE'
    }
  }, {
    timestamps: true,
    underscored: true,
    updatedAt: false,
    indexes: [
      { unique: true, fields: ['user_id', 'layanan_id'], name: 'unique_user_favorit' },
      { fields: ['user_id'] }
    ]
  });

  return Favorite;
};
```

### 2. `aktivitas_user` (User Activity Tracking)

```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserActivity = sequelize.define('aktivitas_user', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    layanan_id: {
      type: DataTypes.CHAR(36),
      references: { model: 'layanan', key: 'id' },
      onDelete: 'CASCADE'
    },
    tipe_aktivitas: {
      type: DataTypes.ENUM('view', 'search', 'click'),
      allowNull: false
    },
    kata_kunci: DataTypes.STRING(255),
    jumlah_view: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    terakhir_dilihat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true,
    underscored: true,
    updatedAt: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['layanan_id'] },
      { fields: ['tipe_aktivitas'] }
    ]
  });

  return UserActivity;
};
```

### 3. `preferensi_user` (User Preferences)

```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserPreference = sequelize.define('preferensi_user', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.CHAR(36),
      unique: true,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    kategori_favorit: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    rentang_harga_min: DataTypes.DECIMAL(10, 2),
    rentang_harga_max: DataTypes.DECIMAL(10, 2),
    kategori_pesanan: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    riwayat_pencarian: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] }
    ]
  });

  return UserPreference;
};
```

### 4. `rekomendasi_layanan` (Recommendation Log)

```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RecommendationLog = sequelize.define('rekomendasi_layanan', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE'
    },
    layanan_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'layanan', key: 'id' },
      onDelete: 'CASCADE'
    },
    tipe_rekomendasi: {
      type: DataTypes.ENUM('personalized', 'similar', 'popular'),
      allowNull: false
    },
    posisi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    diklik: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    diklik_pada: DataTypes.DATE
  }, {
    timestamps: true,
    underscored: true,
    updatedAt: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['layanan_id'] },
      { fields: ['tipe_rekomendasi'] },
      { fields: ['diklik'] }
    ]
  });

  return RecommendationLog;
};
```

## 💡 Tips Implementasi

### Recommendation Engine (domain/services/RecommendationEngine.js)
```javascript
class RecommendationEngine {
  constructor(
    serviceRepository,
    orderRepository,
    preferenceRepository,
    reviewRepository
  ) {
    this.serviceRepository = serviceRepository;
    this.orderRepository = orderRepository;
    this.preferenceRepository = preferenceRepository;
    this.reviewRepository = reviewRepository;
  }

  async getPersonalizedRecommendations(userId, limit = 10) {
    const userPreference = await this.preferenceRepository.findByUserId(userId);
    if (!userPreference) {
      // Jika belum ada preferensi, return popular services
      return await this.getPopularServices(limit);
    }

    const recommendations = [];
    const weights = {
      favoriteCategories: 0.4,
      orderedCategories: 0.3,
      viewHistory: 0.2,
      priceRange: 0.1
    };

    // 1. Rekomendasi berdasarkan favorite categories
    if (userPreference.favoriteCategories.length > 0) {
      const categoryServices = await this.serviceRepository.find({
        category: { $in: userPreference.favoriteCategories },
        status: 'active'
      });

      categoryServices.forEach(service => {
        recommendations.push({
          service,
          score: weights.favoriteCategories,
          reason: `Based on your interest in ${service.category}`
        });
      });
    }

    // 2. Rekomendasi berdasarkan order history
    if (userPreference.orderedCategories.length > 0) {
      const orderedServices = await this.serviceRepository.find({
        category: { $in: userPreference.orderedCategories },
        status: 'active'
      });

      orderedServices.forEach(service => {
        const existing = recommendations.find(r => r.service.id === service.id);
        if (existing) {
          existing.score += weights.orderedCategories;
        } else {
          recommendations.push({
            service,
            score: weights.orderedCategories,
            reason: `Similar to your previous orders`
          });
        }
      });
    }

    // 3. Rekomendasi berdasarkan view history
    if (userPreference.viewedServices.length > 0) {
      const viewedServiceIds = userPreference.viewedServices.map(v => v.serviceId);
      const similarServices = await this.findSimilarServices(viewedServiceIds);

      similarServices.forEach(service => {
        const existing = recommendations.find(r => r.service.id === service.id);
        if (existing) {
          existing.score += weights.viewHistory;
        } else {
          recommendations.push({
            service,
            score: weights.viewHistory,
            reason: `Similar to services you viewed`
          });
        }
      });
    }

    // 4. Filter by price range
    if (userPreference.priceRange) {
      recommendations = recommendations.filter(r =>
        r.service.price >= userPreference.priceRange.min &&
        r.service.price <= userPreference.priceRange.max
      );
    }

    // Sort by score dan return top N
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => ({
        service: r.service,
        reason: r.reason,
        score: r.score
      }));
  }

  async findSimilarServices(serviceIds, limit = 10) {
    // Ambil services yang di-view
    const viewedServices = await this.serviceRepository.findByIds(serviceIds);

    // Extract categories dan tags
    const categories = [...new Set(viewedServices.map(s => s.category))];
    const tags = [...new Set(viewedServices.flatMap(s => s.tags))];

    // Cari services dengan kategori/tags yang sama
    const similarServices = await this.serviceRepository.find({
      _id: { $nin: serviceIds },  // Exclude yang sudah di-view
      $or: [
        { category: { $in: categories } },
        { tags: { $in: tags } }
      ],
      status: 'active'
    });

    // Hitung similarity score
    return similarServices
      .map(service => ({
        service,
        score: this.calculateSimilarityScore(service, viewedServices)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.service);
  }

  calculateSimilarityScore(service, referenceServices) {
    let score = 0;

    referenceServices.forEach(refService => {
      // Same category: +0.5
      if (service.category === refService.category) {
        score += 0.5;
      }

      // Common tags: +0.1 per tag
      const commonTags = service.tags.filter(tag =>
        refService.tags.includes(tag)
      );
      score += commonTags.length * 0.1;

      // Similar price range: +0.2
      const priceDiff = Math.abs(service.price - refService.price);
      if (priceDiff / refService.price < 0.3) {  // Within 30%
        score += 0.2;
      }

      // Similar rating: +0.2
      const ratingDiff = Math.abs(
        service.rating.average - refService.rating.average
      );
      if (ratingDiff < 0.5) {
        score += 0.2;
      }
    });

    return score / referenceServices.length;
  }

  async getPopularServices(limit = 10) {
    // Popular = high rating + many orders
    return await this.serviceRepository.find(
      { status: 'active' },
      {
        'rating.average': -1,
        totalOrders: -1
      },
      0,
      limit
    );
  }
}

module.exports = RecommendationEngine;
```

### Get Personalized Recommendations Use Case
```javascript
class GetPersonalizedRecommendations {
  constructor(recommendationEngine, recommendationLogRepository) {
    this.recommendationEngine = recommendationEngine;
    this.recommendationLogRepository = recommendationLogRepository;
  }

  async execute(userId, limit = 10) {
    const recommendations = await this.recommendationEngine
      .getPersonalizedRecommendations(userId, limit);

    // Log recommendations untuk tracking
    await Promise.all(
      recommendations.map((rec, index) =>
        this.recommendationLogRepository.save({
          userId,
          serviceId: rec.service.id,
          recommendationType: 'personalized',
          position: index + 1
        })
      )
    );

    return recommendations;
  }
}
```

### Update User Preferences (Auto-update)
```javascript
class UpdateUserPreferences {
  async trackServiceView(userId, serviceId) {
    let preference = await this.preferenceRepository.findByUserId(userId);

    if (!preference) {
      preference = new UserPreference({ userId });
    }

    // Update viewed services
    const viewed = preference.viewedServices.find(
      v => v.serviceId === serviceId
    );

    if (viewed) {
      viewed.viewCount++;
      viewed.lastViewed = new Date();
    } else {
      preference.viewedServices.push({
        serviceId,
        viewCount: 1,
        lastViewed: new Date()
      });
    }

    // Update favorite categories (based on views)
    const service = await this.serviceRepository.findById(serviceId);
    if (service) {
      preference.updateFavoriteCategories(service.category);
    }

    await this.preferenceRepository.save(preference);
  }

  async trackOrder(userId, orderId) {
    const order = await this.orderRepository.findById(orderId);
    const service = await this.serviceRepository.findById(order.serviceId);

    let preference = await this.preferenceRepository.findByUserId(userId);
    if (!preference) {
      preference = new UserPreference({ userId });
    }

    // Update ordered categories
    if (!preference.orderedCategories.includes(service.category)) {
      preference.orderedCategories.push(service.category);
    }

    // Update price range
    preference.updatePriceRange(service.price);

    await this.preferenceRepository.save(preference);
  }
}
```

### Track Recommendation Click
```javascript
class TrackRecommendationClick {
  async execute(userId, serviceId) {
    // Find log entry
    const log = await this.recommendationLogRepository.findOne({
      userId,
      serviceId,
      clicked: false,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (log) {
      log.clicked = true;
      log.clickedAt = new Date();
      await this.recommendationLogRepository.update(log);
    }

    // Update user preferences (track view)
    await this.updateUserPreferences.trackServiceView(userId, serviceId);
  }
}
```

### Get Recommendation Analytics (Admin)
```javascript
class GetRecommendationAnalytics {
  async execute(timeRange = 'week') {
    const dateFilter = this.getDateFilter(timeRange);

    const logs = await this.recommendationLogRepository.find({
      createdAt: dateFilter
    });

    const totalRecommendations = logs.length;
    const totalClicks = logs.filter(l => l.clicked).length;
    const clickThroughRate = ((totalClicks / totalRecommendations) * 100).toFixed(2);

    // By recommendation type
    const byType = {};
    logs.forEach(log => {
      if (!byType[log.recommendationType]) {
        byType[log.recommendationType] = { shown: 0, clicked: 0 };
      }
      byType[log.recommendationType].shown++;
      if (log.clicked) {
        byType[log.recommendationType].clicked++;
      }
    });

    Object.keys(byType).forEach(type => {
      byType[type].ctr = (
        (byType[type].clicked / byType[type].shown) * 100
      ).toFixed(2);
    });

    return {
      totalRecommendations,
      totalClicks,
      clickThroughRate,
      byType
    };
  }
}
```

## 🚀 Frontend Integration

### Get Personalized Recommendations
```javascript
GET /api/recommendations?limit=10
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: true,
  data: [
    {
      service: {
        serviceId: "...",
        title: "Logo Design Pro",
        price: 250000,
        rating: 4.8,
        freelancer: { name: "John Doe" }
      },
      reason: "Based on your interest in design",
      score: 0.85
    }
  ]
}
```

### Get Similar Services
```javascript
GET /api/recommendations/similar/:serviceId
Response: {
  success: true,
  data: [
    {
      serviceId: "...",
      title: "Modern Logo Design",
      price: 300000,
      rating: 4.7,
      similarityScore: 0.92
    }
  ]
}
```

### Add to Favorites
```javascript
POST /api/recommendations/favorites/:serviceId
Headers: { Authorization: "Bearer <token>" }
Response: {
  success: true,
  message: "Added to favorites"
}
```

### Track Click (dilakukan otomatis saat user klik recommendation)
```javascript
POST /api/recommendations/track-click
Headers: { Authorization: "Bearer <token>" }
Body: {
  serviceId: "service_id"
}
Response: {
  success: true
}
```

## 📊 Algorithm Implementation

### Pendekatan Rekomendasi (Pure JavaScript)

Sistem rekomendasi SkillConnect menggunakan **Content-Based Filtering** dengan tracking user behavior:

1. **Content-Based Filtering** ✅
   - Berdasarkan atribut service (kategori, tags, harga)
   - Menggunakan weighted scoring system
   - Pure JavaScript, NO external ML libraries

2. **User Activity Tracking** ✅
   - Track service views → `aktivitas_user`
   - Track searches → `aktivitas_user.kata_kunci`
   - Track orders → `preferensi_user.orderedCategories`
   - Track favorites → `favorit`

3. **Scoring Weights**:
   - Favorite categories: 40%
   - Order history: 30%
   - View history: 20%
   - Price range match: 10%

4. **Similarity Calculation**:
   - Same category: +0.5
   - Common tags: +0.1 per tag
   - Similar price (±30%): +0.2
   - Similar rating: +0.2

### Why No ML?

Untuk capstone project, algoritma content-based filtering sudah cukup karena:
- ✅ Implementasi lebih simple
- ✅ Tidak perlu Python microservice
- ✅ Tidak perlu training data yang besar
- ✅ Performance lebih cepat
- ✅ Maintenance lebih mudah
- ✅ Hasil rekomendasi tetap relevan

**Note**: Algoritma ini sudah terimplementasi lengkap di `RecommendationEngine` class di atas!
