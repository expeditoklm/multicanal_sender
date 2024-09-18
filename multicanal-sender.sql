-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.0.30 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour mc_sender_db
DROP DATABASE IF EXISTS `mc_sender_db`;
CREATE DATABASE IF NOT EXISTS `mc_sender_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mc_sender_db`;

-- Listage de la structure de table mc_sender_db. audiences
DROP TABLE IF EXISTS `audiences`;
CREATE TABLE IF NOT EXISTS `audiences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.audiences : ~19 rows (environ)
INSERT INTO `audiences` (`id`, `name`, `description`, `deleted`, `created_at`, `updated_at`) VALUES
	(1, 'les vieux vieux', 'aucune desc', 0, '2024-09-12 11:33:26.000', '2024-09-17 14:20:34.511'),
	(2, 'oklmboss', NULL, 0, '2024-09-12 10:35:42.566', '2024-09-17 19:35:34.411'),
	(3, 'LES VIEUX JEUNES ', NULL, 0, '2024-09-12 15:29:50.000', '2024-09-12 15:29:54.000'),
	(4, 'oklm', 'la description de oklm', 0, '2024-09-17 11:58:36.333', '2024-09-17 11:58:36.333'),
	(5, '', 'la description de oklm', 0, '2024-09-17 12:01:30.246', '2024-09-17 12:01:30.246'),
	(6, '', '', 0, '2024-09-17 12:01:39.239', '2024-09-17 12:01:39.239'),
	(7, 's', '', 0, '2024-09-17 12:03:05.108', '2024-09-17 12:03:05.108'),
	(8, 'ss', 's', 0, '2024-09-17 12:11:34.422', '2024-09-17 12:11:34.422'),
	(9, 'ss', 's', 0, '2024-09-17 12:11:42.589', '2024-09-17 12:11:42.589'),
	(10, 'ss', 's', 0, '2024-09-17 12:11:47.642', '2024-09-17 12:11:47.642'),
	(11, 'lc', '', 0, '2024-09-17 12:12:16.556', '2024-09-17 12:12:16.556'),
	(12, 'lc', '', 0, '2024-09-17 12:14:21.048', '2024-09-17 12:14:21.048'),
	(13, 'w', '', 0, '2024-09-17 12:14:42.330', '2024-09-17 12:14:42.330'),
	(14, 'wk', '', 0, '2024-09-17 12:15:53.950', '2024-09-17 12:15:53.950'),
	(15, 'dd', '', 0, '2024-09-17 14:17:13.502', '2024-09-17 14:17:13.502'),
	(16, 'dd', '', 0, '2024-09-17 14:17:17.742', '2024-09-17 14:17:17.742'),
	(17, 'dd', '', 0, '2024-09-17 14:17:20.779', '2024-09-17 14:17:20.779'),
	(18, 'dd85', '', 0, '2024-09-17 14:18:28.565', '2024-09-17 14:18:28.565'),
	(19, 'nouvel apli', 'description', 0, '2024-09-17 19:32:21.481', '2024-09-17 19:32:21.481');

-- Listage de la structure de table mc_sender_db. audiences_contacts
DROP TABLE IF EXISTS `audiences_contacts`;
CREATE TABLE IF NOT EXISTS `audiences_contacts` (
  `audience_id` int NOT NULL,
  `contact_id` int NOT NULL,
  PRIMARY KEY (`audience_id`,`contact_id`),
  KEY `audiences_contacts_contact_id_fkey` (`contact_id`),
  CONSTRAINT `audiences_contacts_audience_id_fkey` FOREIGN KEY (`audience_id`) REFERENCES `audiences` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `audiences_contacts_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.audiences_contacts : ~6 rows (environ)
INSERT INTO `audiences_contacts` (`audience_id`, `contact_id`) VALUES
	(1, 1),
	(19, 2),
	(2, 6),
	(19, 7),
	(19, 8),
	(19, 9);

-- Listage de la structure de table mc_sender_db. campaigns
DROP TABLE IF EXISTS `campaigns`;
CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` datetime(3) DEFAULT NULL,
  `end_date` datetime(3) DEFAULT NULL,
  `status` enum('PENDING','COMPLETED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `company_id` int NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `campaigns_user_id_fkey` (`user_id`),
  KEY `campaigns_company_id_fkey` (`company_id`),
  CONSTRAINT `campaigns_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `campaigns_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.campaigns : ~4 rows (environ)
INSERT INTO `campaigns` (`id`, `name`, `start_date`, `end_date`, `status`, `user_id`, `company_id`, `deleted`, `created_at`, `updated_at`) VALUES
	(2, 'looojhfhfhdhfh', NULL, '2028-09-17 21:20:23.650', 'COMPLETED', 1, 1, 0, '2024-09-12 02:45:56.126', '2024-09-17 21:21:22.971'),
	(3, 'mon premier campagne', NULL, NULL, 'PENDING', 1, 5, 0, '2024-09-12 02:49:03.259', '2024-09-12 03:01:29.823'),
	(4, 'mon premier campagne', NULL, '2025-12-31 00:00:00.000', 'PENDING', 2, 5, 1, '2024-09-12 02:49:14.996', '2024-09-12 03:30:44.684'),
	(5, 'mon premier campagne', NULL, NULL, 'COMPLETED', 2, 2, 1, '2024-09-12 02:49:31.490', '2024-09-12 08:23:02.018');

-- Listage de la structure de table mc_sender_db. channels
DROP TABLE IF EXISTS `channels`;
CREATE TABLE IF NOT EXISTS `channels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.channels : ~4 rows (environ)
INSERT INTO `channels` (`id`, `label`, `deleted`, `created_at`, `updated_at`) VALUES
	(1, 'Reseau social', 0, '2024-09-12 08:48:37.055', '2024-09-17 15:06:44.244'),
	(2, 'Email', 1, '2024-09-12 08:48:59.704', '2024-09-17 15:06:50.975'),
	(3, 'SMSM', 1, '2024-09-12 08:49:06.871', '2024-09-17 15:06:56.214'),
	(4, 'oklmn', 1, '2024-09-17 20:28:37.198', '2024-09-17 20:28:37.198');

-- Listage de la structure de table mc_sender_db. companies
DROP TABLE IF EXISTS `companies`;
CREATE TABLE IF NOT EXISTS `companies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_fb` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_tiktok` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `secondary_color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primary_color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tertiary_color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.companies : ~7 rows (environ)
INSERT INTO `companies` (`id`, `name`, `description`, `link_fb`, `link_tiktok`, `secondary_color`, `primary_color`, `tertiary_color`, `phone`, `whatsapp`, `location`, `deleted`, `created_at`, `updated_at`) VALUES
	(1, 'PActh', 'D', NULL, NULL, 'oCC', 'BCo', 'B', 'OKL', 'PActh', 'KJ', 1, '2024-09-11 22:12:39.542', '2024-09-11 22:53:41.582'),
	(2, 'PActh', 'PActh', 'PActh', 'PActh', 'PActh', 'PActh', 'PActh', 'PActh', 'PActh', 'PActh', 1, '2024-09-11 22:13:14.682', '2024-09-11 22:47:45.244'),
	(3, 'BCo', 'BoC', NULL, NULL, NULL, 'BCo', 'oCC', 'BCo', 'oCC', 'oCC', 1, '2024-09-11 22:19:49.188', '2024-09-11 22:19:49.188'),
	(4, 'BCo', 'BoC', NULL, NULL, NULL, NULL, 'oCC', 'BCo', 'oCC', 'oCC', 1, '2024-09-11 22:22:40.486', '2024-09-11 22:22:40.486'),
	(5, 'BCo', 'BoC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2024-09-11 22:41:54.290', '2024-09-11 22:41:54.290'),
	(6, 'hhhhh', 'hjlm', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2024-09-17 16:23:28.445', '2024-09-17 16:23:28.445'),
	(7, 'hhhhhj', 'hjlm', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '2024-09-17 16:24:19.091', '2024-09-17 16:24:19.091');

-- Listage de la structure de table mc_sender_db. contacts
DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contacts_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.contacts : ~9 rows (environ)
INSERT INTO `contacts` (`id`, `name`, `username`, `email`, `phone`, `source`, `deleted`, `created_at`, `updated_at`) VALUES
	(1, 'donne', 'lachilo', 'expeditlachilo@gmail.com', '52401574', 'hhhh', 0, '2023-09-12 12:42:05.000', '2024-09-12 15:24:34.352'),
	(2, 'decision', 'bro', 'oklm@gmail.com', '41801974', 'xxx', 0, '2024-09-12 12:42:54.000', '2024-09-12 15:24:34.563'),
	(3, 'dechange', 'cccccc', 'jds@gmail.com', 'ddddddd', 'ssssss', 0, '2024-09-12 16:07:43.000', '2024-09-12 15:24:34.572'),
	(4, 'donne', 'lachilo', 'expeditlachilop@gmail.com', '52401574', 'hhhh', 0, '2024-09-12 15:26:30.756', '2024-09-12 15:27:55.915'),
	(5, 'decision', 'bro', 'oklmp@gmail.com', '41801974', 'xxx', 0, '2024-09-12 15:26:30.803', '2024-09-12 15:27:55.927'),
	(6, 'dechange', 'cccccc', 'jdsp@gmail.com', 'ddddddd', 'ssssss', 0, '2024-09-12 15:26:30.815', '2024-09-12 15:27:55.937'),
	(7, 'r8rrh', '', 'oklmbhh1@gmail.com', '', '', 0, '2024-09-17 21:09:55.508', '2024-09-17 21:09:55.508'),
	(8, 'rr5rh', '', 'oklmbh2h@gmail.com', '', '', 0, '2024-09-17 21:09:55.599', '2024-09-17 21:09:55.599'),
	(9, 'rr4rh', '', 'oklmbhh3@gmail.com', '', '', 0, '2024-09-17 21:09:55.610', '2024-09-17 21:09:55.610');

-- Listage de la structure de table mc_sender_db. interact_types
DROP TABLE IF EXISTS `interact_types`;
CREATE TABLE IF NOT EXISTS `interact_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.interact_types : ~1 rows (environ)
INSERT INTO `interact_types` (`id`, `label`, `deleted`, `created_at`, `updated_at`) VALUES
	(1, 'Click', 0, '2024-09-12 13:21:55.000', '2024-09-12 13:21:56.000');

-- Listage de la structure de table mc_sender_db. messages
DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `object` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channel_id` int NOT NULL,
  `campaign_id` int NOT NULL,
  `audience_id` int NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_channel_id_fkey` (`channel_id`),
  KEY `messages_campaign_id_fkey` (`campaign_id`),
  KEY `messages_audience_id_fkey` (`audience_id`),
  CONSTRAINT `messages_audience_id_fkey` FOREIGN KEY (`audience_id`) REFERENCES `audiences` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `messages_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `messages_channel_id_fkey` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.messages : ~7 rows (environ)
INSERT INTO `messages` (`id`, `object`, `content`, `status`, `channel_id`, `campaign_id`, `audience_id`, `deleted`, `created_at`, `updated_at`) VALUES
	(1, 'objet du msg', 'contenu du msg', 'PENDING', 3, 2, 1, 1, '2024-09-12 11:34:47.000', '2024-09-12 16:37:27.623'),
	(2, 'objet 2', 'famine', 'PENDING', 1, 4, 1, 0, '2024-09-12 11:37:47.000', '2024-09-12 18:42:22.974'),
	(3, 'OBJET 3', 'CONTENU 3', 'PENDING', 2, 4, 1, 1, '2024-09-12 14:48:07.000', '2024-09-12 18:45:37.853'),
	(4, 'mon objet', 'mon objet', 'PENDING', 1, 2, 1, 0, '2024-09-12 16:01:17.284', '2024-09-12 16:01:17.284'),
	(11, 'hhhhhj', 'hjlm', 'PENDING', 1, 2, 1, 0, '2024-09-17 17:37:47.740', '2024-09-17 17:37:47.740'),
	(12, 'hhhhhj', 'hjlm', 'PENDING', 1, 2, 1, 0, '2024-09-17 17:38:12.847', '2024-09-17 17:38:12.847'),
	(13, 'hhhhhj', 'hjlm', 'PENDING', 1, 2, 1, 0, '2024-09-17 17:38:15.579', '2024-09-17 17:38:15.579');

-- Listage de la structure de table mc_sender_db. message_contacts
DROP TABLE IF EXISTS `message_contacts`;
CREATE TABLE IF NOT EXISTS `message_contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `interact_date` datetime(3) NOT NULL,
  `message_id` int NOT NULL,
  `contact_id` int NOT NULL,
  `interact_type_id` int NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `message_contacts_message_id_fkey` (`message_id`),
  KEY `message_contacts_contact_id_fkey` (`contact_id`),
  KEY `message_contacts_interact_type_id_fkey` (`interact_type_id`),
  CONSTRAINT `message_contacts_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `message_contacts_interact_type_id_fkey` FOREIGN KEY (`interact_type_id`) REFERENCES `interact_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `message_contacts_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.message_contacts : ~2 rows (environ)
INSERT INTO `message_contacts` (`id`, `interact_date`, `message_id`, `contact_id`, `interact_type_id`, `deleted`, `created_at`, `updated_at`) VALUES
	(1, '2024-09-12 13:22:05.000', 1, 1, 1, 0, '2024-09-12 13:22:15.000', '2024-09-12 13:22:16.000'),
	(2, '2024-09-12 13:22:21.000', 2, 1, 1, 0, '2024-09-12 13:22:36.000', '2024-09-12 13:22:37.000');

-- Listage de la structure de table mc_sender_db. templates
DROP TABLE IF EXISTS `templates`;
CREATE TABLE IF NOT EXISTS `templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_type_id` int NOT NULL,
  `channel_id` int NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `templates_template_type_id_fkey` (`template_type_id`),
  KEY `templates_channel_id_fkey` (`channel_id`),
  CONSTRAINT `templates_channel_id_fkey` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `templates_template_type_id_fkey` FOREIGN KEY (`template_type_id`) REFERENCES `template_types` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.templates : ~2 rows (environ)
INSERT INTO `templates` (`id`, `name`, `content`, `template_type_id`, `channel_id`, `deleted`, `created_at`, `updated_at`) VALUES
	(1, 'oklm', 'html', 1, 3, 0, '2024-09-12 11:42:29.000', '2024-09-12 09:54:19.911'),
	(2, 'bro', 'wysiwyg', 1, 1, 0, '2024-09-12 11:43:08.000', '2024-09-12 11:43:09.000');

-- Listage de la structure de table mc_sender_db. template_campaigns
DROP TABLE IF EXISTS `template_campaigns`;
CREATE TABLE IF NOT EXISTS `template_campaigns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message_id` int NOT NULL,
  `template_id` int NOT NULL,
  `campaign_id` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `btn_txt` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `btn_link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `template_campaigns_message_id_fkey` (`message_id`),
  KEY `template_campaigns_template_id_fkey` (`template_id`),
  KEY `template_campaigns_campaign_id_fkey` (`campaign_id`),
  CONSTRAINT `template_campaigns_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `template_campaigns_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `template_campaigns_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `templates` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.template_campaigns : ~1 rows (environ)
INSERT INTO `template_campaigns` (`id`, `message_id`, `template_id`, `campaign_id`, `title`, `description`, `link`, `btn_txt`, `btn_link`, `image`, `deleted`, `created_at`, `updated_at`) VALUES
	(1, 2, 1, 3, 'kkk', 'nnn', 'nnn', 'bb', 'kk', 'iii', 0, '2024-09-17 23:18:17.000', '2024-09-17 23:18:18.000');

-- Listage de la structure de table mc_sender_db. template_types
DROP TABLE IF EXISTS `template_types`;
CREATE TABLE IF NOT EXISTS `template_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.template_types : ~1 rows (environ)
INSERT INTO `template_types` (`id`, `label`, `deleted`, `created_at`, `updated_at`) VALUES
	(1, 'Newsletter', 0, '2024-09-12 11:41:48.000', '2024-09-12 11:41:49.000');

-- Listage de la structure de table mc_sender_db. users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.users : ~2 rows (environ)
INSERT INTO `users` (`id`, `name`, `username`, `email`, `role`, `password`, `deleted`, `created_at`, `updated_at`) VALUES
	(1, 'oklm', 'oklm', 'oklm@gmail.com', 'user', '$2b$10$2KFETurF5Exi/dlGNAJQZ.s7aEe4R3./DPstPvt4wFzStrpdr/yRi', 0, '2024-09-11 23:56:06.058', '2024-09-11 23:56:06.058'),
	(2, 'oklm', 'oklm', 'oklm2@gmail.com', 'user', '$2b$10$K55jKyXj2fxO7ExWdAAQ1ecgN9tOwncDzri14o601yI7dESDPaR3q', 0, '2024-09-11 23:59:05.984', '2024-09-11 23:59:05.984');

-- Listage de la structure de table mc_sender_db. user_company
DROP TABLE IF EXISTS `user_company`;
CREATE TABLE IF NOT EXISTS `user_company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `company_id` int NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_company_user_id_company_id_key` (`user_id`,`company_id`),
  KEY `user_company_company_id_fkey` (`company_id`),
  CONSTRAINT `user_company_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `user_company_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db.user_company : ~3 rows (environ)
INSERT INTO `user_company` (`id`, `user_id`, `company_id`, `deleted`, `created_at`, `updated_at`) VALUES
	(1, 1, 3, 1, '2024-09-12 01:56:45.000', '2024-09-12 00:10:14.805'),
	(5, 2, 2, 1, '2024-09-12 01:06:31.313', '2024-09-12 01:57:16.117'),
	(6, 2, 5, 0, '2024-09-12 01:57:16.189', '2024-09-12 01:57:16.189');

-- Listage de la structure de table mc_sender_db. _prisma_migrations
DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table mc_sender_db._prisma_migrations : ~9 rows (environ)
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
	('1b5a2ac4-ded7-4014-ae75-3f9453bdc851', '1f14fb6df8a1a8ad964cd9412016795458e561b21bb4f746e16651d7921ecb64', '2024-09-11 22:07:59.498', '20240911111003_init', NULL, NULL, '2024-09-11 22:07:58.130', 1),
	('4de57f67-9c08-4b3d-a76e-ee96b245daf6', '58aa7eb52223b884fc3ad99cce14cc235d8cbc246fdf7acdeeb9998a076f148a', '2024-09-11 22:07:59.593', '20240911215346_init3', NULL, NULL, '2024-09-11 22:07:59.537', 1),
	('752012bc-47a4-47e6-9995-042083ec9065', '4b06e067e6745882b62280f72718e6ceb87d978912887b64e6f4effe5717ad1a', '2024-09-11 22:22:31.365', '20240911222231_ds', NULL, NULL, '2024-09-11 22:22:31.279', 1),
	('ac65dca6-8d08-4074-928a-4c9006a9ef59', 'fe27509a847587a596b8c97d4e8250ebd178d1944e537dd871e5cf8da30e5e21', '2024-09-11 22:19:37.435', '20240911221937_so', NULL, NULL, '2024-09-11 22:19:37.337', 1),
	('ca48b246-1d39-4f13-af28-0a5b53a0ed44', '45caa9670f92eb112886faf2e9a2d400a5503e9a84503c130e0988809cd5b6cd', '2024-09-12 15:13:04.180', '20240912151303_add_unique_email', NULL, NULL, '2024-09-12 15:13:03.898', 1),
	('d0e5e902-3668-415e-8243-24154c747acd', 'ce28f65ab8b7bce364f9079a7c013f577db77473ca0b3c6c089e07532bcff522', '2024-09-11 22:37:45.234', '20240911223744_review', NULL, NULL, '2024-09-11 22:37:44.492', 1),
	('d4c4d837-a24d-4edd-bbec-a3d96763df47', '865dde6a0f766faf203c5aa97093054ad5854bdeb780a8033e9ec9ada0fc7e93', '2024-09-11 22:08:06.172', '20240911220806_ok', NULL, NULL, '2024-09-11 22:08:06.116', 1),
	('f953ea4f-b55f-4ca5-9d9f-3789ead18256', '279f15fb0c99a2d5c8b44d8e599624392cd42270f45300a2b07ff47fbc0786b4', '2024-09-11 22:07:59.535', '20240911124921_init2', NULL, NULL, '2024-09-11 22:07:59.500', 1),
	('fefc3e06-8796-4199-8b13-c3eb6af45561', '5fb7bf3a676c2251e43b05b97ef70a902fd200cec34e8c4ec8d0efc31d350834', '2024-09-12 00:54:01.466', '20240912005401_index2key', NULL, NULL, '2024-09-12 00:54:01.380', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
