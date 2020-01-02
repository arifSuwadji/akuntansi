-- MySQL dump 10.17  Distrib 10.3.17-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: komodo_akuntansi
-- ------------------------------------------------------
-- Server version	10.3.17-MariaDB
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `admin_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `admin_grup` tinyint(3) unsigned NOT NULL,
  `status` enum('aktif','tidak') DEFAULT 'aktif',
  `akun_perkiraan` smallint(5) unsigned DEFAULT NULL,
  `session_id` varchar(50) DEFAULT NULL,
  `akses_terakhir` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username` (`username`),
  KEY `admin_grup` (`admin_grup`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`admin_grup`) REFERENCES `admin_grup` (`grup_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admin_grup`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_grup` (
  `grup_id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `nama_grup` varchar(50) NOT NULL,
  PRIMARY KEY (`grup_id`),
  UNIQUE KEY `nama_grup` (`nama_grup`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `akun_perkiraan`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `akun_perkiraan` (
  `akun_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `kode_akun` varchar(15) NOT NULL,
  `nama_akun` varchar(100) NOT NULL,
  `tipe_akun` enum('induk','detail') DEFAULT 'induk',
  PRIMARY KEY (`akun_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bayar_hutang_member`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bayar_hutang_member` (
  `bayar_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `member` int(10) unsigned NOT NULL,
  `debit_akun_id` smallint(5) unsigned NOT NULL,
  `kredit_akun_id` smallint(5) unsigned NOT NULL,
  `keterangan_bayar` varchar(100) DEFAULT NULL,
  `admin` smallint(5) unsigned NOT NULL,
  `jurnal` bigint(20) unsigned DEFAULT NULL,
  `bayar_ts` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`bayar_id`),
  KEY `member` (`member`),
  KEY `admin` (`admin`),
  KEY `jurnal` (`jurnal`),
  CONSTRAINT `bayar_hutang_member_ibfk_1` FOREIGN KEY (`member`) REFERENCES `member` (`member_id`),
  CONSTRAINT `bayar_hutang_member_ibfk_2` FOREIGN KEY (`admin`) REFERENCES `admin` (`admin_id`),
  CONSTRAINT `bayar_hutang_member_ibfk_3` FOREIGN KEY (`jurnal`) REFERENCES `jurnal` (`jurnal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bayar_hutang_suplier`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bayar_hutang_suplier` (
  `bayar_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `akun_debit` smallint(5) unsigned NOT NULL,
  `akun_kredit` smallint(5) unsigned NOT NULL,
  `nominal` decimal(16,2) DEFAULT 0.00,
  `keterangan_bayar` varchar(255) DEFAULT NULL,
  `admin` smallint(5) unsigned NOT NULL,
  `jurnal` bigint(20) unsigned NOT NULL,
  `bayar_hutang_ts` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`bayar_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `buku_besar`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buku_besar` (
  `bukubesar_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `jurnal` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`bukubesar_id`),
  KEY `buku_besar_ibfk_1` (`jurnal`),
  CONSTRAINT `buku_besar_ibfk_1` FOREIGN KEY (`jurnal`) REFERENCES `jurnal` (`jurnal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `buku_besar_detail`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buku_besar_detail` (
  `bukubesar` int(10) unsigned NOT NULL,
  `tanggal_bb` date DEFAULT '0000-00-00',
  `akun_perkiraan` smallint(5) unsigned NOT NULL,
  `debit` int(10) unsigned NOT NULL DEFAULT 0,
  `kredit` int(10) unsigned NOT NULL DEFAULT 0,
  KEY `bukubesar` (`bukubesar`),
  KEY `akun_perkiraan` (`akun_perkiraan`),
  CONSTRAINT `buku_besar_detail_ibfk_1` FOREIGN KEY (`bukubesar`) REFERENCES `buku_besar` (`bukubesar_id`),
  CONSTRAINT `buku_besar_detail_ibfk_2` FOREIGN KEY (`akun_perkiraan`) REFERENCES `akun_perkiraan` (`akun_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `deposit`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deposit` (
  `deposit_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `komodo_mutasi_id` bigint(20) unsigned NOT NULL,
  `tanggal` date DEFAULT '0000-00-00',
  `member_komodo_id` int(10) unsigned NOT NULL,
  `nominal` decimal(16,2) NOT NULL DEFAULT 0.00,
  `keterangan` varchar(256) DEFAULT NULL,
  `catatan` varchar(256) DEFAULT NULL,
  `deposit_tipe` smallint(5) unsigned DEFAULT NULL,
  `jurnal` bigint(20) unsigned DEFAULT NULL,
  `deposit_ts` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`deposit_id`),
  KEY `deposit_tipe` (`deposit_tipe`),
  KEY `jurnal` (`jurnal`),
  CONSTRAINT `deposit_ibfk_1` FOREIGN KEY (`deposit_tipe`) REFERENCES `deposit_tipe` (`deposit_tipe_id`),
  CONSTRAINT `deposit_ibfk_2` FOREIGN KEY (`jurnal`) REFERENCES `jurnal` (`jurnal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `deposit_tipe`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deposit_tipe` (
  `deposit_tipe_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `nama_deposit` varchar(100) DEFAULT NULL,
  `tipe_deposit` enum('transfer','tunai','hutang') DEFAULT 'tunai',
  `deposit_bank` varchar(25) DEFAULT NULL,
  `debit_akun_id` smallint(5) unsigned NOT NULL,
  `kredit_akun_id` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`deposit_tipe_id`),
  KEY `debit_akun_id` (`debit_akun_id`),
  KEY `kredit_akun_id` (`kredit_akun_id`),
  CONSTRAINT `deposit_tipe_ibfk_1` FOREIGN KEY (`debit_akun_id`) REFERENCES `akun_perkiraan` (`akun_id`),
  CONSTRAINT `deposit_tipe_ibfk_2` FOREIGN KEY (`kredit_akun_id`) REFERENCES `akun_perkiraan` (`akun_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jurnal`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jurnal` (
  `jurnal_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tanggal` date DEFAULT '0000-00-00',
  `faktur` varchar(20) DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `admin` smallint(5) unsigned NOT NULL,
  `jurnal_ts` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`jurnal_id`),
  UNIQUE KEY `faktur` (`faktur`),
  KEY `admin` (`admin`),
  CONSTRAINT `jurnal_ibfk_1` FOREIGN KEY (`admin`) REFERENCES `admin` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jurnal_detail`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jurnal_detail` (
  `jurnal` bigint(20) unsigned NOT NULL,
  `akun_perkiraan` smallint(5) unsigned NOT NULL,
  `debit` int(10) unsigned NOT NULL DEFAULT 0,
  `kredit` int(10) unsigned NOT NULL DEFAULT 0,
  KEY `akun_perkiraan` (`akun_perkiraan`),
  KEY `jurnal_detail_ibfk_1` (`jurnal`),
  CONSTRAINT `jurnal_detail_ibfk_1` FOREIGN KEY (`jurnal`) REFERENCES `jurnal` (`jurnal_id`),
  CONSTRAINT `jurnal_detail_ibfk_2` FOREIGN KEY (`akun_perkiraan`) REFERENCES `akun_perkiraan` (`akun_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jurnal_tmp`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jurnal_tmp` (
  `admin` smallint(5) unsigned NOT NULL,
  `akun_perkiraan` smallint(5) unsigned NOT NULL,
  `tipe_jurnal` enum('kas_masuk','kas_keluar','jurnal_lain') NOT NULL DEFAULT 'jurnal_lain',
  `debit` int(10) unsigned NOT NULL DEFAULT 0,
  `kredit` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`admin`,`akun_perkiraan`,`tipe_jurnal`),
  KEY `akun_perkiraan` (`akun_perkiraan`),
  CONSTRAINT `jurnal_tmp_ibfk_1` FOREIGN KEY (`admin`) REFERENCES `admin` (`admin_id`),
  CONSTRAINT `jurnal_tmp_ibfk_2` FOREIGN KEY (`akun_perkiraan`) REFERENCES `akun_perkiraan` (`akun_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `member`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `member` (
  `member_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `komodo_id` bigint(20) unsigned NOT NULL,
  `nama` varchar(128) NOT NULL,
  `nama_lengkap` varchar(256) NOT NULL,
  `saldo_hutang` int(10) unsigned NOT NULL DEFAULT 0,
  `limit_hutang` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mutasi_hutang_member`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mutasi_hutang_member` (
  `member` int(10) unsigned NOT NULL,
  `deposit` bigint(20) unsigned DEFAULT NULL,
  `bayar` bigint(20) unsigned DEFAULT NULL,
  `nominal` decimal(16,2) NOT NULL DEFAULT 0.00,
  `jumlah` decimal(18,2) NOT NULL DEFAULT 0.00,
  KEY `member` (`member`),
  KEY `deposit` (`deposit`),
  KEY `bayar` (`bayar`),
  CONSTRAINT `mutasi_hutang_member_ibfk_1` FOREIGN KEY (`member`) REFERENCES `member` (`member_id`),
  CONSTRAINT `mutasi_hutang_member_ibfk_2` FOREIGN KEY (`deposit`) REFERENCES `deposit` (`deposit_id`),
  CONSTRAINT `mutasi_hutang_member_ibfk_3` FOREIGN KEY (`bayar`) REFERENCES `bayar_hutang_member` (`bayar_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mutasi_hutang_suplier`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mutasi_hutang_suplier` (
  `suplier` smallint(5) unsigned NOT NULL,
  `pembelian` bigint(20) unsigned DEFAULT NULL,
  `bayar` bigint(20) unsigned DEFAULT NULL,
  `nominal` decimal(16,2) NOT NULL DEFAULT 0.00,
  `jumlah` decimal(18,2) NOT NULL DEFAULT 0.00,
  KEY `suplier` (`suplier`),
  KEY `pembelian` (`pembelian`),
  KEY `bayar` (`bayar`),
  CONSTRAINT `mutasi_hutang_suplier_ibfk_1` FOREIGN KEY (`suplier`) REFERENCES `suplier` (`sup_id`),
  CONSTRAINT `mutasi_hutang_suplier_ibfk_2` FOREIGN KEY (`pembelian`) REFERENCES `pembelian` (`pembelian_id`),
  CONSTRAINT `mutasi_hutang_suplier_ibfk_3` FOREIGN KEY (`bayar`) REFERENCES `bayar_hutang_suplier` (`bayar_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mutasi_suplier`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mutasi_suplier` (
  `suplier` smallint(5) unsigned NOT NULL,
  `saldo_suplier` bigint(20) unsigned DEFAULT NULL,
  `pembelian` bigint(20) unsigned DEFAULT NULL,
  `nominal` decimal(16,2) NOT NULL DEFAULT 0.00,
  `jumlah` decimal(18,2) NOT NULL DEFAULT 0.00,
  KEY `suplier` (`suplier`),
  KEY `saldo_suplier` (`saldo_suplier`),
  KEY `pembelian` (`pembelian`),
  CONSTRAINT `mutasi_suplier_ibfk_1` FOREIGN KEY (`suplier`) REFERENCES `suplier` (`sup_id`),
  CONSTRAINT `mutasi_suplier_ibfk_2` FOREIGN KEY (`saldo_suplier`) REFERENCES `saldo_suplier` (`saldo_id`),
  CONSTRAINT `mutasi_suplier_ibfk_3` FOREIGN KEY (`pembelian`) REFERENCES `pembelian` (`pembelian_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nomor_faktur`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nomor_faktur` (
  `faktur_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nomor` varchar(20) DEFAULT NULL,
  `jumlah` smallint(5) unsigned DEFAULT 0,
  PRIMARY KEY (`faktur_id`),
  UNIQUE KEY `nomor_faktur` (`nomor`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pembelian`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pembelian` (
  `pembelian_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tipe_pembelian` enum('tunai','transfer','hutang') DEFAULT 'tunai',
  `akun_debit` smallint(5) unsigned NOT NULL,
  `akun_kredit` smallint(5) unsigned NOT NULL,
  `akun_diskon` smallint(5) unsigned DEFAULT NULL,
  `nominal` decimal(16,2) DEFAULT 0.00,
  `nominal_diskon` decimal(16,2) DEFAULT 0.00,
  `sisa_pembayaran` decimal(16,2) DEFAULT 0.00,
  `keterangan_pembelian` varchar(255) DEFAULT NULL,
  `admin` smallint(5) unsigned NOT NULL,
  `jurnal` bigint(20) unsigned NOT NULL,
  `pembelian_ts` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`pembelian_id`),
  KEY `akun_debit` (`akun_debit`),
  KEY `akun_kredit` (`akun_kredit`),
  KEY `admin` (`admin`),
  KEY `jurnal` (`jurnal`),
  CONSTRAINT `pembelian_ibfk_1` FOREIGN KEY (`akun_debit`) REFERENCES `akun_perkiraan` (`akun_id`),
  CONSTRAINT `pembelian_ibfk_2` FOREIGN KEY (`akun_kredit`) REFERENCES `akun_perkiraan` (`akun_id`),
  CONSTRAINT `pembelian_ibfk_3` FOREIGN KEY (`admin`) REFERENCES `admin` (`admin_id`),
  CONSTRAINT `pembelian_ibfk_4` FOREIGN KEY (`jurnal`) REFERENCES `jurnal` (`jurnal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `saldo_suplier`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `saldo_suplier` (
  `saldo_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `komodo_transaksi_id` bigint(20) unsigned NOT NULL,
  `tanggal` date DEFAULT '0000-00-00',
  `komodo_handler` varchar(30) DEFAULT NULL,
  `nominal` decimal(16,2) NOT NULL DEFAULT 0.00,
  `jurnal` bigint(20) unsigned DEFAULT NULL,
  `saldo_ts` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`saldo_id`),
  KEY `jurnal` (`jurnal`),
  CONSTRAINT `saldo_suplier_ibfk_1` FOREIGN KEY (`jurnal`) REFERENCES `jurnal` (`jurnal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `suplier`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `suplier` (
  `sup_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `nama_suplier` varchar(30) DEFAULT NULL,
  `handler` varchar(30) DEFAULT NULL,
  `saldo` decimal(18,2) NOT NULL DEFAULT 0.00,
  `saldo_perhari` decimal(18,2) NOT NULL DEFAULT 0.00,
  `saldo_hutang` decimal(18,2) NOT NULL DEFAULT 0.00,
  `akun_persediaan` smallint(5) unsigned DEFAULT NULL,
  `akun_hutang` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`sup_id`),
  KEY `akun_persediaan` (`akun_persediaan`),
  KEY `akun_hutang` (`akun_hutang`),
  CONSTRAINT `suplier_ibfk_1` FOREIGN KEY (`akun_persediaan`) REFERENCES `akun_perkiraan` (`akun_id`),
  CONSTRAINT `suplier_ibfk_2` FOREIGN KEY (`akun_hutang`) REFERENCES `akun_perkiraan` (`akun_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-13 15:59:40
