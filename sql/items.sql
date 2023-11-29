DROP TABLE IF EXISTS `item`;
CREATE TABLE `item`
(
    `id`          bigint                                                        NOT NULL AUTO_INCREMENT,
    `title`    varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
    `content`    varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
    `image`    varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
    `creatorId`     bigint                                                        NOT NULL,
    `ownerId`       bigint                                                         NOT NULL DEFAULT -1,
    `type`   int                                                           NOT NULL DEFAULT 0 COMMENT '0 表示捐赠物，1 表示数字艺术品',
    `score`   int                                                           NOT NULL DEFAULT 0 COMMENT '所需积分',
    `status`   int                                                           NOT NULL DEFAULT 0 COMMENT '状态 0 表示未捐赠，1 表示等待发货， 2 表示已发货 3，表示已经收获',  
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户表';

