-- Delete food dishes (votes cascade via onDelete: Cascade on Vote.dish)
DELETE FROM "Dish" WHERE topic = 'food';

-- Replace "food" with "ingredients" in existing session topic JSON arrays
UPDATE "Session"
  SET allowedTopicsJson = REPLACE(allowedTopicsJson, '"food"', '"ingredients"')
  WHERE allowedTopicsJson LIKE '%"food"%';

UPDATE "SessionMember"
  SET sharedTopicsJson = REPLACE(sharedTopicsJson, '"food"', '"ingredients"')
  WHERE sharedTopicsJson LIKE '%"food"%';
