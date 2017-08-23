SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';


-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  `name` VARCHAR(64) NOT NULL,
  `type` TINYINT NOT NULL DEFAULT 0,
  `password` VARCHAR(32) NULL,
  `pw_status` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`name`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `asset`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `asset` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(64) NOT NULL,
  `make` VARCHAR(64) NOT NULL,
  `model` VARCHAR(128) NOT NULL,
  `image` VARCHAR(64) NOT NULL,
  `lat` DECIMAL(10,8) NOT NULL,
  `lon` DECIMAL(11,8) NOT NULL,
  `value` INT NOT NULL,
  `currency` CHAR(3) NOT NULL,
  `sharecount` SMALLINT NOT NULL,
  `infotext` VARCHAR(4096) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_asset_user_idx` (`user_name` ASC),
  CONSTRAINT `fk_asset_user`
    FOREIGN KEY (`user_name`)
    REFERENCES `user` (`name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
