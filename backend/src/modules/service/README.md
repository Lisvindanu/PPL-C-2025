# Modul 2 - Service Listing & Search

## 📋 Deskripsi
Modul untuk mengelola layanan yang ditawarkan freelancer, termasuk CRUD, pencarian, filter, dan rekomendasi.

## 🎯 User Stories
- **SL-1**: Tambah layanan baru (freelancer)
- **SL-2**: Edit dan hapus layanan
- **SL-3**: Pencarian berdasarkan nama/kategori
- **SL-4**: Filter layanan berdasarkan harga/rating
- **SL-5**: Lihat detail layanan
- **SL-6**: Rekomendasi layanan populer

## 📂 Struktur DDD

```
service/
├── domain/
│   ├── entities/
│   │   └── Service.js           # Entity Service
│   ├── value-objects/
│   │   ├── Price.js             # Value Object harga
│   │   └── Category.js          # Value Object kategori
│   └── repositories/
│       └── IServiceRepository.js
├── application/
│   ├── use-cases/
│   │   ├── CreateService.js     # Tambah layanan
│   │   ├── UpdateService.js     # Edit layanan
│   │   ├── DeleteService.js     # Hapus layanan
│   │   ├── SearchServices.js    # Pencarian & filter
│   │   ├── GetServiceDetail.js  # Detail layanan
│   │   └── GetPopularServices.js # Rekomendasi populer
│   └── dtos/
│       ├── CreateServiceDto.js
│       └── ServiceResponseDto.js
├── infrastructure/
│   ├── repositories/
│   │   └── MongoServiceRepository.js
│   ├── models/
│   │   └── ServiceModel.js
│   └── services/
│       └── ImageUploadService.js # Upload gambar layanan
└── presentation/
    ├── controllers/
    │   └── ServiceController.js
    └── routes/
        └── serviceRoutes.js
```

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/services` | Buat layanan baru | Freelancer |
| GET | `/api/services` | List semua layanan (dengan filter) | Public |
| GET | `/api/services/:id` | Detail layanan | Public |
| PUT | `/api/services/:id` | Update layanan | Freelancer (owner) |
| DELETE | `/api/services/:id` | Hapus layanan | Freelancer (owner) |
| GET | `/api/services/popular` | Layanan populer | Public |
| GET | `/api/services/search` | Search & filter | Public |

## 🔍 Search & Filter

```javascript
GET /api/services?
  search=logo design
  &category=design
  &minPrice=100000
  &maxPrice=500000
  &minRating=4
  &sortBy=price_asc
  &page=1
  &limit=10
```

## 📦 Database Schema (ServiceModel)

```javascript
{
  freelancerId: ObjectId (ref: User),
  title: String (required),
  description: String,
  category: String (enum: ['design', 'development', 'writing', ...]),
  price: Number (required, min: 0),
  images: [String],
  deliveryTime: Number (days),
  rating: {
    average: Number (default: 0),
    count: Number (default: 0)
  },
  tags: [String],
  status: Enum ['active', 'inactive', 'deleted'],
  totalOrders: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## 💡 Tips Implementasi

### Search & Filter Logic (application/use-cases/SearchServices.js)
```javascript
class SearchServices {
  async execute(filters) {
    const query = {};

    // Text search
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    // Filter by category
    if (filters.category) {
      query.category = filters.category;
    }

    // Filter by price range
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    // Filter by rating
    if (filters.minRating) {
      query['rating.average'] = { $gte: filters.minRating };
    }

    // Sort
    const sortOptions = {
      'price_asc': { price: 1 },
      'price_desc': { price: -1 },
      'rating': { 'rating.average': -1 },
      'popular': { totalOrders: -1 }
    };

    return await this.serviceRepository.find(
      query,
      sortOptions[filters.sortBy],
      filters.page,
      filters.limit
    );
  }
}
```

### Popular Services (application/use-cases/GetPopularServices.js)
```javascript
class GetPopularServices {
  async execute(limit = 10) {
    // Ambil layanan dengan rating tertinggi atau order terbanyak
    return await this.serviceRepository.find(
      { status: 'active' },
      { 'rating.average': -1, totalOrders: -1 },
      1,
      limit
    );
  }
}
```

## 🚀 Frontend Integration

### Create Service (Freelancer)
```javascript
POST /api/services
Headers: { Authorization: "Bearer <token>" }
Body: {
  title: "Logo Design Professional",
  description: "Desain logo modern...",
  category: "design",
  price: 250000,
  deliveryTime: 3,
  tags: ["logo", "branding", "modern"]
}
Response: {
  success: true,
  data: { serviceId, title, price }
}
```

### Search & Filter
```javascript
GET /api/services?search=logo&category=design&minPrice=100000&maxPrice=500000
Response: {
  success: true,
  data: {
    services: [...],
    pagination: {
      page: 1,
      limit: 10,
      total: 50
    }
  }
}
```

### Get Service Detail
```javascript
GET /api/services/:id
Response: {
  success: true,
  data: {
    serviceId,
    title,
    description,
    price,
    freelancer: { id, name, avatar },
    rating: { average: 4.5, count: 20 },
    images: [...]
  }
}
```
