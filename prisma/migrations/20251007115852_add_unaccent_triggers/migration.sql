-- 1) rozszerzenia
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2) funkcje normalizujące
CREATE OR REPLACE FUNCTION normalize_txt(txt text) RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT unaccent(lower($1));
$$;

CREATE OR REPLACE FUNCTION normalize_txt_array(arr text[]) RETURNS text[] LANGUAGE sql IMMUTABLE AS $$
  SELECT COALESCE(ARRAY(SELECT unaccent(lower(x)) FROM unnest($1) AS x), ARRAY[]::text[]);
$$;

-- 3) trigger functions
CREATE OR REPLACE FUNCTION trg_book_search_fill() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.title_search := normalize_txt(NEW.title);
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION trg_edition_search_fill() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.title_search    := normalize_txt(NEW.title);
  NEW.subtitle_search := normalize_txt(NEW.subtitle);
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION trg_person_search_fill() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.name_search       := normalize_txt(NEW.name);
  NEW."sortName_search" := normalize_txt(NEW."sortName");
  NEW."aliasesSearch"   := normalize_txt_array(NEW.aliases);
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION trg_genretranslation_search_fill() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.name_search := normalize_txt(NEW.name);
  RETURN NEW;
END; $$;

-- 4) podpięcie triggerów
DROP TRIGGER IF EXISTS book_search_fill_insupd ON "Book";
CREATE TRIGGER book_search_fill_insupd
  BEFORE INSERT OR UPDATE ON "Book"
  FOR EACH ROW EXECUTE FUNCTION trg_book_search_fill();

DROP TRIGGER IF EXISTS edition_search_fill_insupd ON "Edition";
CREATE TRIGGER edition_search_fill_insupd
  BEFORE INSERT OR UPDATE ON "Edition"
  FOR EACH ROW EXECUTE FUNCTION trg_edition_search_fill();

DROP TRIGGER IF EXISTS person_search_fill_insupd ON "Person";
CREATE TRIGGER person_search_fill_insupd
  BEFORE INSERT OR UPDATE ON "Person"
  FOR EACH ROW EXECUTE FUNCTION trg_person_search_fill();

DROP TRIGGER IF EXISTS genretranslation_search_fill_insupd ON "GenreTranslation";
CREATE TRIGGER genretranslation_search_fill_insupd
  BEFORE INSERT OR UPDATE ON "GenreTranslation"
  FOR EACH ROW EXECUTE FUNCTION trg_genretranslation_search_fill();

-- 5) inicjalizacja istniejących danych
UPDATE "Book"             SET title_search    = normalize_txt(title)    WHERE title    IS NOT NULL;
UPDATE "Edition"          SET title_search    = normalize_txt(title)    WHERE title    IS NOT NULL;
UPDATE "Edition"          SET subtitle_search = normalize_txt(subtitle) WHERE subtitle IS NOT NULL;
UPDATE "Person"           SET name_search       = normalize_txt(name)       WHERE name       IS NOT NULL;
UPDATE "Person"           SET "sortName_search" = normalize_txt("sortName") WHERE "sortName" IS NOT NULL;
UPDATE "Person"           SET "aliasesSearch"   = normalize_txt_array(aliases);
UPDATE "GenreTranslation" SET name_search = normalize_txt(name) WHERE name IS NOT NULL;

-- 6) indeksy GIN/trgm
CREATE INDEX IF NOT EXISTS book_title_search_trgm_idx
  ON "Book" USING GIN (title_search gin_trgm_ops);

CREATE INDEX IF NOT EXISTS edition_title_search_trgm_idx
  ON "Edition" USING GIN (title_search gin_trgm_ops);

CREATE INDEX IF NOT EXISTS edition_subtitle_search_trgm_idx
  ON "Edition" USING GIN (subtitle_search gin_trgm_ops);

CREATE INDEX IF NOT EXISTS person_name_search_trgm_idx
  ON "Person" USING GIN (name_search gin_trgm_ops);

CREATE INDEX IF NOT EXISTS person_sortname_search_trgm_idx
  ON "Person" USING GIN ("sortName_search" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS person_aliases_search_gin_idx
  ON "Person" USING GIN ("aliasesSearch");

CREATE INDEX IF NOT EXISTS genretranslation_name_search_trgm_idx
  ON "GenreTranslation" USING GIN (name_search gin_trgm_ops);
