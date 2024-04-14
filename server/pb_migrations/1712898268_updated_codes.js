/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qomym7lqn63c9dc")

  collection.name = "code"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qomym7lqn63c9dc")

  collection.name = "codes"

  return dao.saveCollection(collection)
})
