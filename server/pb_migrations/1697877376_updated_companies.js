/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2fh0qc1wjqqg3ix")

  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2fh0qc1wjqqg3ix")

  collection.viewRule = "@request.auth.company.id = id"

  return dao.saveCollection(collection)
})
