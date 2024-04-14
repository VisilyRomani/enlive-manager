/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2fh0qc1wjqqg3ix")

  collection.listRule = ""
  collection.createRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2fh0qc1wjqqg3ix")

  collection.listRule = null
  collection.createRule = "@request.auth.permission = 'OWNER'"

  return dao.saveCollection(collection)
})
