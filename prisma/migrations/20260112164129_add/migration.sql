-- CreateTable
CREATE TABLE `asistente` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `id_canal` BIGINT NOT NULL,
    `nombre` VARCHAR(45) NOT NULL,
    `tipo` VARCHAR(45) NOT NULL,
    `estado` VARCHAR(45) NOT NULL,
    `descripcion` TEXT NULL,

    INDEX `fk_asistente_canal1_idx`(`id_canal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `canal` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `id_sucursal` BIGINT NOT NULL,
    `tipo` VARCHAR(45) NOT NULL,
    `nombre` TEXT NOT NULL,
    `estado` VARCHAR(45) NOT NULL,

    INDEX `id_sucursal`(`id_sucursal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `canal_config` (
    `id` INTEGER NOT NULL,
    `id_canal` BIGINT NOT NULL,
    `config` JSON NOT NULL,

    INDEX `fk_canal_config_canal1_idx`(`id_canal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `intencion` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `id_asistente` BIGINT NOT NULL,
    `clave` TEXT NULL,
    `nombre` VARCHAR(45) NULL,
    `descripcion` TEXT NULL,
    `tipo_accion` VARCHAR(45) NULL,
    `config` JSON NULL,
    `activo` TINYINT NULL,

    INDEX `fk_intencion_asistente1_idx`(`id_asistente`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lead_prospectos` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `id_sucursal` BIGINT NULL,
    `nombre` TEXT NULL,
    `telefono` TEXT NULL,
    `fuente` TEXT NULL,
    `etapa` TEXT NULL,

    INDEX `id_sucursal`(`id_sucursal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mensaje` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `id_lead` BIGINT NULL,
    `rol` TEXT NULL,
    `contenido` TEXT NULL,
    `tipo` ENUM('texto', 'imagen', 'boton', 'archivo') NULL DEFAULT 'texto',
    `fecha_envio` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_lead`(`id_lead`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prompt` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `id_asistente` BIGINT NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `prompt_final` TEXT NOT NULL,
    `fecha_creacion` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_prompt_asistente1_idx`(`id_asistente`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prompt_atributos` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `id_prompt` BIGINT NOT NULL,
    `clave_variable` VARCHAR(100) NULL,
    `pregunta` TEXT NULL,
    `respuesta` TEXT NOT NULL,

    INDEX `id_prompt`(`id_prompt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sucursal` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `id_usuario` BIGINT NOT NULL,
    `nombre_negocio` TEXT NULL,
    `giro` TEXT NULL,
    `ciudad` TEXT NULL,
    `horarios` TEXT NULL,
    `url_redes_sociales` TEXT NULL,
    `estado` VARCHAR(15) NULL,

    INDEX `fk_sucursal_usuario1_idx`(`id_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
    `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `fecha_creacion` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `nombre` VARCHAR(255) NULL,
    `verificado` BOOLEAN NOT NULL DEFAULT false,
    `codigo_verificacion` VARCHAR(6) NULL,
    `codigo_expira_en` DATETIME(3) NULL,
    `intentos_fallidos` INTEGER NOT NULL DEFAULT 0,
    `fecha_ultima_solicitud` DATETIME(3) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asistente` ADD CONSTRAINT `fk_asistente_canal1` FOREIGN KEY (`id_canal`) REFERENCES `canal`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `canal` ADD CONSTRAINT `canales_ibfk_1` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursal`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `canal_config` ADD CONSTRAINT `fk_canal_config_canal1` FOREIGN KEY (`id_canal`) REFERENCES `canal`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `intencion` ADD CONSTRAINT `fk_intencion_asistente1` FOREIGN KEY (`id_asistente`) REFERENCES `asistente`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `lead_prospectos` ADD CONSTRAINT `lead_prospectos_ibfk_1` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursal`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `mensaje` ADD CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`id_lead`) REFERENCES `lead_prospectos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `prompt` ADD CONSTRAINT `fk_prompt_asistente1` FOREIGN KEY (`id_asistente`) REFERENCES `asistente`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `prompt_atributos` ADD CONSTRAINT `prompt_atributos_ibfk_1` FOREIGN KEY (`id_prompt`) REFERENCES `prompt`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `sucursal` ADD CONSTRAINT `fk_sucursal_usuario1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
