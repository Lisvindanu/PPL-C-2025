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
│   │   └── SequelizeServiceRepository.js
│   ├── models/
│   │   └── ServiceModel.js      # Sequelize Model
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

## 📦 Database Schema

### 1. `kategori` (Service Categories)

```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('kategori', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    nama: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    deskripsi: DataTypes.TEXT,
    icon: DataTypes.STRING(255),
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['slug'] }
    ]
  });

  return Category;
};
```

### 2. `layanan` (Main Service Table)

```javascript
// Sequelize Model Definition
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Service = sequelize.define('layanan', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    freelancer_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    kategori_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'kategori', key: 'id' }
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    harga: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    waktu_pengerjaan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    batas_revisi: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    thumbnail: DataTypes.STRING(255),
    gambar: DataTypes.JSON,
    rating_rata_rata: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0
    },
    jumlah_rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_pesanan: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    jumlah_dilihat: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('draft', 'aktif', 'nonaktif'),
      defaultValue: 'draft'
    }
  }, {
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['freelancer_id'] },
      { fields: ['kategori_id'] },
      { fields: ['status'] },
      { type: 'FULLTEXT', fields: ['judul', 'deskripsi'] }
    ]
  });

  return Service;
};
```

### 3. `paket_layanan` (Service Packages: Basic/Standard/Premium)

```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ServicePackage = sequelize.define('paket_layanan', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    layanan_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      references: { model: 'layanan', key: 'id' },
      onDelete: 'CASCADE'
    },
    tipe: {
      type: DataTypes.ENUM('basic', 'standard', 'premium'),
      allowNull: false
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    deskripsi: DataTypes.TEXT,
    harga: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    waktu_pengerjaan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    batas_revisi: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    fitur: DataTypes.JSON
  }, {
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['layanan_id'] },
      { unique: true, fields: ['layanan_id', 'tipe'], name: 'unique_layanan_paket' }
    ]
  });

  return ServicePackage;
};
```

## 💡 Tips Implementasi

### Search & Filter Logic (application/use-cases/SearchServices.js)
```javascript
class SearchServices {
  async execute(filters) {
    const { Op } = require('sequelize');
    const where = {};
    const order = [];

    // Text search using FULLTEXT index
    if (filters.search) {
      where[Op.or] = [
        { judul: { [Op.like]: `%${filters.search}%` } },
        { deskripsi: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    // Filter by category
    if (filters.category) {
      where.kategori_id = filters.category;
    }

    // Filter by price range
    if (filters.minPrice || filters.maxPrice) {
      where.harga = {};
      if (filters.minPrice) where.harga[Op.gte] = filters.minPrice;
      if (filters.maxPrice) where.harga[Op.lte] = filters.maxPrice;
    }

    // Filter by rating
    if (filters.minRating) {
      where.rating_rata_rata = { [Op.gte]: filters.minRating };
    }

    // Sort options
    const sortOptions = {
      'price_asc': [['harga', 'ASC']],
      'price_desc': [['harga', 'DESC']],
      'rating': [['rating_rata_rata', 'DESC']],
      'popular': [['total_pesanan', 'DESC']]
    };

    const offset = (filters.page - 1) * filters.limit;

    return await this.serviceRepository.findAndCountAll({
      where,
      order: sortOptions[filters.sortBy] || [['created_at', 'DESC']],
      limit: filters.limit,
      offset
    });
  }
}
```

### Popular Services (application/use-cases/GetPopularServices.js)
```javascript
class GetPopularServices {
  async execute(limit = 10) {
    // Ambil layanan dengan rating tertinggi atau order terbanyak
    return await this.serviceRepository.findAll({
      where: { status: 'aktif' },
      order: [
        ['rating_rata_rata', 'DESC'],
        ['total_pesanan', 'DESC']
      ],
      limit
    });
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
