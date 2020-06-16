CREATE TABLE "angle_table" ("key" int not null, "value" float not null);

INSERT INTO "angle_table" ("key", "value") VALUES (0, 0.0);

UPDATE "angle_table" 
SET "value" = "value" + 0.1 
WHERE "key" = 0 
RETURNING "value" 

