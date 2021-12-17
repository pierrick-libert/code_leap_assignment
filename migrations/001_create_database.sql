-- ---
-- Globals
-- ---
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---
-- Table 'breed'
-- 
-- ---
CREATE TABLE IF NOT EXISTS breed (
  id UUID DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);


-- ---
-- Table 'image'
-- 
-- ---
CREATE TABLE IF NOT EXISTS image (
  id VARCHAR(20),
  url VARCHAR(1000) NOT NULL,
  filename VARCHAR(30),
  height DECIMAL(6, 2) NOT NULL,
  width DECIMAL(6, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (id)
);


-- ---
-- Table 'breed_image'
-- 
-- ---
CREATE TABLE IF NOT EXISTS breed_image (
  breed_id UUID NOT NULL,
  image_id VARCHAR(20) NOT NULL,
  UNIQUE (breed_id, image_id),
  CONSTRAINT breed_breed_image_fk FOREIGN KEY (breed_id) REFERENCES breed(id) ON DELETE CASCADE,
  CONSTRAINT image_breed_image_fk FOREIGN KEY (image_id) REFERENCES image(id) ON DELETE CASCADE
);
