/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cdt97y1esgp5vk8")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER'"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cdt97y1esgp5vk8")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
