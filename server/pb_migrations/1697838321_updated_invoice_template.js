/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ur9z5ohjmygdhoq")

  collection.createRule = "@request.auth.permission ='OWNER'"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ur9z5ohjmygdhoq")

  collection.createRule = null

  return dao.saveCollection(collection)
})
