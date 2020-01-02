-- MySQL dump 10.14  Distrib 5.5.60-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: komodo_akuntansi
-- ------------------------------------------------------
-- Server version	5.5.60-MariaDB
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` VALUES (1,'admin','7110eda4d09e062aa5e4a390b0a572ac0d2c0220','Super Admin',1,'aktif',2,'c088683f-484f-4155-b149-521adfb2ae91','2019-08-08 04:55:55');

--
-- Dumping data for table `admin_grup`
--

INSERT INTO `admin_grup` VALUES (2,'Admin BO');
INSERT INTO `admin_grup` VALUES (1,'Super User');

--
-- Dumping data for table `akun_perkiraan`
--

INSERT INTO `akun_perkiraan` VALUES (1,'1.100','Kas','induk');
INSERT INTO `akun_perkiraan` VALUES (2,'1.100.10','Kas Utama','detail');
INSERT INTO `akun_perkiraan` VALUES (3,'1.100.20','Kas Kecil','detail');
INSERT INTO `akun_perkiraan` VALUES (4,'1.200','Aktiva Tetap','induk');
INSERT INTO `akun_perkiraan` VALUES (5,'1.200.10','Tanah','induk');
INSERT INTO `akun_perkiraan` VALUES (6,'1.200.10.10','Tanah','detail');
INSERT INTO `akun_perkiraan` VALUES (7,'1.200.20','Bangunan','induk');
INSERT INTO `akun_perkiraan` VALUES (8,'1.200.20.10','Bangunan','detail');
INSERT INTO `akun_perkiraan` VALUES (9,'1.200.20.20','Akumulasi Penyusutan Bangunan','detail');
INSERT INTO `akun_perkiraan` VALUES (10,'1.300','Persediaan Barang Dagangan','induk');
INSERT INTO `akun_perkiraan` VALUES (11,'1.300.1','Persediaan Barang Dagangan','detail');
INSERT INTO `akun_perkiraan` VALUES (12,'1.300.2','Persedian barang dagang MEDIASEL SINAR BARU MSB MKIOS','detail');
INSERT INTO `akun_perkiraan` VALUES (13,'1.300.3','Persedian barang dagang AKAR DAYA MANDIRI ADM MKIOS','detail');
INSERT INTO `akun_perkiraan` VALUES (14,'1.300.4','Persedian barang dagang MULTI MEDI SELLULAR MMS SEV','detail');
INSERT INTO `akun_perkiraan` VALUES (15,'1.300.5','Persedian barang dagang Kios bayar h2h','detail');
INSERT INTO `akun_perkiraan` VALUES (16,'1.300.6','Persedian barang dagang Terradata H2H','detail');
INSERT INTO `akun_perkiraan` VALUES (17,'1.300.7','Persedian barang dagang EZY LOAD','detail');
INSERT INTO `akun_perkiraan` VALUES (18,'1.300.8','Persedian barang dagang GOLDEN MKIOS','detail');
INSERT INTO `akun_perkiraan` VALUES (19,'1.300.9','Persedian barang dagang ERATEL PRIMA STOK TRI','detail');
INSERT INTO `akun_perkiraan` VALUES (20,'1.300.10','Persedian barang dagang valasindo','detail');
INSERT INTO `akun_perkiraan` VALUES (21,'1.300.11','Persedian barang dagang EXCEL DOMPUL','detail');
INSERT INTO `akun_perkiraan` VALUES (22,'1.300.12','Persedian barang dagang mkios CATALIST','detail');
INSERT INTO `akun_perkiraan` VALUES (23,'1.300.13','Persedian barang dagang NJ PULSA','detail');
INSERT INTO `akun_perkiraan` VALUES (24,'1.400','Piutang Dagang','induk');
INSERT INTO `akun_perkiraan` VALUES (25,'1.400.10','Piutang Supplier','induk');
INSERT INTO `akun_perkiraan` VALUES (26,'1.400.20','Piutang Member/Downline','induk');
INSERT INTO `akun_perkiraan` VALUES (27,'1.400.20.100','Piutang Member/Downline','detail');
INSERT INTO `akun_perkiraan` VALUES (28,'1.400.30','Piutang Owner','induk');
INSERT INTO `akun_perkiraan` VALUES (29,'1.400.30.100','Piutang Owner','detail');
INSERT INTO `akun_perkiraan` VALUES (30,'1.500','Bank','induk');
INSERT INTO `akun_perkiraan` VALUES (31,'1.500.10','BCA 117-048-8888 an/Tedi Hartono','detail');
INSERT INTO `akun_perkiraan` VALUES (32,'1.500.20','BRI 0130-01-000296-56-5 an/ Lia Faroka','detail');
INSERT INTO `akun_perkiraan` VALUES (33,'1.500.30','MANDIRI 11-4000-999-888-4 a/n TEDI HARTONO','detail');
INSERT INTO `akun_perkiraan` VALUES (34,'1.500.40','BCA 117-027-7771 an/Tedi Hartono','detail');
INSERT INTO `akun_perkiraan` VALUES (35,'2.100','Kewajiban (Utang & Deposit)','induk');
INSERT INTO `akun_perkiraan` VALUES (36,'2.100.1','UTANG MEDIASEL SINAR BARU MSB MKIOS','detail');
INSERT INTO `akun_perkiraan` VALUES (37,'2.100.2','Deposit Member','detail');
INSERT INTO `akun_perkiraan` VALUES (38,'2.100.3','UTANG AKAR DAYA MANDIRI ADM MKIOS','detail');
INSERT INTO `akun_perkiraan` VALUES (39,'2.100.4','Utang MULTI MEDI SELLULAR MMS SEV','detail');
INSERT INTO `akun_perkiraan` VALUES (40,'2.100.5','utang EXCEL DOMPUL','detail');
INSERT INTO `akun_perkiraan` VALUES (41,'2.100.6','Utang Terradata H2H','detail');
INSERT INTO `akun_perkiraan` VALUES (42,'2.100.7','Utang Kios bayar h2h','detail');
INSERT INTO `akun_perkiraan` VALUES (43,'2.100.8','utang VALASINDO','detail');
INSERT INTO `akun_perkiraan` VALUES (44,'2.100.9','UTANG ERATEL PRIMA STOK TRI','detail');
INSERT INTO `akun_perkiraan` VALUES (45,'2.100.10','UTANG GOLDEN MKIOS','detail');
INSERT INTO `akun_perkiraan` VALUES (46,'2.100.11','UTANG EZY LOAD SEV','detail');
INSERT INTO `akun_perkiraan` VALUES (47,'2.100.12','Utang ke ko Tedi','detail');
INSERT INTO `akun_perkiraan` VALUES (48,'2.100.13','UTANG CATALIST','detail');
INSERT INTO `akun_perkiraan` VALUES (49,'2.100.14','UTANG NJ PULSA','detail');
INSERT INTO `akun_perkiraan` VALUES (50,'3.100','Modal','induk');
INSERT INTO `akun_perkiraan` VALUES (51,'3.100.10','Modal','detail');
INSERT INTO `akun_perkiraan` VALUES (52,'3.200','Laba Rugi Tahun Lalu','induk');
INSERT INTO `akun_perkiraan` VALUES (53,'3.200.10','Laba Rugi Tahun Lalu','detail');
INSERT INTO `akun_perkiraan` VALUES (54,'3.300','Laba Rugi Tahun Berjalan','induk');
INSERT INTO `akun_perkiraan` VALUES (55,'3.300.10','Laba Rugi Tahun Berjalan','detail');
INSERT INTO `akun_perkiraan` VALUES (56,'4.100','Pendapatan','induk');
INSERT INTO `akun_perkiraan` VALUES (57,'4.100.10','Penjualan','induk');
INSERT INTO `akun_perkiraan` VALUES (58,'4.100.10.10','Penjualan','detail');
INSERT INTO `akun_perkiraan` VALUES (59,'4.100.20','Cashback','induk');
INSERT INTO `akun_perkiraan` VALUES (60,'4.100.20.10','Retur Pembelian','detail');
INSERT INTO `akun_perkiraan` VALUES (61,'4.100.20.20','Diskon Pembelian saldo tri','detail');
INSERT INTO `akun_perkiraan` VALUES (62,'4.100.20.30','Diskon Pembelian saldo XL DOMPUL','detail');
INSERT INTO `akun_perkiraan` VALUES (63,'4.100.30','Pendapatan Lain Lain','induk');
INSERT INTO `akun_perkiraan` VALUES (64,'4.100.30.10','BUNGA BANK BRI','detail');
INSERT INTO `akun_perkiraan` VALUES (65,'4.100.30.20','BUNGA BANK BCA','detail');
INSERT INTO `akun_perkiraan` VALUES (66,'4.100.30.30','Pendapatan Bonus Owner','detail');
INSERT INTO `akun_perkiraan` VALUES (67,'5.100','Biaya','induk');
INSERT INTO `akun_perkiraan` VALUES (68,'5.100.10','Biaya Operasional','induk');
INSERT INTO `akun_perkiraan` VALUES (69,'5.100.10.10','Biaya Iklan','detail');
INSERT INTO `akun_perkiraan` VALUES (70,'5.100.10.20','Biaya REPLAY SMS SERVER SPEEDY dan Listrik PLN','detail');
INSERT INTO `akun_perkiraan` VALUES (71,'5.100.10.30','Biaya Upah dan Gaji','detail');
INSERT INTO `akun_perkiraan` VALUES (72,'5.100.10.40','Biaya Operasional Lain-Lain','detail');
INSERT INTO `akun_perkiraan` VALUES (73,'5.100.20','Biaya dan Kerugian Lainnya','induk');
INSERT INTO `akun_perkiraan` VALUES (74,'5.100.20.10','Pajak BUNGA Bank BRI','detail');
INSERT INTO `akun_perkiraan` VALUES (75,'5.100.20.20','Pajak BUNGA Bank BCA','detail');
INSERT INTO `akun_perkiraan` VALUES (76,'5.100.20.30','Biaya transfer bank BRI','detail');
INSERT INTO `akun_perkiraan` VALUES (77,'5.100.20.40','Biaya trx SCADM MKIOS BRI BCA','detail');
INSERT INTO `akun_perkiraan` VALUES (78,'5.100.20.50','Biaya Pembelian replay SMS','detail');
INSERT INTO `akun_perkiraan` VALUES (79,'5.100.20.60','Biaya total sms bank Bri','detail');
INSERT INTO `akun_perkiraan` VALUES (80,'5.100.20.70','Biaya Peralatan Server','detail');
INSERT INTO `akun_perkiraan` VALUES (81,'5.100.30','Harga Pokok Penjualan','induk');
INSERT INTO `akun_perkiraan` VALUES (82,'5.100.30.10','Harga Pokok Penjualan','detail');
INSERT INTO `akun_perkiraan` VALUES (83,'5.100.30.20','Biaya Tambahan Pembelian stok ezy','detail');
INSERT INTO `akun_perkiraan` VALUES (84,'5.100.40','Biaya Penjualan','induk');
INSERT INTO `akun_perkiraan` VALUES (85,'5.100.40.10','Retur Penjualan','detail');
INSERT INTO `akun_perkiraan` VALUES (86,'5.100.40.20','Diskon Penjualan','detail');
INSERT INTO `akun_perkiraan` VALUES (87,'5.100.50','Bonus Member/Downline','induk');
INSERT INTO `akun_perkiraan` VALUES (88,'5.100.50.10','Biaya Bonus Downline','detail');
INSERT INTO `akun_perkiraan` VALUES (89,'5.200','Biaya pengeluaran owner','induk');
INSERT INTO `akun_perkiraan` VALUES (90,'5.200.10','KK BANK BII / MY BANK CI LIA','detail');
INSERT INTO `akun_perkiraan` VALUES (91,'5.200.20','KK PANIN CI LIA','detail');
INSERT INTO `akun_perkiraan` VALUES (92,'5.200.30','Pengeluaran Ko tedi','detail');
INSERT INTO `akun_perkiraan` VALUES (93,'5.200.40','bayar sinar mas','detail');
INSERT INTO `akun_perkiraan` VALUES (94,'5.200.50','Pengeluaran ci Lia','detail');
INSERT INTO `akun_perkiraan` VALUES (95,'5.200.60','Arisan ci Lia','detail');
INSERT INTO `akun_perkiraan` VALUES (96,'5.200.70','DANAMON CI LIA','detail');

--
-- Dumping data for table `bayar_hutang_member`
--

--
-- Dumping data for table `bayar_hutang_suplier`
--


--
-- Dumping data for table `buku_besar`
--


--
-- Dumping data for table `buku_besar_detail`
--


--
-- Dumping data for table `deposit`
--


--
-- Dumping data for table `deposit_tipe`
--

INSERT INTO `deposit_tipe` VALUES (1,'Deposit Hutang','hutang',NULL,27,37);
INSERT INTO `deposit_tipe` VALUES (2,'Deposit BCA 117-048-8888 an/Tedi Hartono','transfer','bca',31,37);
INSERT INTO `deposit_tipe` VALUES (3,'Deposit BCA 117-027-7771 an/Tedi Hartono','transfer','bca',34,37);
INSERT INTO `deposit_tipe` VALUES (4,'Deposit MANDIRI 11-4000-999-888-4 a/n TEDI HARTONO','transfer','mandiri',33,37);
INSERT INTO `deposit_tipe` VALUES (5,'Deposit BRI 0130-01-000296-56-5 an/ Lia Faroka','transfer','bri',32,37);
INSERT INTO `deposit_tipe` VALUES (6,'Deposit Kas Utama','tunai',NULL,2,37);

--
-- Dumping data for table `jurnal`
--


--
-- Dumping data for table `jurnal_detail`
--


--
-- Dumping data for table `jurnal_tmp`
--


--
-- Dumping data for table `member`
--


--
-- Dumping data for table `mutasi_hutang_member`
--


--
-- Dumping data for table `mutasi_hutang_suplier`
--


--
-- Dumping data for table `mutasi_suplier`
--


--
-- Dumping data for table `nomor_faktur`
--


--
-- Dumping data for table `pembelian`
--


--
-- Dumping data for table `saldo_suplier`
--


--
-- Dumping data for table `suplier`
--

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-08 12:03:16
