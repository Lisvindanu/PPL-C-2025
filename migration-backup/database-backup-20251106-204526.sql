-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: PPL_2025_C
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aktivitas_user`
--

DROP TABLE IF EXISTS `aktivitas_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aktivitas_user` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users',
  `tipe_aktivitas` enum('lihat_layanan','cari','tambah_favorit','buat_pesanan') NOT NULL COMMENT 'Tipe aktivitas user',
  `layanan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Foreign key ke layanan (optional)',
  `kata_kunci` varchar(255) DEFAULT NULL COMMENT 'Kata kunci pencarian',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `aktivitas_user_user_id` (`user_id`),
  KEY `aktivitas_user_layanan_id` (`layanan_id`),
  KEY `aktivitas_user_tipe_aktivitas` (`tipe_aktivitas`),
  CONSTRAINT `aktivitas_user_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `aktivitas_user_ibfk_2` FOREIGN KEY (`layanan_id`) REFERENCES `layanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aktivitas_user`
--

LOCK TABLES `aktivitas_user` WRITE;
/*!40000 ALTER TABLE `aktivitas_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `aktivitas_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dispute`
--

DROP TABLE IF EXISTS `dispute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dispute` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `pesanan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke pesanan',
  `pembayaran_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke pembayaran',
  `escrow_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke escrow',
  `diajukan_oleh` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (yang mengajukan dispute)',
  `tipe` enum('not_as_described','low_quality','late_delivery','communication_issue','other') NOT NULL COMMENT 'Tipe dispute',
  `alasan` text NOT NULL COMMENT 'Alasan detail dispute',
  `bukti` json DEFAULT NULL COMMENT 'Array URL bukti (screenshot, file, dll)',
  `status` enum('open','under_review','resolved','closed') NOT NULL DEFAULT 'open' COMMENT 'Status dispute',
  `keputusan` enum('client_win','freelancer_win','partial_refund','no_action') DEFAULT NULL COMMENT 'Keputusan admin',
  `alasan_keputusan` text COMMENT 'Alasan keputusan admin',
  `dibuka_pada` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu dispute dibuka',
  `diputuskan_pada` datetime DEFAULT NULL COMMENT 'Waktu dispute diputuskan',
  `diputuskan_oleh` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Foreign key ke users (admin yang memutuskan)',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pembayaran_id` (`pembayaran_id`),
  KEY `escrow_id` (`escrow_id`),
  KEY `dispute_pesanan_id` (`pesanan_id`),
  KEY `dispute_status` (`status`),
  KEY `dispute_diajukan_oleh` (`diajukan_oleh`),
  KEY `dispute_diputuskan_oleh` (`diputuskan_oleh`),
  CONSTRAINT `dispute_ibfk_1` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanan` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `dispute_ibfk_2` FOREIGN KEY (`pembayaran_id`) REFERENCES `pembayaran` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `dispute_ibfk_3` FOREIGN KEY (`escrow_id`) REFERENCES `escrow` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `dispute_ibfk_4` FOREIGN KEY (`diajukan_oleh`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `dispute_ibfk_5` FOREIGN KEY (`diputuskan_oleh`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dispute`
--

LOCK TABLES `dispute` WRITE;
/*!40000 ALTER TABLE `dispute` DISABLE KEYS */;
/*!40000 ALTER TABLE `dispute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dispute_pesan`
--

DROP TABLE IF EXISTS `dispute_pesan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dispute_pesan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `dispute_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke dispute',
  `pengirim_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (pengirim: admin/client/freelancer)',
  `pesan` text NOT NULL COMMENT 'Isi pesan',
  `lampiran` json DEFAULT NULL COMMENT 'Array URL lampiran (bukti tambahan, screenshot, dll)',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `dispute_pesan_dispute_id` (`dispute_id`),
  KEY `dispute_pesan_pengirim_id` (`pengirim_id`),
  CONSTRAINT `dispute_pesan_ibfk_1` FOREIGN KEY (`dispute_id`) REFERENCES `dispute` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispute_pesan_ibfk_2` FOREIGN KEY (`pengirim_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dispute_pesan`
--

LOCK TABLES `dispute_pesan` WRITE;
/*!40000 ALTER TABLE `dispute_pesan` DISABLE KEYS */;
/*!40000 ALTER TABLE `dispute_pesan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `escrow`
--

DROP TABLE IF EXISTS `escrow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `escrow` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `pembayaran_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke pembayaran',
  `pesanan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke pesanan',
  `jumlah_ditahan` decimal(10,2) NOT NULL COMMENT 'Jumlah dana yang ditahan',
  `biaya_platform` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Biaya platform yang akan dipotong',
  `status` enum('held','released','refunded','disputed','partial_released','completed') NOT NULL DEFAULT 'held' COMMENT 'Status escrow',
  `ditahan_pada` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu dana mulai ditahan',
  `akan_dirilis_pada` datetime DEFAULT NULL COMMENT 'Waktu rencana rilis dana (biasanya +7 hari dari approval)',
  `dirilis_pada` datetime DEFAULT NULL COMMENT 'Waktu dana benar-benar dirilis',
  `alasan` text COMMENT 'Alasan/catatan terkait escrow',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `escrow_pembayaran_id` (`pembayaran_id`),
  KEY `escrow_pesanan_id` (`pesanan_id`),
  KEY `escrow_status` (`status`),
  KEY `escrow_akan_dirilis_pada` (`akan_dirilis_pada`),
  CONSTRAINT `escrow_ibfk_1` FOREIGN KEY (`pembayaran_id`) REFERENCES `pembayaran` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `escrow_ibfk_2` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanan` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `escrow`
--

LOCK TABLES `escrow` WRITE;
/*!40000 ALTER TABLE `escrow` DISABLE KEYS */;
/*!40000 ALTER TABLE `escrow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorit`
--

DROP TABLE IF EXISTS `favorit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorit` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users',
  `layanan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke layanan',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_layanan` (`user_id`,`layanan_id`),
  KEY `favorit_user_id` (`user_id`),
  KEY `favorit_layanan_id` (`layanan_id`),
  CONSTRAINT `favorit_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `favorit_ibfk_2` FOREIGN KEY (`layanan_id`) REFERENCES `layanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorit`
--

LOCK TABLES `favorit` WRITE;
/*!40000 ALTER TABLE `favorit` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kategori`
--

DROP TABLE IF EXISTS `kategori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kategori` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nama kategori (unique)',
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Slug untuk URL (unique)',
  `deskripsi` text COLLATE utf8mb4_unicode_ci COMMENT 'Deskripsi kategori',
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL icon kategori',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Status aktif/nonaktif',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nama` (`nama`),
  UNIQUE KEY `slug` (`slug`),
  KEY `kategori_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kategori`
--

LOCK TABLES `kategori` WRITE;
/*!40000 ALTER TABLE `kategori` DISABLE KEYS */;
INSERT INTO `kategori` VALUES ('183aa356-067f-4ed4-9020-ddd975bdcc6b','Data Science & Machine Learning','data-science-machine-learning','Analisis data dan implementasi machine learning untuk solusi bisnis cerdas',NULL,1,'2025-10-27 03:14:04','2025-10-27 03:14:04'),('26d06915-ed71-445e-ac6a-31b0191671d7','UI/UX Design','ui-ux-design','Desain antarmuka dan pengalaman pengguna yang menarik dan intuitif',NULL,1,'2025-10-27 03:14:04','2025-10-27 03:14:04'),('9ccd23bc-ceaf-4ae8-863c-f321c9bb81db','Pengembangan Aplikasi Mobile','pengembangan-aplikasi-mobile','Pembuatan aplikasi mobile Android dan iOS yang inovatif dan user-friendly',NULL,1,'2025-10-27 03:14:04','2025-10-27 03:14:04'),('d347ce69-0f3c-4db6-a2d3-931f3782a63a','Cybersecurity & Testing','cybersecurity-testing','Layanan keamanan siber dan pengujian aplikasi untuk melindungi sistem Anda',NULL,1,'2025-10-27 03:14:04','2025-10-27 03:14:04'),('d6ac872b-a155-44b0-b948-2b50e779378e','Copy Writing','copy-writing','Penulisan konten kreatif dan persuasif untuk berbagai kebutuhan marketing',NULL,1,'2025-10-27 03:14:04','2025-10-27 03:14:04'),('eb094a17-f75b-4c07-8652-345907849ab7','Pengembangan Website','pengembangan-website','Layanan pengembangan website profesional untuk berbagai kebutuhan bisnis',NULL,1,'2025-10-27 03:14:04','2025-10-27 03:14:04');
/*!40000 ALTER TABLE `kategori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `layanan`
--

DROP TABLE IF EXISTS `layanan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `layanan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `freelancer_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (freelancer)',
  `kategori_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke kategori',
  `judul` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Judul layanan',
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Slug untuk URL (unique)',
  `deskripsi` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Deskripsi detail layanan',
  `harga` decimal(10,2) NOT NULL COMMENT 'Harga layanan',
  `waktu_pengerjaan` int NOT NULL COMMENT 'Waktu pengerjaan (dalam hari)',
  `batas_revisi` int NOT NULL DEFAULT '1' COMMENT 'Batas revisi yang diberikan',
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL thumbnail utama',
  `gambar` json DEFAULT NULL COMMENT 'Array URL gambar tambahan',
  `rating_rata_rata` decimal(3,2) NOT NULL DEFAULT '0.00' COMMENT 'Rating rata-rata',
  `jumlah_rating` int NOT NULL DEFAULT '0' COMMENT 'Jumlah rating yang masuk',
  `total_pesanan` int NOT NULL DEFAULT '0' COMMENT 'Total pesanan',
  `jumlah_dilihat` int NOT NULL DEFAULT '0' COMMENT 'Jumlah views',
  `status` enum('draft','aktif','nonaktif') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft' COMMENT 'Status layanan',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `layanan_slug` (`slug`),
  KEY `layanan_freelancer_id` (`freelancer_id`),
  KEY `layanan_kategori_id` (`kategori_id`),
  KEY `layanan_status` (`status`),
  KEY `layanan_rating_rata_rata` (`rating_rata_rata`),
  CONSTRAINT `layanan_ibfk_1` FOREIGN KEY (`freelancer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `layanan_ibfk_2` FOREIGN KEY (`kategori_id`) REFERENCES `kategori` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `layanan`
--

LOCK TABLES `layanan` WRITE;
/*!40000 ALTER TABLE `layanan` DISABLE KEYS */;
INSERT INTO `layanan` VALUES ('bfa5833e-7b00-4356-b46e-41d28915db7d','b491c7d0-34df-4ff2-a28d-6b3a70498e29','d6ac872b-a155-44b0-b948-2b50e779378e','Layanan Profesional 1','layanan-profesional-1','Deskripsi layanan profesional yang berkualitas tinggi',500000.00,7,3,NULL,NULL,4.80,23,36,0,'aktif','2025-10-27 03:57:53','2025-10-27 03:57:53'),('c4c44a2f-c080-4300-99fd-4e6f6870bb05','682848ae-2465-47f2-bd7e-ac3ae4bdb77e','183aa356-067f-4ed4-9020-ddd975bdcc6b','Layanan Profesional 3','layanan-profesional-3','Deskripsi layanan profesional yang berkualitas tinggi',250000.00,5,3,NULL,NULL,4.60,15,17,0,'aktif','2025-10-27 03:57:53','2025-10-27 03:57:53'),('e5725781-f685-4567-bb26-87cc7ae8eccb','07ff6d84-ac58-409d-8439-bd4341ebf1b0','d347ce69-0f3c-4db6-a2d3-931f3782a63a','Layanan Profesional 2','layanan-profesional-2','Deskripsi layanan profesional yang berkualitas tinggi',1000000.00,7,3,NULL,NULL,4.90,84,26,0,'aktif','2025-10-27 03:57:53','2025-10-27 03:57:53');
/*!40000 ALTER TABLE `layanan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_aktivitas_admin`
--

DROP TABLE IF EXISTS `log_aktivitas_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_aktivitas_admin` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `admin_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (admin)',
  `aksi` enum('block_user','unblock_user','block_service','unblock_service','delete_review','approve_withdrawal','reject_withdrawal','update_user','export_report') NOT NULL COMMENT 'Jenis aksi admin',
  `target_type` enum('user','layanan','ulasan','pesanan','pembayaran','system') NOT NULL COMMENT 'Tipe target',
  `target_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ID target',
  `detail` json DEFAULT NULL COMMENT 'Detail aktivitas dalam JSON',
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'IP address admin',
  `user_agent` text COMMENT 'User agent browser',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `log_aktivitas_admin_admin_id` (`admin_id`),
  KEY `log_aktivitas_admin_aksi` (`aksi`),
  KEY `log_aktivitas_admin_target_type_target_id` (`target_type`,`target_id`),
  KEY `log_aktivitas_admin_created_at` (`created_at`),
  CONSTRAINT `log_aktivitas_admin_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_aktivitas_admin`
--

LOCK TABLES `log_aktivitas_admin` WRITE;
/*!40000 ALTER TABLE `log_aktivitas_admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_aktivitas_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metode_pembayaran`
--

DROP TABLE IF EXISTS `metode_pembayaran`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metode_pembayaran` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users',
  `tipe` enum('rekening_bank','e_wallet','kartu_kredit') NOT NULL COMMENT 'Tipe metode pembayaran',
  `provider` varchar(100) NOT NULL COMMENT 'Provider (BCA, Mandiri, GoPay, dll)',
  `nomor_rekening` varchar(50) DEFAULT NULL COMMENT 'Nomor rekening/kartu',
  `nama_pemilik` varchar(255) DEFAULT NULL COMMENT 'Nama pemilik rekening/kartu',
  `empat_digit_terakhir` varchar(4) DEFAULT NULL COMMENT '4 digit terakhir untuk display',
  `is_default` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Metode pembayaran default',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `metode_pembayaran_user_id` (`user_id`),
  CONSTRAINT `metode_pembayaran_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metode_pembayaran`
--

LOCK TABLES `metode_pembayaran` WRITE;
/*!40000 ALTER TABLE `metode_pembayaran` DISABLE KEYS */;
/*!40000 ALTER TABLE `metode_pembayaran` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifikasi`
--

DROP TABLE IF EXISTS `notifikasi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifikasi` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users',
  `tipe` enum('pesanan_baru','pesanan_diterima','pesanan_ditolak','pesanan_selesai','pembayaran_berhasil','pesan_baru','ulasan_baru') NOT NULL COMMENT 'Tipe notifikasi',
  `judul` varchar(255) NOT NULL COMMENT 'Judul notifikasi',
  `pesan` text NOT NULL COMMENT 'Isi notifikasi',
  `related_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ID relasi (pesanan_id, pembayaran_id, dll)',
  `related_type` varchar(50) DEFAULT NULL COMMENT 'Tipe relasi (pesanan, pembayaran, dll)',
  `is_read` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Status sudah dibaca',
  `dibaca_pada` datetime DEFAULT NULL COMMENT 'Waktu dibaca',
  `dikirim_via_email` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Status dikirim via email',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `notifikasi_user_id` (`user_id`),
  KEY `notifikasi_is_read` (`is_read`),
  CONSTRAINT `notifikasi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifikasi`
--

LOCK TABLES `notifikasi` WRITE;
/*!40000 ALTER TABLE `notifikasi` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifikasi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paket_layanan`
--

DROP TABLE IF EXISTS `paket_layanan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paket_layanan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `layanan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke layanan',
  `tipe` enum('basic','standard','premium') NOT NULL COMMENT 'Tipe paket',
  `nama` varchar(100) NOT NULL COMMENT 'Nama paket',
  `deskripsi` text COMMENT 'Deskripsi paket',
  `harga` decimal(10,2) NOT NULL COMMENT 'Harga paket',
  `waktu_pengerjaan` int NOT NULL COMMENT 'Waktu pengerjaan (hari)',
  `batas_revisi` int NOT NULL DEFAULT '1' COMMENT 'Batas revisi',
  `fitur` json DEFAULT NULL COMMENT 'Array fitur yang termasuk',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_layanan_paket` (`layanan_id`,`tipe`),
  KEY `paket_layanan_layanan_id` (`layanan_id`),
  CONSTRAINT `paket_layanan_ibfk_1` FOREIGN KEY (`layanan_id`) REFERENCES `layanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paket_layanan`
--

LOCK TABLES `paket_layanan` WRITE;
/*!40000 ALTER TABLE `paket_layanan` DISABLE KEYS */;
INSERT INTO `paket_layanan` VALUES ('107ae9de-93d1-4d98-939e-6ee70ece768a','c4c44a2f-c080-4300-99fd-4e6f6870bb05','basic','Paket Basic 3','Paket dasar dengan fitur lengkap',250000.00,5,3,'[\"Fitur 1\", \"Fitur 2\", \"Revisi 3x\"]','2025-10-27 03:57:53','2025-10-27 03:57:53'),('22bf40ac-cbb0-44a5-9800-ad187dc1fe9a','bfa5833e-7b00-4356-b46e-41d28915db7d','basic','Paket Basic 1','Paket dasar dengan fitur lengkap',500000.00,7,3,'[\"Fitur 1\", \"Fitur 2\", \"Revisi 3x\"]','2025-10-27 03:57:53','2025-10-27 03:57:53'),('7c6ed7f3-86cb-463b-bb6a-b78dada26203','e5725781-f685-4567-bb26-87cc7ae8eccb','basic','Paket Basic 2','Paket dasar dengan fitur lengkap',1000000.00,7,3,'[\"Fitur 1\", \"Fitur 2\", \"Revisi 3x\"]','2025-10-27 03:57:53','2025-10-27 03:57:53');
/*!40000 ALTER TABLE `paket_layanan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pembayaran`
--

DROP TABLE IF EXISTS `pembayaran`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pembayaran` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `pesanan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke pesanan',
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users',
  `transaction_id` varchar(255) NOT NULL COMMENT 'Transaction ID (unique)',
  `external_id` varchar(255) DEFAULT NULL COMMENT 'External ID dari payment gateway',
  `jumlah` decimal(10,2) NOT NULL COMMENT 'Jumlah pembayaran',
  `biaya_platform` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Biaya platform',
  `biaya_payment_gateway` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Biaya payment gateway',
  `total_bayar` decimal(10,2) NOT NULL COMMENT 'Total yang dibayar',
  `metode_pembayaran` enum('transfer_bank','e_wallet','kartu_kredit','qris','virtual_account') NOT NULL COMMENT 'Metode pembayaran',
  `channel` varchar(100) DEFAULT NULL COMMENT 'Channel pembayaran (gopay, ovo, bca_va, dll)',
  `payment_gateway` enum('midtrans','xendit','mock','manual') NOT NULL DEFAULT 'mock' COMMENT 'Payment gateway yang digunakan',
  `payment_url` text COMMENT 'URL redirect ke payment gateway',
  `status` enum('menunggu','berhasil','gagal','kadaluarsa') NOT NULL DEFAULT 'menunggu' COMMENT 'Status pembayaran',
  `callback_data` json DEFAULT NULL COMMENT 'Data callback dari payment gateway',
  `callback_signature` varchar(500) DEFAULT NULL COMMENT 'Signature dari callback',
  `nomor_invoice` varchar(50) DEFAULT NULL COMMENT 'Nomor invoice (unique)',
  `invoice_url` varchar(255) DEFAULT NULL COMMENT 'URL invoice PDF',
  `dibayar_pada` datetime DEFAULT NULL COMMENT 'Waktu pembayaran berhasil',
  `kadaluarsa_pada` datetime DEFAULT NULL COMMENT 'Waktu kadaluarsa',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  UNIQUE KEY `nomor_invoice` (`nomor_invoice`),
  KEY `pembayaran_transaction_id` (`transaction_id`),
  KEY `pembayaran_pesanan_id` (`pesanan_id`),
  KEY `pembayaran_status` (`status`),
  KEY `pembayaran_user_id` (`user_id`),
  KEY `pembayaran_payment_gateway` (`payment_gateway`),
  CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanan` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pembayaran_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pembayaran`
--

LOCK TABLES `pembayaran` WRITE;
/*!40000 ALTER TABLE `pembayaran` DISABLE KEYS */;
INSERT INTO `pembayaran` VALUES ('126c344f-4b35-454c-bb00-6a1f2899ef7b','e18f69c5-71b2-423b-b85a-63575f65ee64','a9789e1e-cdde-4c37-9ab6-923bbbb6d59e','TXN-1761537473360-3',NULL,1000000.00,100000.00,0.00,1100000.00,'transfer_bank','bca_va','mock',NULL,'berhasil',NULL,NULL,'INV-2025-00004',NULL,'2025-09-27 03:57:53',NULL,'2025-09-27 03:57:53','2025-09-27 03:57:53'),('2028d194-8a50-4652-a644-815782897b88','a9cb20f8-6f95-40ac-b3e0-ccb2688eff06','7cbb04ce-dda3-42ef-a20f-d2337f538140','PAY-1762149556213-4JI516','MOCK-1762149556213-681F8B26',500000.00,25000.00,5000.00,530000.00,'e_wallet','gopay','mock','http://localhost:5001/mock-payment/MOCK-1762149556213-681F8B26','menunggu',NULL,NULL,NULL,NULL,NULL,'2025-11-04 05:59:16','2025-11-03 05:59:16','2025-11-03 05:59:16'),('8caf824b-4947-4eb8-9a3f-44148c0828f0','a9cb20f8-6f95-40ac-b3e0-ccb2688eff06','7cbb04ce-dda3-42ef-a20f-d2337f538140','PAY-1762149566653-FM7OVQ','MOCK-1762149566667-02855C7F',500000.00,25000.00,5000.00,530000.00,'e_wallet','gopay','mock','http://localhost:5001/mock-payment/MOCK-1762149566667-02855C7F','menunggu',NULL,NULL,NULL,NULL,NULL,'2025-11-04 05:59:26','2025-11-03 05:59:26','2025-11-03 05:59:26'),('ae663434-9955-4d06-a6a5-f955bcd64f5c','f36e150e-cfce-4d22-9071-8c5a5f4b133b','80422de5-abfc-4047-9981-d54edb855f29','TXN-1761537473317-0',NULL,250000.00,25000.00,0.00,275000.00,'transfer_bank','bca_va','mock',NULL,'berhasil',NULL,NULL,'INV-2025-00001',NULL,'2025-05-27 03:57:53',NULL,'2025-05-27 03:57:53','2025-05-27 03:57:53'),('b92bd574-84d9-4b7b-8a4c-bf51c3297668','132ac55c-3a2b-48e1-8025-bff187b284cc','5437a8c0-5456-476a-88f1-e3083c453111','TXN-1761537473409-9',NULL,2000000.00,200000.00,0.00,2200000.00,'transfer_bank','bca_va','mock',NULL,'berhasil',NULL,NULL,'INV-2025-00010',NULL,'2025-08-27 03:57:53',NULL,'2025-08-27 03:57:53','2025-08-27 03:57:53'),('c764de65-4d6c-450c-a471-c06a5e3b8bd2','4f6dc3a7-19a1-4ea6-b3c4-5aaf9cd82a2b','5437a8c0-5456-476a-88f1-e3083c453111','TXN-1761537473333-1',NULL,500000.00,50000.00,0.00,550000.00,'e_wallet','gopay','mock',NULL,'berhasil',NULL,NULL,'INV-2025-00002',NULL,'2025-08-27 03:57:53',NULL,'2025-08-27 03:57:53','2025-08-27 03:57:53'),('cbfb6126-b890-4f9e-9963-550a7ecf0ee2','379ed686-5f91-4fc2-adfd-66014550f9ae','80422de5-abfc-4047-9981-d54edb855f29','TXN-1761537473370-4',NULL,2000000.00,200000.00,0.00,2200000.00,'e_wallet','gopay','mock',NULL,'berhasil',NULL,NULL,'INV-2025-00005',NULL,'2025-10-27 03:57:53',NULL,'2025-10-27 03:57:53','2025-10-27 03:57:53'),('ded6cfa8-b93a-48aa-a40a-693250131444','e24462c2-e1de-4976-a4dd-552c83027a26','a69e0a64-7339-45be-bfdb-e1bca1963119','TXN-1761537473351-2',NULL,750000.00,75000.00,0.00,825000.00,'qris','qris','mock',NULL,'berhasil',NULL,NULL,'INV-2025-00003',NULL,'2025-05-27 03:57:53',NULL,'2025-05-27 03:57:53','2025-05-27 03:57:53'),('e11e1419-b17f-4bd0-91e2-63e7d39c3f19','487cbee7-10d1-41ce-9a5e-62e3b24c04a9','80422de5-abfc-4047-9981-d54edb855f29','TXN-1761537473398-8',NULL,1000000.00,100000.00,0.00,1100000.00,'qris','qris','mock',NULL,'berhasil',NULL,NULL,'INV-2025-00009',NULL,'2025-07-27 03:57:53',NULL,'2025-07-27 03:57:53','2025-07-27 03:57:53'),('e6aee7ce-43a1-458a-8eba-e5e4bfadd51c','c119acb0-f341-42ee-8aad-427044ae8a4b','5437a8c0-5456-476a-88f1-e3083c453111','TXN-1761537473380-5',NULL,250000.00,25000.00,0.00,275000.00,'qris','qris','mock',NULL,'berhasil',NULL,NULL,'INV-2025-00006',NULL,'2025-10-27 03:57:53',NULL,'2025-10-27 03:57:53','2025-10-27 03:57:53');
/*!40000 ALTER TABLE `pembayaran` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pencairan_dana`
--

DROP TABLE IF EXISTS `pencairan_dana`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pencairan_dana` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `escrow_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke escrow',
  `freelancer_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (freelancer)',
  `metode_pembayaran_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Foreign key ke metode_pembayaran (rekening tujuan)',
  `jumlah` decimal(10,2) NOT NULL COMMENT 'Jumlah kotor (sebelum potong fee)',
  `biaya_platform` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Fee platform yang dipotong',
  `jumlah_bersih` decimal(10,2) NOT NULL COMMENT 'Jumlah bersih yang diterima freelancer',
  `metode_pencairan` enum('transfer_bank','e_wallet') NOT NULL COMMENT 'Metode pencairan dana',
  `nomor_rekening` varchar(50) DEFAULT NULL COMMENT 'Nomor rekening/e-wallet tujuan',
  `nama_pemilik` varchar(255) DEFAULT NULL COMMENT 'Nama pemilik rekening',
  `status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending' COMMENT 'Status pencairan',
  `bukti_transfer` varchar(255) DEFAULT NULL COMMENT 'URL bukti transfer dari admin',
  `catatan` text COMMENT 'Catatan tambahan',
  `dicairkan_pada` datetime DEFAULT NULL COMMENT 'Waktu dana dicairkan',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `metode_pembayaran_id` (`metode_pembayaran_id`),
  KEY `pencairan_dana_escrow_id` (`escrow_id`),
  KEY `pencairan_dana_freelancer_id` (`freelancer_id`),
  KEY `pencairan_dana_status` (`status`),
  CONSTRAINT `pencairan_dana_ibfk_1` FOREIGN KEY (`escrow_id`) REFERENCES `escrow` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pencairan_dana_ibfk_2` FOREIGN KEY (`freelancer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pencairan_dana_ibfk_3` FOREIGN KEY (`metode_pembayaran_id`) REFERENCES `metode_pembayaran` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pencairan_dana`
--

LOCK TABLES `pencairan_dana` WRITE;
/*!40000 ALTER TABLE `pencairan_dana` DISABLE KEYS */;
/*!40000 ALTER TABLE `pencairan_dana` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `percakapan`
--

DROP TABLE IF EXISTS `percakapan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `percakapan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `user1_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (user 1)',
  `user2_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (user 2)',
  `pesanan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Foreign key ke pesanan (optional)',
  `pesan_terakhir` text COMMENT 'Preview pesan terakhir',
  `pesan_terakhir_pada` datetime DEFAULT NULL COMMENT 'Timestamp pesan terakhir',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_conversation` (`user1_id`,`user2_id`),
  KEY `pesanan_id` (`pesanan_id`),
  KEY `percakapan_user1_id` (`user1_id`),
  KEY `percakapan_user2_id` (`user2_id`),
  CONSTRAINT `percakapan_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `percakapan_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `percakapan_ibfk_3` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `percakapan`
--

LOCK TABLES `percakapan` WRITE;
/*!40000 ALTER TABLE `percakapan` DISABLE KEYS */;
/*!40000 ALTER TABLE `percakapan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pesan`
--

DROP TABLE IF EXISTS `pesan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pesan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `percakapan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke percakapan',
  `pengirim_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (pengirim)',
  `pesan` text NOT NULL COMMENT 'Isi pesan',
  `tipe` enum('text','image','file') NOT NULL DEFAULT 'text' COMMENT 'Tipe pesan',
  `lampiran` json DEFAULT NULL COMMENT 'Array URL lampiran',
  `is_read` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Status sudah dibaca',
  `dibaca_pada` datetime DEFAULT NULL COMMENT 'Waktu dibaca',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pesan_percakapan_id` (`percakapan_id`),
  KEY `pesan_pengirim_id` (`pengirim_id`),
  CONSTRAINT `pesan_ibfk_1` FOREIGN KEY (`percakapan_id`) REFERENCES `percakapan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pesan_ibfk_2` FOREIGN KEY (`pengirim_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pesan`
--

LOCK TABLES `pesan` WRITE;
/*!40000 ALTER TABLE `pesan` DISABLE KEYS */;
/*!40000 ALTER TABLE `pesan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pesanan`
--

DROP TABLE IF EXISTS `pesanan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pesanan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `nomor_pesanan` varchar(50) NOT NULL COMMENT 'Nomor pesanan (unique)',
  `client_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (client)',
  `freelancer_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (freelancer)',
  `layanan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke layanan',
  `paket_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Foreign key ke paket_layanan (optional)',
  `judul` varchar(255) NOT NULL COMMENT 'Judul pesanan',
  `deskripsi` text COMMENT 'Deskripsi pesanan',
  `catatan_client` text COMMENT 'Catatan dari client',
  `harga` decimal(10,2) NOT NULL COMMENT 'Harga layanan',
  `biaya_platform` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Biaya platform',
  `total_bayar` decimal(10,2) NOT NULL COMMENT 'Total yang harus dibayar',
  `waktu_pengerjaan` int NOT NULL COMMENT 'Waktu pengerjaan (hari)',
  `tenggat_waktu` datetime DEFAULT NULL COMMENT 'Deadline pengerjaan',
  `dikirim_pada` datetime DEFAULT NULL COMMENT 'Waktu freelancer kirim hasil',
  `selesai_pada` datetime DEFAULT NULL COMMENT 'Waktu pesanan selesai',
  `status` enum('menunggu_pembayaran','dibayar','dikerjakan','menunggu_review','revisi','selesai','dispute','dibatalkan','refunded') NOT NULL DEFAULT 'menunggu_pembayaran' COMMENT 'Status pesanan',
  `lampiran_client` json DEFAULT NULL COMMENT 'Array URL lampiran dari client',
  `lampiran_freelancer` json DEFAULT NULL COMMENT 'Array URL hasil dari freelancer',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nomor_pesanan` (`nomor_pesanan`),
  KEY `layanan_id` (`layanan_id`),
  KEY `paket_id` (`paket_id`),
  KEY `pesanan_nomor_pesanan` (`nomor_pesanan`),
  KEY `pesanan_client_id` (`client_id`),
  KEY `pesanan_freelancer_id` (`freelancer_id`),
  KEY `pesanan_status` (`status`),
  CONSTRAINT `pesanan_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pesanan_ibfk_2` FOREIGN KEY (`freelancer_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pesanan_ibfk_3` FOREIGN KEY (`layanan_id`) REFERENCES `layanan` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pesanan_ibfk_4` FOREIGN KEY (`paket_id`) REFERENCES `paket_layanan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pesanan`
--

LOCK TABLES `pesanan` WRITE;
/*!40000 ALTER TABLE `pesanan` DISABLE KEYS */;
INSERT INTO `pesanan` VALUES ('132ac55c-3a2b-48e1-8025-bff187b284cc','PES-2025-00010','5437a8c0-5456-476a-88f1-e3083c453111','b491c7d0-34df-4ff2-a28d-6b3a70498e29','bfa5833e-7b00-4356-b46e-41d28915db7d','22bf40ac-cbb0-44a5-9800-ad187dc1fe9a','Pesanan 10','Deskripsi pesanan untuk layanan profesional','Mohon dikerjakan dengan baik',2000000.00,200000.00,2200000.00,7,'2025-09-03 03:57:53',NULL,NULL,'selesai',NULL,NULL,'2025-08-27 03:57:53','2025-08-27 03:57:53'),('379ed686-5f91-4fc2-adfd-66014550f9ae','PES-2025-00005','80422de5-abfc-4047-9981-d54edb855f29','07ff6d84-ac58-409d-8439-bd4341ebf1b0','e5725781-f685-4567-bb26-87cc7ae8eccb','7c6ed7f3-86cb-463b-bb6a-b78dada26203','Pesanan 5','Deskripsi pesanan untuk layanan profesional','Mohon dikerjakan dengan baik',2000000.00,200000.00,2200000.00,7,'2025-11-03 03:57:53',NULL,NULL,'selesai',NULL,NULL,'2025-10-27 03:57:53','2025-10-27 03:57:53'),('487cbee7-10d1-41ce-9a5e-62e3b24c04a9','PES-2025-00009','80422de5-abfc-4047-9981-d54edb855f29','682848ae-2465-47f2-bd7e-ac3ae4bdb77e','c4c44a2f-c080-4300-99fd-4e6f6870bb05','107ae9de-93d1-4d98-939e-6ee70ece768a','Pesanan 9','Deskripsi pesanan untuk layanan profesional','Mohon dikerjakan dengan baik',1000000.00,100000.00,1100000.00,7,'2025-08-03 03:57:53',NULL,NULL,'dibayar',NULL,NULL,'2025-07-27 03:57:53','2025-07-27 03:57:53'),('4f6dc3a7-19a1-4ea6-b3c4-5aaf9cd82a2b','PES-2025-00002','5437a8c0-5456-476a-88f1-e3083c453111','07ff6d84-ac58-409d-8439-bd4341ebf1b0','e5725781-f685-4567-bb26-87cc7ae8eccb','7c6ed7f3-86cb-463b-bb6a-b78dada26203','Pesanan 2','Deskripsi pesanan untuk layanan profesional','Mohon dikerjakan dengan baik',500000.00,50000.00,550000.00,7,'2025-09-03 03:57:53',NULL,NULL,'selesai',NULL,NULL,'2025-08-27 03:57:53','2025-08-27 03:57:53'),('a9cb20f8-6f95-40ac-b3e0-ccb2688eff06','PES-2025-00008','a9789e1e-cdde-4c37-9ab6-923bbbb6d59e','07ff6d84-ac58-409d-8439-bd4341ebf1b0','e5725781-f685-4567-bb26-87cc7ae8eccb','7c6ed7f3-86cb-463b-bb6a-b78dada26203','Pesanan 8','Deskripsi pesanan untuk layanan profesional','Mohon dikerjakan dengan baik',750000.00,75000.00,825000.00,7,'2025-10-04 03:57:53',NULL,NULL,'menunggu_pembayaran',NULL,NULL,'2025-09-27 03:57:53','2025-09-27 03:57:53'),('be8e1686-e9f5-4cc5-8d42-f4ba10d35488','PES-2025-00007','a69e0a64-7339-45be-bfdb-e1bca1963119','b491c7d0-34df-4ff2-a28d-6b3a70498e29','bfa5833e-7b00-4356-b46e-41d28915db7d','22bf40ac-cbb0-44a5-9800-ad187dc1fe9a','Pesanan 7','Deskripsi pesanan untuk layanan profesional','Mohon dikerjakan dengan baik',500000.00,50000.00,550000.00,7,'2025-11-03 03:57:53',NULL,NULL,'dibatalkan',NULL,NULL,'2025-10-27 03:57:53','2025-10-27 03:57:53'),('c119acb0-f341-42ee-8aad-427044ae8a4b','PES-2025-00006','5437a8c0-5456-476a-88f1-e3083c453111','682848ae-2465-47f2-bd7e-ac3ae4bdb77e','c4c44a2f-c080-4300-99fd-4e6f6870bb05','107ae9de-93d1-4d98-939e-6ee70ece768a','Pesanan 6','Deskripsi pesanan untuk layanan profesional','Mohon dikerjakan dengan baik',250000.00,25000.00,275000.00,7,'2025-11-03 03:57:53',NULL,NULL,'selesai',NULL,NULL,'2025-10-27 03:57:53','2025-10-27 03:57:53'),('e18f69c5-71b2-423b-b85a-63575f65ee64','PES-2025-00004','a9789e1e-cdde-4c37-9ab6-923bbbb6d59e','b491c7d0-34df-4ff2-a28d-6b3a70498e29','bfa5833e-7b00-4356-b46e-41d28915db7d','22bf40ac-cbb0-44a5-9800-ad187dc1fe9a','Pesanan 4','Deskripsi pesanan untuk layanan profesional','Mohon dikerjakan dengan baik',1000000.00,100000.00,1100000.00,7,'2025-10-04 03:57:53',NULL,NULL,'selesai',NULL,NULL,'2025-09-27 03:57:53','2025-09-27 03:57:53'),('e24462c2-e1de-4976-a4dd-552c83027a26','PES-2025-00003','a69e0a64-7339-45be-bfdb-e1bca1963119','682848ae-2465-47f2-bd7e-ac3ae4bdb77e','c4c44a2f-c080-4300-99fd-4e6f6870bb05','107ae9de-93d1-4d98-939e-6ee70ece768a','Pesanan 3','Deskripsi pesanan untuk layanan profesional','Mohon dikerjakan dengan baik',750000.00,75000.00,825000.00,7,'2025-06-03 03:57:53',NULL,NULL,'selesai',NULL,NULL,'2025-05-27 03:57:53','2025-05-27 03:57:53'),('f36e150e-cfce-4d22-9071-8c5a5f4b133b','PES-2025-00001','80422de5-abfc-4047-9981-d54edb855f29','b491c7d0-34df-4ff2-a28d-6b3a70498e29','bfa5833e-7b00-4356-b46e-41d28915db7d','22bf40ac-cbb0-44a5-9800-ad187dc1fe9a','Pesanan 1','Deskripsi pesanan untuk layanan profesional','Mohon dikerjakan dengan baik',250000.00,25000.00,275000.00,7,'2025-06-03 03:57:53',NULL,NULL,'selesai',NULL,NULL,'2025-05-27 03:57:53','2025-05-27 03:57:53');
/*!40000 ALTER TABLE `pesanan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preferensi_user`
--

DROP TABLE IF EXISTS `preferensi_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preferensi_user` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (unique)',
  `kategori_favorit` json DEFAULT NULL COMMENT 'Array kategori favorit',
  `budget_min` decimal(10,2) DEFAULT NULL COMMENT 'Budget minimum',
  `budget_max` decimal(10,2) DEFAULT NULL COMMENT 'Budget maksimum',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `preferensi_user_user_id` (`user_id`),
  CONSTRAINT `preferensi_user_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preferensi_user`
--

LOCK TABLES `preferensi_user` WRITE;
/*!40000 ALTER TABLE `preferensi_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `preferensi_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profil_freelancer`
--

DROP TABLE IF EXISTS `profil_freelancer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profil_freelancer` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (unique)',
  `judul_profesi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Professional title (e.g., "Expert Logo Designer")',
  `keahlian` json DEFAULT NULL COMMENT 'Array of skills (JSON format)',
  `portfolio_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Portfolio website URL',
  `total_pekerjaan_selesai` int NOT NULL DEFAULT '0' COMMENT 'Total completed jobs',
  `rating_rata_rata` decimal(3,2) NOT NULL DEFAULT '0.00' COMMENT 'Average rating (0.00 - 5.00)',
  `total_ulasan` int NOT NULL DEFAULT '0' COMMENT 'Total number of reviews',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `profil_freelancer_user_id` (`user_id`),
  KEY `profil_freelancer_rating_rata_rata` (`rating_rata_rata`),
  KEY `profil_freelancer_total_pekerjaan_selesai` (`total_pekerjaan_selesai`),
  CONSTRAINT `profil_freelancer_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profil_freelancer`
--

LOCK TABLES `profil_freelancer` WRITE;
/*!40000 ALTER TABLE `profil_freelancer` DISABLE KEYS */;
INSERT INTO `profil_freelancer` VALUES ('7aae7f5f-2104-425f-ada4-a2fb7c6c6899','07ff6d84-ac58-409d-8439-bd4341ebf1b0','Professional Freelancer','[\"Design\", \"Development\"]',NULL,27,4.60,33,'2025-10-27 03:57:53','2025-10-27 03:57:53'),('7c61de08-d0a7-462f-97b0-d4e4670a7efb','b491c7d0-34df-4ff2-a28d-6b3a70498e29','Professional Freelancer','[\"Design\", \"Development\"]',NULL,19,5.00,25,'2025-10-27 03:57:53','2025-10-27 03:57:53'),('a04711fb-5c63-4edb-aa2e-f14e9acae5d2','682848ae-2465-47f2-bd7e-ac3ae4bdb77e','Professional Freelancer','[\"Design\", \"Development\"]',NULL,49,4.90,17,'2025-10-27 03:57:53','2025-10-27 03:57:53');
/*!40000 ALTER TABLE `profil_freelancer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refund`
--

DROP TABLE IF EXISTS `refund`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refund` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `pembayaran_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke pembayaran',
  `escrow_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke escrow',
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (penerima refund)',
  `jumlah_refund` decimal(10,2) NOT NULL COMMENT 'Jumlah yang di-refund',
  `alasan` text NOT NULL COMMENT 'Alasan refund',
  `status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending' COMMENT 'Status refund',
  `transaction_id` varchar(255) DEFAULT NULL COMMENT 'Transaction ID refund dari payment gateway',
  `diproses_pada` datetime DEFAULT NULL COMMENT 'Waktu mulai diproses',
  `selesai_pada` datetime DEFAULT NULL COMMENT 'Waktu refund selesai',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `refund_pembayaran_id` (`pembayaran_id`),
  KEY `refund_escrow_id` (`escrow_id`),
  KEY `refund_user_id` (`user_id`),
  KEY `refund_status` (`status`),
  CONSTRAINT `refund_ibfk_1` FOREIGN KEY (`pembayaran_id`) REFERENCES `pembayaran` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `refund_ibfk_2` FOREIGN KEY (`escrow_id`) REFERENCES `escrow` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `refund_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refund`
--

LOCK TABLES `refund` WRITE;
/*!40000 ALTER TABLE `refund` DISABLE KEYS */;
/*!40000 ALTER TABLE `refund` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rekomendasi_layanan`
--

DROP TABLE IF EXISTS `rekomendasi_layanan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rekomendasi_layanan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users',
  `layanan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke layanan',
  `skor` decimal(5,2) NOT NULL COMMENT 'Skor rekomendasi',
  `alasan` varchar(255) DEFAULT NULL COMMENT 'Alasan rekomendasi',
  `sudah_ditampilkan` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Status sudah ditampilkan',
  `sudah_diklik` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Status sudah diklik',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `kadaluarsa_pada` datetime DEFAULT NULL COMMENT 'Waktu rekomendasi kadaluarsa',
  PRIMARY KEY (`id`),
  KEY `rekomendasi_layanan_user_id` (`user_id`),
  KEY `rekomendasi_layanan_layanan_id` (`layanan_id`),
  KEY `rekomendasi_layanan_skor` (`skor`),
  CONSTRAINT `rekomendasi_layanan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rekomendasi_layanan_ibfk_2` FOREIGN KEY (`layanan_id`) REFERENCES `layanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rekomendasi_layanan`
--

LOCK TABLES `rekomendasi_layanan` WRITE;
/*!40000 ALTER TABLE `rekomendasi_layanan` DISABLE KEYS */;
/*!40000 ALTER TABLE `rekomendasi_layanan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `revisi`
--

DROP TABLE IF EXISTS `revisi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `revisi` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `pesanan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke pesanan',
  `ke_berapa` int NOT NULL COMMENT 'Revisi ke berapa (1, 2, 3, dst)',
  `catatan` text NOT NULL COMMENT 'Catatan revisi dari client',
  `lampiran` json DEFAULT NULL COMMENT 'Array URL lampiran referensi revisi',
  `status` enum('diminta','dikerjakan','selesai','ditolak') NOT NULL DEFAULT 'diminta' COMMENT 'Status revisi',
  `diminta_pada` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Waktu revisi diminta',
  `selesai_pada` datetime DEFAULT NULL COMMENT 'Waktu revisi selesai dikerjakan',
  `lampiran_revisi` json DEFAULT NULL COMMENT 'Array URL hasil revisi dari freelancer',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `revisi_pesanan_id` (`pesanan_id`),
  KEY `revisi_status` (`status`),
  CONSTRAINT `revisi_ibfk_1` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `revisi`
--

LOCK TABLES `revisi` WRITE;
/*!40000 ALTER TABLE `revisi` DISABLE KEYS */;
/*!40000 ALTER TABLE `revisi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_kategori`
--

DROP TABLE IF EXISTS `sub_kategori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_kategori` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `id_kategori` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke tabel kategori',
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nama sub kategori',
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Slug untuk URL (unique)',
  `deskripsi` text COLLATE utf8mb4_unicode_ci COMMENT 'Deskripsi sub kategori',
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL icon sub kategori',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Status aktif/nonaktif',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `sub_kategori_slug` (`slug`),
  KEY `sub_kategori_id_kategori` (`id_kategori`),
  CONSTRAINT `sub_kategori_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_kategori`
--

LOCK TABLES `sub_kategori` WRITE;
/*!40000 ALTER TABLE `sub_kategori` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub_kategori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ulasan`
--

DROP TABLE IF EXISTS `ulasan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ulasan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `pesanan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke pesanan (unique)',
  `layanan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke layanan',
  `pemberi_ulasan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (pemberi ulasan)',
  `penerima_ulasan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users (penerima ulasan)',
  `rating` int NOT NULL COMMENT 'Rating 1-5',
  `judul` varchar(255) DEFAULT NULL COMMENT 'Judul ulasan',
  `komentar` text NOT NULL COMMENT 'Isi ulasan',
  `gambar` json DEFAULT NULL COMMENT 'Array URL gambar',
  `balasan` text COMMENT 'Balasan dari freelancer',
  `dibalas_pada` datetime DEFAULT NULL COMMENT 'Waktu balasan',
  `is_approved` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Status approval admin',
  `is_reported` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Status report',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pesanan_id` (`pesanan_id`),
  KEY `ulasan_layanan_id` (`layanan_id`),
  KEY `ulasan_rating` (`rating`),
  KEY `ulasan_pemberi_ulasan_id` (`pemberi_ulasan_id`),
  KEY `ulasan_penerima_ulasan_id` (`penerima_ulasan_id`),
  CONSTRAINT `ulasan_ibfk_1` FOREIGN KEY (`pesanan_id`) REFERENCES `pesanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ulasan_ibfk_2` FOREIGN KEY (`layanan_id`) REFERENCES `layanan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ulasan_ibfk_3` FOREIGN KEY (`pemberi_ulasan_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ulasan_ibfk_4` FOREIGN KEY (`penerima_ulasan_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_rating` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ulasan`
--

LOCK TABLES `ulasan` WRITE;
/*!40000 ALTER TABLE `ulasan` DISABLE KEYS */;
/*!40000 ALTER TABLE `ulasan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tokens`
--

DROP TABLE IF EXISTS `user_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_tokens` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Foreign key ke users',
  `token` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Token string',
  `type` enum('email_verification','password_reset') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Token type',
  `expires_at` datetime NOT NULL COMMENT 'Token expiration time',
  `used_at` datetime DEFAULT NULL COMMENT 'When token was used',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_tokens_token` (`token`),
  KEY `user_tokens_user_id` (`user_id`),
  KEY `user_tokens_type` (`type`),
  KEY `user_tokens_expires_at` (`expires_at`),
  CONSTRAINT `user_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tokens`
--

LOCK TABLES `user_tokens` WRITE;
/*!40000 ALTER TABLE `user_tokens` DISABLE KEYS */;
INSERT INTO `user_tokens` VALUES ('3feec833-13f4-4941-a649-8e9363328479','ac1ed5e4-ff58-4d96-a269-fbd1b5867082','85f41fb0-28ab-4bad-8f0d-fea7d7a7fc60','email_verification','2025-11-05 04:59:58',NULL,'2025-11-04 04:59:58'),('44c3f36b-4e1e-4931-8290-b244e51e995f','373e95d8-07dd-4ede-bae7-e11cd474a05a','069cf9c7-2a2e-4786-8850-8962e94e21d4','email_verification','2025-11-04 14:23:28',NULL,'2025-11-03 14:23:28'),('8f124d21-49de-49f8-a3d2-cb210aad5f4d','0b6915a7-a834-4935-af8a-57b6a154c9e2','01745154-ff6e-4b32-b981-799b8f449c9d','email_verification','2025-11-05 06:28:38',NULL,'2025-11-04 06:28:38'),('9a6c55f9-a57a-4d10-8a6b-13b23e4194f4','b28bf7f0-f6d4-40cd-8681-15474d901cbc','d4a6b7f5-e9ad-4be0-97a3-78836985f5d9','email_verification','2025-11-05 00:47:17',NULL,'2025-11-04 00:47:17'),('b55f0eba-cf0f-4cd0-a455-8744d72d85af','a716d48c-66a1-4546-b6c6-b561a7f243d4','37fc175d-4fa6-427a-9992-e8bef7a24cfe','email_verification','2025-11-05 05:09:24',NULL,'2025-11-04 05:09:24'),('da0515e7-5ad8-429f-8818-8cc04b5c67c1','8b9b9c0b-ee0a-4024-8ed0-104f4de88f71','1bdaae00-2df0-4f86-8153-75f45b61c6b7','email_verification','2025-11-05 05:23:55',NULL,'2025-11-04 05:23:55');
/*!40000 ALTER TABLE `user_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Primary key UUID',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email user (unique)',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hashed password',
  `role` enum('client','freelancer','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'client' COMMENT 'User role',
  `nama_depan` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'First name',
  `nama_belakang` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Last name',
  `no_telepon` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Phone number',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Avatar URL',
  `bio` text COLLATE utf8mb4_unicode_ci COMMENT 'User bio',
  `kota` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'City',
  `provinsi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Province',
  `is_active` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Account active status',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Email verification status',
  `email_verified_at` datetime DEFAULT NULL COMMENT 'Email verified timestamp',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `users_role` (`role`),
  KEY `users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('011f8372-2015-4258-97f8-9def4462e2b3','zabi@gmail.com','$2b$10$59us2RIe7mD4Bs7sVcZHluIvmYmQfxDcUJGcIuad9XMxFWsRaXeWa','client',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-11-03 09:53:43','2025-11-03 09:53:43'),('07ff6d84-ac58-409d-8439-bd4341ebf1b0','freelancer@skillconnect.com','$2b$10$EZPbqgf3K8zR6X33Wp2lEu1TkU/FWqhKcqzapRdWGEsQHFd9/./2O','freelancer','Jane','Smith','081234567892',NULL,'Professional Graphic Designer with 5 years experience','Surabaya','Jawa Timur',1,1,'2025-10-27 03:14:04','2025-10-27 03:14:04','2025-10-27 03:14:04'),('0b6915a7-a834-4935-af8a-57b6a154c9e2','user233@gmail.com','$2b$10$Q1euCLQWO0190x1X8ZU80esBiS21clyIf0ehu1FFR708lV4cgODD2','client',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-11-04 06:28:38','2025-11-04 06:28:38'),('1f2b7236-9451-46ac-8c74-fb70e3ce8d8c','anindeninadia@gmail.com','$2b$10$IpzLR0Ou1N3UBosHB.ob7.c41U26/DmDbMAaeaX4mW5HgyeBbm5jG','freelancer','Anin','denin',NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-10-27 05:18:32','2025-10-27 05:18:32'),('373e95d8-07dd-4ede-bae7-e11cd474a05a','anaphygon@protonmail.com','$2b$10$qK8AJ2qj8YCPhvnNB51cuO2Xsal4CE1J/EMckoDhPrBaCsrsZHaWq','freelancer','Lisvindanu','Lisvindanu',NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-11-03 14:23:28','2025-11-03 14:23:28'),('5437a8c0-5456-476a-88f1-e3083c453111','client2@skillconnect.com','$2b$10$EZPbqgf3K8zR6X33Wp2lEu1TkU/FWqhKcqzapRdWGEsQHFd9/./2O','client','Alice','Johanson','081234567893',NULL,'Startup founder seeking talented developers','Yogyakarta','DI Yogyakarta',1,1,'2025-10-27 03:14:04','2025-10-27 03:14:04','2025-11-03 16:32:26'),('682848ae-2465-47f2-bd7e-ac3ae4bdb77e','freelancer2@skillconnect.com','$2b$10$EZPbqgf3K8zR6X33Wp2lEu1TkU/FWqhKcqzapRdWGEsQHFd9/./2O','freelancer','Bob','Williams','081234567894',NULL,'Full Stack Developer - React, Node.js, MySQL','Semarang','Jawa Tengah',1,1,'2025-10-27 03:14:04','2025-10-27 03:14:04','2025-10-27 03:14:04'),('6a2363ec-09e7-48ff-b59f-47feda559ac1','rey@gmail.com','$2b$10$VHSmaelJpmUhaIJ4sOOD8uYwIJCfxisrDgzjQ.JLUliom/Pwg7Uqq','client','rey','han',NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-10-27 05:27:46','2025-10-27 05:27:46'),('7ad8faec-0569-4715-8847-602a6265c686','user@example.com','$2b$10$gPHuu64R1T4zxBLzV0Ge4.hxsI/Fah4IOHgP.qNjsmRoyRnxRveJ.','client',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-11-03 13:30:18','2025-11-03 13:30:18'),('7cbb04ce-dda3-42ef-a20f-d2337f538140','admin@skillconnect.com','$2b$10$EZPbqgf3K8zR6X33Wp2lEu1TkU/FWqhKcqzapRdWGEsQHFd9/./2O','admin','Admin','SkillConnect','081234567890',NULL,'Administrator SkillConnect','Jakarta','DKI Jakarta',1,1,'2025-10-27 03:14:04','2025-10-27 03:14:04','2025-10-27 03:14:04'),('7d874273-4df1-491b-a27a-21261dfdce9e','testuser12345@example.com','$2b$10$8c.7h9dA4sjUAhyfRexJgO1Zl.xA/uYOTeWBggXLQO9/gsLsHvPYO','client',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-11-03 14:12:56','2025-11-03 14:12:56'),('80422de5-abfc-4047-9981-d54edb855f29','client@skillconnect.com','$2b$10$EZPbqgf3K8zR6X33Wp2lEu1TkU/FWqhKcqzapRdWGEsQHFd9/./2O','client','John','Doe','081234567891',NULL,'Looking for skilled freelancers','Bandung','Jawa Barat',1,1,'2025-10-27 03:14:04','2025-10-27 03:14:04','2025-10-27 03:14:04'),('8b9b9c0b-ee0a-4024-8ed0-104f4de88f71','arielseptiadi3@gmail.com','$2b$10$rMIqjC94gqdzAnnGQ4hri.RKyslUNayMRIHyesdyUBnRCJOXU9C0S','freelancer','Muhamad Ariel','Septiadi',NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-11-04 05:23:55','2025-11-04 05:23:55'),('90280583-bd6f-474a-bebc-63df70518ae3','danu@example.com','$2b$10$ZYtJClDKHF03epGSn5HZAeurDmS2XQDcYRvDbH8Qf2l.f3mQc0IWy','client',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-11-03 05:26:54','2025-11-03 05:26:54'),('a69e0a64-7339-45be-bfdb-e1bca1963119','eii@gmail.com','$2b$10$ECrT.WWGlaWbKNtHhpk2VuL4Z76gEU1OPsMwB0WChc8vuNABIr7uG','client','eii','arynt',NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-10-27 03:55:10','2025-10-27 03:55:10'),('a716d48c-66a1-4546-b6c6-b561a7f243d4','daffa@gmail.com','$2b$10$IBTeijF1jSftydv.tQl7j.wuHsghKV/CRONMnLjkVvTjLN2GLQPnO','freelancer','dafsus','s',NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-11-04 05:09:24','2025-11-04 05:09:24'),('a9789e1e-cdde-4c37-9ab6-923bbbb6d59e','udin@gmail.com','$2b$10$CBs.30VytYGzS38vw1nesen1eTA6QJ6GMu3aTXx8f.aaIqOV5V.x.','client','Udin','Idin',NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-10-27 03:54:43','2025-10-27 03:54:43'),('ac1ed5e4-ff58-4d96-a269-fbd1b5867082','afat@test.com','$2b$10$e2yygfkHQwW89ZDiP8NQoeIkRWcAvIgsqZgQTKrg6yn3ezAcdg4J6','client','afat','surapat',NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-11-04 04:59:58','2025-11-04 04:59:58'),('ac46f43d-5eb8-4655-a37b-f5324d95f23f','lisvindanu015@gmail.com','$2b$10$r32DXK1tGz80lL9A4WPHluPOspVThE9EbUq1x3jb0N0sdHkoE1eOC','client','Danu','Client',NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-10-27 04:58:09','2025-10-27 04:58:09'),('b28bf7f0-f6d4-40cd-8681-15474d901cbc','dony@skillconnect.com','$2b$10$x3zrsBZKSz.aPIvuJX11Gem4iQfTFVGyDH.T3gG4iChQ3pUpl2RGm','client','Dony','Laksmana',NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-11-04 00:47:17','2025-11-04 00:47:17'),('b491c7d0-34df-4ff2-a28d-6b3a70498e29','aldigantengkuy@gmail.com','$2b$10$NWm2tJ5tsdQszUKgLhp0Me/T2z4XSHdCoTFz5aC94LdhBkTMZ.2ta','freelancer','Aldi Maulana','Fuadilah',NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-10-27 03:55:43','2025-10-27 03:55:43'),('c76367d6-4bb7-4103-8322-75a5a728ab3f','testuser123@example.com','$2b$10$NgGB82oOUEAjFf4C8Pfvs.BCQuyVaFPJ4LV.VS71i1Zp1KJY2VlVm','client',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-11-03 08:32:27','2025-11-03 08:32:27'),('f2d3917e-efd4-4427-9045-030fe8a6979b','daffa@example.com','$2b$10$mYPLoPzpFX.C5ABhT3pYo.gnr.rfXV1VVt0hE422wEpxkFiaE8d86','client',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-11-03 05:27:06','2025-11-03 05:27:06'),('f6e72781-5a7a-4083-b68b-bc53585fbc3a','teshalo@gmail.com','$2b$10$qMWjLg3XTi0/VDtqrDJEPuZc6taaG7DK.9CiqMBHhynDp.5QVmhiu','freelancer','tes','halo',NULL,NULL,NULL,NULL,NULL,1,0,NULL,'2025-10-27 03:59:34','2025-10-27 03:59:34');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-06 20:45:26
