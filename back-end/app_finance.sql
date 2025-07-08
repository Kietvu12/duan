-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 08, 2025 at 03:21 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `app_finance`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(50) NOT NULL,
  `table_affected` varchar(50) NOT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_values` text DEFAULT NULL,
  `new_values` text DEFAULT NULL,
  `action_time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`log_id`, `user_id`, `action`, `table_affected`, `record_id`, `old_values`, `new_values`, `action_time`) VALUES
(1, 2, 'create', 'groups', 1, NULL, '{\"group_name\":\"Nhóm chơi golf chính\",\"created_by\":2}', '2025-06-22 17:00:00'),
(2, 2, 'add_user', 'user_groups', 1, NULL, '{\"user_id\":2,\"group_id\":1,\"is_group_admin\":1}', '2025-06-22 17:05:00'),
(3, 2, 'add_user', 'user_groups', 2, NULL, '{\"user_id\":3,\"group_id\":1,\"is_group_admin\":0}', '2025-06-22 17:10:00'),
(4, 2, 'create_transaction', 'transactions', 1, NULL, '{\"user_id\":3,\"points_change\":10,\"transaction_type\":\"nhan_san\"}', '2025-06-22 18:00:00'),
(5, 2, 'create_transaction', 'transactions', 2, NULL, '{\"user_id\":4,\"points_change\":-5,\"transaction_type\":\"san_cho\"}', '2025-06-22 18:30:00'),
(6, 1, 'update', 'users', 3, '{\"points\":100}', '{\"points\":110}', '2025-06-22 19:00:00'),
(7, 1, 'update', 'users', 4, '{\"points\":200}', '{\"points\":195}', '2025-06-22 19:05:00'),
(8, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 10:24:49'),
(9, 3, 'login', 'users', 3, NULL, NULL, '2025-06-29 10:27:34'),
(10, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 10:41:29'),
(11, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 10:55:06'),
(12, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 10:57:11'),
(13, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 10:58:31'),
(14, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 10:59:58'),
(15, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 11:01:58'),
(16, 3, 'login', 'users', 3, NULL, NULL, '2025-06-29 11:02:41'),
(17, 3, 'login', 'users', 3, NULL, NULL, '2025-06-29 11:03:29'),
(18, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 11:09:36'),
(19, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 11:48:55'),
(20, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 12:18:16'),
(21, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 12:19:34'),
(22, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 12:49:28'),
(23, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 12:59:08'),
(24, 3, 'login', 'users', 3, NULL, NULL, '2025-06-29 13:42:26'),
(25, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 13:43:01'),
(26, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 21:49:06'),
(27, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 22:23:26'),
(28, 1, 'add_user_to_group', 'user_groups', 9, NULL, '{\"groupId\":3,\"userId\":2,\"isGroupAdmin\":false}', '2025-06-30 22:28:30'),
(29, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 22:40:42'),
(30, 1, 'add_user_to_group', 'user_groups', 10, NULL, '{\"groupId\":1,\"userId\":1,\"isGroupAdmin\":false}', '2025-06-30 22:41:10'),
(31, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 22:42:47'),
(32, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 22:43:15'),
(33, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 22:45:49'),
(34, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 22:55:47'),
(35, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:12:25'),
(36, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:16:35'),
(37, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:32:06'),
(38, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:39:54'),
(39, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:40:57'),
(40, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:46:38'),
(41, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:47:14'),
(42, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:47:27'),
(43, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:48:44'),
(44, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:49:31'),
(45, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:49:35'),
(46, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:49:49'),
(47, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:51:47'),
(48, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:51:53'),
(49, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:52:59'),
(50, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:53:15'),
(51, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:57:55'),
(52, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 00:01:25'),
(53, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 00:01:29'),
(54, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 00:03:08'),
(55, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 07:13:08'),
(56, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 07:34:16'),
(57, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 07:37:46'),
(58, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 07:49:41'),
(59, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 07:50:49'),
(60, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 07:52:15'),
(61, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 08:02:21'),
(62, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 08:12:46'),
(63, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 08:14:59'),
(64, 1, 'add_user_to_group', 'user_groups', 11, NULL, '{\"groupId\":3,\"userId\":3,\"isGroupAdmin\":false}', '2025-07-01 08:16:47'),
(65, 1, 'add_user_to_group', 'user_groups', 12, NULL, '{\"groupId\":2,\"userId\":1,\"isGroupAdmin\":false}', '2025-07-01 08:17:11'),
(66, 1, 'login', 'users', 1, NULL, NULL, '2025-07-06 08:00:15'),
(67, 1, 'login', 'users', 1, NULL, NULL, '2025-07-06 08:38:26'),
(68, 1, 'add_user_to_group', 'user_groups', 13, NULL, '{\"groupId\":2,\"userId\":4,\"isGroupAdmin\":false}', '2025-07-06 09:51:07'),
(69, 1, 'create', 'transactions', 7, NULL, '{\"user_id\":2,\"group_id\":1,\"points_change\":121,\"transaction_type\":\"nhan_san\",\"amount\":32}', '2025-07-06 16:43:38'),
(70, 2, 'login', 'users', 2, NULL, NULL, '2025-07-06 17:03:36'),
(71, 2, 'login', 'users', 2, NULL, NULL, '2025-07-06 18:53:54'),
(72, 1, 'login', 'users', 1, NULL, NULL, '2025-07-06 18:54:07'),
(73, 1, 'update_group_admin', 'user_groups', 1, NULL, '{\"groupId\":1,\"isGroupAdmin\":0}', '2025-07-06 20:54:36'),
(74, 1, 'remove_user_from_group', 'user_groups', 2, '{\"groupId\":1}', NULL, '2025-07-06 20:59:48'),
(75, 1, 'remove_user_from_group', 'user_groups', 3, '{\"groupId\":1}', NULL, '2025-07-06 21:00:31'),
(76, 1, 'update_group_admin', 'user_groups', 4, NULL, '{\"groupId\":1,\"isGroupAdmin\":1}', '2025-07-06 21:01:04'),
(77, 4, 'login', 'users', 4, NULL, NULL, '2025-07-06 21:20:58'),
(78, 4, 'login', 'users', 4, NULL, NULL, '2025-07-06 22:19:49'),
(79, 4, 'create', 'transactions', 8, NULL, '{\"user_id\":4,\"group_id\":1,\"points_change\":12,\"transaction_type\":\"nhan_lich\",\"amount\":12}', '2025-07-07 01:31:04'),
(80, 4, 'create', 'transactions', 9, NULL, '{\"user_id\":4,\"group_id\":1,\"points_change\":1,\"transaction_type\":\"nhan_lich\",\"amount\":1}', '2025-07-07 01:45:10'),
(81, 4, 'create', 'transactions', 10, NULL, '{\"user_id\":4,\"group_id\":1,\"points_change\":212,\"transaction_type\":\"nhan_lich\",\"amount\":21}', '2025-07-07 01:53:01'),
(82, 4, 'login', 'users', 4, NULL, NULL, '2025-07-07 03:09:58'),
(83, 4, 'update_group_admin', 'user_groups', 4, NULL, '{\"groupId\":1,\"isGroupAdmin\":0}', '2025-07-07 03:22:14'),
(84, 4, 'login', 'users', 4, NULL, NULL, '2025-07-07 04:10:55'),
(85, 1, 'login', 'users', 1, NULL, NULL, '2025-07-07 04:32:49'),
(86, 1, 'update_group_admin', 'user_groups', 4, NULL, '{\"groupId\":1,\"isGroupAdmin\":1}', '2025-07-07 04:33:08'),
(87, 1, 'update_group_admin', 'user_groups', 4, NULL, '{\"groupId\":1,\"isGroupAdmin\":0}', '2025-07-07 04:33:16'),
(88, 1, 'update_group_admin', 'user_groups', 4, NULL, '{\"groupId\":1,\"isGroupAdmin\":0}', '2025-07-07 04:33:17'),
(89, 4, 'login', 'users', 4, NULL, NULL, '2025-07-07 18:11:53'),
(90, 4, 'login', 'users', 4, NULL, NULL, '2025-07-07 18:33:50'),
(91, 1, 'login', 'users', 1, NULL, NULL, '2025-07-07 18:34:02'),
(92, 1, 'create', 'transactions', 11, NULL, '{\"user_id\":1,\"group_id\":1,\"points_change\":-21,\"transaction_type\":\"nhan_lich\",\"amount\":-32}', '2025-07-07 18:34:30'),
(93, 1, 'create', 'transactions', 12, NULL, '{\"user_id\":1,\"group_id\":1,\"points_change\":-12,\"transaction_type\":\"san_cho\",\"amount\":43}', '2025-07-07 18:35:37'),
(94, 1, 'add_user_to_group', 'user_groups', 14, NULL, '{\"groupId\":1,\"userId\":3,\"isGroupAdmin\":false}', '2025-07-07 18:41:33'),
(95, 1, 'remove_user_from_group', 'user_groups', 1, '{\"groupId\":1}', NULL, '2025-07-07 20:32:06'),
(96, 1, 'remove_user_from_group', 'user_groups', 3, '{\"groupId\":1}', NULL, '2025-07-07 20:32:07'),
(97, 1, 'update_group_admin', 'user_groups', 4, NULL, '{\"groupId\":1,\"isGroupAdmin\":1}', '2025-07-07 20:32:19'),
(98, 1, 'create', 'groups', 4, NULL, '{\"group_name\":\"212\"}', '2025-07-08 06:56:18'),
(99, 1, 'create', 'groups', 5, NULL, '{\"group_name\":\"Kietej\"}', '2025-07-08 06:57:06'),
(100, 1, 'login', 'users', 1, NULL, NULL, '2025-07-08 07:00:51'),
(101, 4, 'login', 'users', 4, NULL, NULL, '2025-07-08 07:57:57');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `group_id` int(11) NOT NULL,
  `group_name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`group_id`, `group_name`, `created_at`, `created_by`) VALUES
(1, 'Nhóm chơi golf chính', '2025-06-22 17:00:00', 2),
(2, 'Nhóm golf nghiệp dư', '2025-06-23 09:30:00', 2),
(3, 'Nhóm golf cao cấp', '2025-06-24 14:15:00', 1),
(4, '212', '2025-07-08 06:56:17', 1),
(5, 'Kietej', '2025-07-08 06:57:06', 1);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `transaction_date` datetime NOT NULL,
  `points_change` int(11) NOT NULL,
  `transaction_type` enum('nhan_san','san_cho','nhan_lich','giao_lich') NOT NULL,
  `related_user` varchar(100) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `content` text DEFAULT NULL,
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `user_id`, `group_id`, `transaction_date`, `points_change`, `transaction_type`, `related_user`, `amount`, `content`, `created_by`) VALUES
(1, 3, 1, '2025-06-22 18:00:00', 10, 'nhan_san', NULL, 100.00, 'Nhận sân golf A', 2),
(2, 4, 1, '2025-06-22 18:30:00', -5, 'san_cho', '3', 50.00, 'Sân chơ cho user1', 2),
(3, 5, 1, '2025-06-23 10:00:00', 15, 'nhan_lich', NULL, 150.00, 'Nhận lịch đánh golf', 2),
(4, 3, 2, '2025-06-23 11:00:00', -10, 'giao_lich', '4', 100.00, 'Giao lịch cho user2', 2),
(5, 1, 3, '2025-06-24 15:00:00', 20, 'nhan_san', NULL, 200.00, 'Nhận sân golf B', 1),
(6, 4, 3, '2025-06-24 16:00:00', -15, 'san_cho', '1', 150.00, 'Sân chơ cho admin', 1),
(7, 2, 1, '2025-07-06 09:43:38', 121, 'nhan_san', '1121', 32.00, 'qqw11', 1),
(8, 4, 1, '2025-07-06 18:31:04', 12, 'nhan_lich', '12', 12.00, '1', 4),
(9, 4, 1, '2025-07-06 18:45:10', 1, 'nhan_lich', '1', 1.00, '1', 4),
(10, 4, 1, '2025-07-06 18:53:01', 212, 'nhan_lich', '121', 21.00, '12', 4),
(11, 1, 1, '2025-07-07 11:34:29', -21, 'nhan_lich', '12', -32.00, '121', 1),
(12, 1, 1, '2025-07-07 11:35:37', -12, 'san_cho', '121', 43.00, '212', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `zalo_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('system_admin','group_admin','user') NOT NULL DEFAULT 'user',
  `created_at` datetime NOT NULL,
  `points` int(11) NOT NULL DEFAULT 0,
  `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `zalo_name`, `email`, `password_hash`, `role`, `created_at`, `points`, `balance`, `is_active`) VALUES
(1, 'admin', 'Admin Zalo', 'admin@example.com', '$2a$12$gCkIP/rDo4WkGMnMlasMxeLWTED9okxDPv/yLYnSKw6UuJmXhyxwG', 'system_admin', '2025-06-22 16:50:41', 991, 4925.00, 1),
(2, 'groupadmin1', 'Group Admin 1', 'groupadmin1@example.com', '$2a$12$gCkIP/rDo4WkGMnMlasMxeLWTED9okxDPv/yLYnSKw6UuJmXhyxwG', 'group_admin', '2025-06-22 16:50:41', 379, 2468.00, 1),
(3, 'user1', 'User One', 'user1@example.com', '$2a$12$gCkIP/rDo4WkGMnMlasMxeLWTED9okxDPv/yLYnSKw6UuJmXhyxwG', 'user', '2025-06-22 16:50:41', 100, 500.00, 1),
(4, 'user2', 'User Two', 'user2@example.com', '$2a$12$gCkIP/rDo4WkGMnMlasMxeLWTED9okxDPv/yLYnSKw6UuJmXhyxwG', 'user', '2025-06-22 16:50:41', 425, 1034.00, 1),
(5, 'user3', 'User Three', 'user3@example.com', '$2a$12$gCkIP/rDo4WkGMnMlasMxeLWTED9okxDPv/yLYnSKw6UuJmXhyxwG', 'user', '2025-06-22 16:50:41', 150, 750.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_groups`
--

CREATE TABLE `user_groups` (
  `user_group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `is_group_admin` tinyint(1) NOT NULL DEFAULT 0,
  `joined_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_groups`
--

INSERT INTO `user_groups` (`user_group_id`, `user_id`, `group_id`, `is_group_admin`, `joined_at`) VALUES
(3, 4, 1, 1, '2025-06-22 17:15:00'),
(4, 5, 1, 0, '2025-06-22 17:20:00'),
(5, 2, 2, 1, '2025-06-23 09:35:00'),
(6, 3, 2, 0, '2025-06-23 09:40:00'),
(7, 1, 3, 1, '2025-06-24 14:20:00'),
(8, 4, 3, 0, '2025-06-24 14:25:00'),
(9, 2, 3, 0, '2025-06-30 22:28:30'),
(11, 3, 3, 0, '2025-07-01 08:16:47'),
(12, 1, 2, 0, '2025-07-01 08:17:10'),
(15, 1, 4, 1, '2025-07-08 06:56:18'),
(16, 1, 5, 1, '2025-07-08 06:57:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`group_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `related_user_id` (`related_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `username_6` (`username`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `username_7` (`username`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `username_8` (`username`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `username_9` (`username`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `username_10` (`username`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `username_11` (`username`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `username_12` (`username`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `username_13` (`username`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `username_14` (`username`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `username_15` (`username`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `username_16` (`username`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `username_17` (`username`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `username_18` (`username`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `username_19` (`username`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `username_20` (`username`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `username_21` (`username`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `username_22` (`username`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `username_23` (`username`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `username_24` (`username`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `username_25` (`username`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `username_26` (`username`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `username_27` (`username`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `username_28` (`username`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `username_29` (`username`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `username_30` (`username`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `username_31` (`username`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `username_32` (`username`);

--
-- Indexes for table `user_groups`
--
ALTER TABLE `user_groups`
  ADD PRIMARY KEY (`user_group_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`group_id`),
  ADD KEY `group_id` (`group_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_groups`
--
ALTER TABLE `user_groups`
  MODIFY `user_group_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_6` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `user_groups`
--
ALTER TABLE `user_groups`
  ADD CONSTRAINT `user_groups_ibfk_10` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_groups_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 08, 2025 at 03:21 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `app_finance`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(50) NOT NULL,
  `table_affected` varchar(50) NOT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_values` text DEFAULT NULL,
  `new_values` text DEFAULT NULL,
  `action_time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`log_id`, `user_id`, `action`, `table_affected`, `record_id`, `old_values`, `new_values`, `action_time`) VALUES
(1, 2, 'create', 'groups', 1, NULL, '{\"group_name\":\"Nhóm chơi golf chính\",\"created_by\":2}', '2025-06-22 17:00:00'),
(2, 2, 'add_user', 'user_groups', 1, NULL, '{\"user_id\":2,\"group_id\":1,\"is_group_admin\":1}', '2025-06-22 17:05:00'),
(3, 2, 'add_user', 'user_groups', 2, NULL, '{\"user_id\":3,\"group_id\":1,\"is_group_admin\":0}', '2025-06-22 17:10:00'),
(4, 2, 'create_transaction', 'transactions', 1, NULL, '{\"user_id\":3,\"points_change\":10,\"transaction_type\":\"nhan_san\"}', '2025-06-22 18:00:00'),
(5, 2, 'create_transaction', 'transactions', 2, NULL, '{\"user_id\":4,\"points_change\":-5,\"transaction_type\":\"san_cho\"}', '2025-06-22 18:30:00'),
(6, 1, 'update', 'users', 3, '{\"points\":100}', '{\"points\":110}', '2025-06-22 19:00:00'),
(7, 1, 'update', 'users', 4, '{\"points\":200}', '{\"points\":195}', '2025-06-22 19:05:00'),
(8, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 10:24:49'),
(9, 3, 'login', 'users', 3, NULL, NULL, '2025-06-29 10:27:34'),
(10, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 10:41:29'),
(11, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 10:55:06'),
(12, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 10:57:11'),
(13, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 10:58:31'),
(14, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 10:59:58'),
(15, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 11:01:58'),
(16, 3, 'login', 'users', 3, NULL, NULL, '2025-06-29 11:02:41'),
(17, 3, 'login', 'users', 3, NULL, NULL, '2025-06-29 11:03:29'),
(18, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 11:09:36'),
(19, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 11:48:55'),
(20, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 12:18:16'),
(21, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 12:19:34'),
(22, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 12:49:28'),
(23, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 12:59:08'),
(24, 3, 'login', 'users', 3, NULL, NULL, '2025-06-29 13:42:26'),
(25, 1, 'login', 'users', 1, NULL, NULL, '2025-06-29 13:43:01'),
(26, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 21:49:06'),
(27, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 22:23:26'),
(28, 1, 'add_user_to_group', 'user_groups', 9, NULL, '{\"groupId\":3,\"userId\":2,\"isGroupAdmin\":false}', '2025-06-30 22:28:30'),
(29, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 22:40:42'),
(30, 1, 'add_user_to_group', 'user_groups', 10, NULL, '{\"groupId\":1,\"userId\":1,\"isGroupAdmin\":false}', '2025-06-30 22:41:10'),
(31, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 22:42:47'),
(32, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 22:43:15'),
(33, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 22:45:49'),
(34, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 22:55:47'),
(35, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:12:25'),
(36, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:16:35'),
(37, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:32:06'),
(38, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:39:54'),
(39, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:40:57'),
(40, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:46:38'),
(41, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:47:14'),
(42, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:47:27'),
(43, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:48:44'),
(44, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:49:31'),
(45, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:49:35'),
(46, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:49:49'),
(47, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:51:47'),
(48, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:51:53'),
(49, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:52:59'),
(50, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:53:15'),
(51, 1, 'login', 'users', 1, NULL, NULL, '2025-06-30 23:57:55'),
(52, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 00:01:25'),
(53, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 00:01:29'),
(54, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 00:03:08'),
(55, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 07:13:08'),
(56, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 07:34:16'),
(57, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 07:37:46'),
(58, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 07:49:41'),
(59, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 07:50:49'),
(60, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 07:52:15'),
(61, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 08:02:21'),
(62, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 08:12:46'),
(63, 1, 'login', 'users', 1, NULL, NULL, '2025-07-01 08:14:59'),
(64, 1, 'add_user_to_group', 'user_groups', 11, NULL, '{\"groupId\":3,\"userId\":3,\"isGroupAdmin\":false}', '2025-07-01 08:16:47'),
(65, 1, 'add_user_to_group', 'user_groups', 12, NULL, '{\"groupId\":2,\"userId\":1,\"isGroupAdmin\":false}', '2025-07-01 08:17:11'),
(66, 1, 'login', 'users', 1, NULL, NULL, '2025-07-06 08:00:15'),
(67, 1, 'login', 'users', 1, NULL, NULL, '2025-07-06 08:38:26'),
(68, 1, 'add_user_to_group', 'user_groups', 13, NULL, '{\"groupId\":2,\"userId\":4,\"isGroupAdmin\":false}', '2025-07-06 09:51:07'),
(69, 1, 'create', 'transactions', 7, NULL, '{\"user_id\":2,\"group_id\":1,\"points_change\":121,\"transaction_type\":\"nhan_san\",\"amount\":32}', '2025-07-06 16:43:38'),
(70, 2, 'login', 'users', 2, NULL, NULL, '2025-07-06 17:03:36'),
(71, 2, 'login', 'users', 2, NULL, NULL, '2025-07-06 18:53:54'),
(72, 1, 'login', 'users', 1, NULL, NULL, '2025-07-06 18:54:07'),
(73, 1, 'update_group_admin', 'user_groups', 1, NULL, '{\"groupId\":1,\"isGroupAdmin\":0}', '2025-07-06 20:54:36'),
(74, 1, 'remove_user_from_group', 'user_groups', 2, '{\"groupId\":1}', NULL, '2025-07-06 20:59:48'),
(75, 1, 'remove_user_from_group', 'user_groups', 3, '{\"groupId\":1}', NULL, '2025-07-06 21:00:31'),
(76, 1, 'update_group_admin', 'user_groups', 4, NULL, '{\"groupId\":1,\"isGroupAdmin\":1}', '2025-07-06 21:01:04'),
(77, 4, 'login', 'users', 4, NULL, NULL, '2025-07-06 21:20:58'),
(78, 4, 'login', 'users', 4, NULL, NULL, '2025-07-06 22:19:49'),
(79, 4, 'create', 'transactions', 8, NULL, '{\"user_id\":4,\"group_id\":1,\"points_change\":12,\"transaction_type\":\"nhan_lich\",\"amount\":12}', '2025-07-07 01:31:04'),
(80, 4, 'create', 'transactions', 9, NULL, '{\"user_id\":4,\"group_id\":1,\"points_change\":1,\"transaction_type\":\"nhan_lich\",\"amount\":1}', '2025-07-07 01:45:10'),
(81, 4, 'create', 'transactions', 10, NULL, '{\"user_id\":4,\"group_id\":1,\"points_change\":212,\"transaction_type\":\"nhan_lich\",\"amount\":21}', '2025-07-07 01:53:01'),
(82, 4, 'login', 'users', 4, NULL, NULL, '2025-07-07 03:09:58'),
(83, 4, 'update_group_admin', 'user_groups', 4, NULL, '{\"groupId\":1,\"isGroupAdmin\":0}', '2025-07-07 03:22:14'),
(84, 4, 'login', 'users', 4, NULL, NULL, '2025-07-07 04:10:55'),
(85, 1, 'login', 'users', 1, NULL, NULL, '2025-07-07 04:32:49'),
(86, 1, 'update_group_admin', 'user_groups', 4, NULL, '{\"groupId\":1,\"isGroupAdmin\":1}', '2025-07-07 04:33:08'),
(87, 1, 'update_group_admin', 'user_groups', 4, NULL, '{\"groupId\":1,\"isGroupAdmin\":0}', '2025-07-07 04:33:16'),
(88, 1, 'update_group_admin', 'user_groups', 4, NULL, '{\"groupId\":1,\"isGroupAdmin\":0}', '2025-07-07 04:33:17'),
(89, 4, 'login', 'users', 4, NULL, NULL, '2025-07-07 18:11:53'),
(90, 4, 'login', 'users', 4, NULL, NULL, '2025-07-07 18:33:50'),
(91, 1, 'login', 'users', 1, NULL, NULL, '2025-07-07 18:34:02'),
(92, 1, 'create', 'transactions', 11, NULL, '{\"user_id\":1,\"group_id\":1,\"points_change\":-21,\"transaction_type\":\"nhan_lich\",\"amount\":-32}', '2025-07-07 18:34:30'),
(93, 1, 'create', 'transactions', 12, NULL, '{\"user_id\":1,\"group_id\":1,\"points_change\":-12,\"transaction_type\":\"san_cho\",\"amount\":43}', '2025-07-07 18:35:37'),
(94, 1, 'add_user_to_group', 'user_groups', 14, NULL, '{\"groupId\":1,\"userId\":3,\"isGroupAdmin\":false}', '2025-07-07 18:41:33'),
(95, 1, 'remove_user_from_group', 'user_groups', 1, '{\"groupId\":1}', NULL, '2025-07-07 20:32:06'),
(96, 1, 'remove_user_from_group', 'user_groups', 3, '{\"groupId\":1}', NULL, '2025-07-07 20:32:07'),
(97, 1, 'update_group_admin', 'user_groups', 4, NULL, '{\"groupId\":1,\"isGroupAdmin\":1}', '2025-07-07 20:32:19'),
(98, 1, 'create', 'groups', 4, NULL, '{\"group_name\":\"212\"}', '2025-07-08 06:56:18'),
(99, 1, 'create', 'groups', 5, NULL, '{\"group_name\":\"Kietej\"}', '2025-07-08 06:57:06'),
(100, 1, 'login', 'users', 1, NULL, NULL, '2025-07-08 07:00:51'),
(101, 4, 'login', 'users', 4, NULL, NULL, '2025-07-08 07:57:57');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `group_id` int(11) NOT NULL,
  `group_name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`group_id`, `group_name`, `created_at`, `created_by`) VALUES
(1, 'Nhóm chơi golf chính', '2025-06-22 17:00:00', 2),
(2, 'Nhóm golf nghiệp dư', '2025-06-23 09:30:00', 2),
(3, 'Nhóm golf cao cấp', '2025-06-24 14:15:00', 1),
(4, '212', '2025-07-08 06:56:17', 1),
(5, 'Kietej', '2025-07-08 06:57:06', 1);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `transaction_date` datetime NOT NULL,
  `points_change` int(11) NOT NULL,
  `transaction_type` enum('nhan_san','san_cho','nhan_lich','giao_lich') NOT NULL,
  `related_user` varchar(100) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `content` text DEFAULT NULL,
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `user_id`, `group_id`, `transaction_date`, `points_change`, `transaction_type`, `related_user`, `amount`, `content`, `created_by`) VALUES
(1, 3, 1, '2025-06-22 18:00:00', 10, 'nhan_san', NULL, 100.00, 'Nhận sân golf A', 2),
(2, 4, 1, '2025-06-22 18:30:00', -5, 'san_cho', '3', 50.00, 'Sân chơ cho user1', 2),
(3, 5, 1, '2025-06-23 10:00:00', 15, 'nhan_lich', NULL, 150.00, 'Nhận lịch đánh golf', 2),
(4, 3, 2, '2025-06-23 11:00:00', -10, 'giao_lich', '4', 100.00, 'Giao lịch cho user2', 2),
(5, 1, 3, '2025-06-24 15:00:00', 20, 'nhan_san', NULL, 200.00, 'Nhận sân golf B', 1),
(6, 4, 3, '2025-06-24 16:00:00', -15, 'san_cho', '1', 150.00, 'Sân chơ cho admin', 1),
(7, 2, 1, '2025-07-06 09:43:38', 121, 'nhan_san', '1121', 32.00, 'qqw11', 1),
(8, 4, 1, '2025-07-06 18:31:04', 12, 'nhan_lich', '12', 12.00, '1', 4),
(9, 4, 1, '2025-07-06 18:45:10', 1, 'nhan_lich', '1', 1.00, '1', 4),
(10, 4, 1, '2025-07-06 18:53:01', 212, 'nhan_lich', '121', 21.00, '12', 4),
(11, 1, 1, '2025-07-07 11:34:29', -21, 'nhan_lich', '12', -32.00, '121', 1),
(12, 1, 1, '2025-07-07 11:35:37', -12, 'san_cho', '121', 43.00, '212', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `zalo_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('system_admin','group_admin','user') NOT NULL DEFAULT 'user',
  `created_at` datetime NOT NULL,
  `points` int(11) NOT NULL DEFAULT 0,
  `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `zalo_name`, `email`, `password_hash`, `role`, `created_at`, `points`, `balance`, `is_active`) VALUES
(1, 'admin', 'Admin Zalo', 'admin@example.com', '$2a$12$gCkIP/rDo4WkGMnMlasMxeLWTED9okxDPv/yLYnSKw6UuJmXhyxwG', 'system_admin', '2025-06-22 16:50:41', 991, 4925.00, 1),
(2, 'groupadmin1', 'Group Admin 1', 'groupadmin1@example.com', '$2a$12$gCkIP/rDo4WkGMnMlasMxeLWTED9okxDPv/yLYnSKw6UuJmXhyxwG', 'group_admin', '2025-06-22 16:50:41', 379, 2468.00, 1),
(3, 'user1', 'User One', 'user1@example.com', '$2a$12$gCkIP/rDo4WkGMnMlasMxeLWTED9okxDPv/yLYnSKw6UuJmXhyxwG', 'user', '2025-06-22 16:50:41', 100, 500.00, 1),
(4, 'user2', 'User Two', 'user2@example.com', '$2a$12$gCkIP/rDo4WkGMnMlasMxeLWTED9okxDPv/yLYnSKw6UuJmXhyxwG', 'user', '2025-06-22 16:50:41', 425, 1034.00, 1),
(5, 'user3', 'User Three', 'user3@example.com', '$2a$12$gCkIP/rDo4WkGMnMlasMxeLWTED9okxDPv/yLYnSKw6UuJmXhyxwG', 'user', '2025-06-22 16:50:41', 150, 750.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_groups`
--

CREATE TABLE `user_groups` (
  `user_group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `is_group_admin` tinyint(1) NOT NULL DEFAULT 0,
  `joined_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_groups`
--

INSERT INTO `user_groups` (`user_group_id`, `user_id`, `group_id`, `is_group_admin`, `joined_at`) VALUES
(3, 4, 1, 1, '2025-06-22 17:15:00'),
(4, 5, 1, 0, '2025-06-22 17:20:00'),
(5, 2, 2, 1, '2025-06-23 09:35:00'),
(6, 3, 2, 0, '2025-06-23 09:40:00'),
(7, 1, 3, 1, '2025-06-24 14:20:00'),
(8, 4, 3, 0, '2025-06-24 14:25:00'),
(9, 2, 3, 0, '2025-06-30 22:28:30'),
(11, 3, 3, 0, '2025-07-01 08:16:47'),
(12, 1, 2, 0, '2025-07-01 08:17:10'),
(15, 1, 4, 1, '2025-07-08 06:56:18'),
(16, 1, 5, 1, '2025-07-08 06:57:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`group_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `group_id` (`group_id`),
  ADD KEY `related_user_id` (`related_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `username_6` (`username`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `username_7` (`username`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `username_8` (`username`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `username_9` (`username`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `username_10` (`username`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `username_11` (`username`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `username_12` (`username`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `username_13` (`username`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `username_14` (`username`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `username_15` (`username`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `username_16` (`username`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `username_17` (`username`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `username_18` (`username`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `username_19` (`username`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `username_20` (`username`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `username_21` (`username`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `username_22` (`username`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `username_23` (`username`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `username_24` (`username`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `username_25` (`username`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `username_26` (`username`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `username_27` (`username`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `username_28` (`username`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `username_29` (`username`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `username_30` (`username`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `username_31` (`username`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `username_32` (`username`);

--
-- Indexes for table `user_groups`
--
ALTER TABLE `user_groups`
  ADD PRIMARY KEY (`user_group_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`group_id`),
  ADD KEY `group_id` (`group_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `group_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_groups`
--
ALTER TABLE `user_groups`
  MODIFY `user_group_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_6` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `user_groups`
--
ALTER TABLE `user_groups`
  ADD CONSTRAINT `user_groups_ibfk_10` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_groups_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
