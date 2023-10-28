/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ly44da1tu5v4gq3")

  collection.name = "service"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ly44da1tu5v4gq3")

  collection.name = "product_service"

  return dao.saveCollection(collection)
})
