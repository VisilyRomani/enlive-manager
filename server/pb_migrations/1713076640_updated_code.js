/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qomym7lqn63c9dc")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.company.id != null && @request.auth.permission = \"OWNER\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qomym7lqn63c9dc")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
