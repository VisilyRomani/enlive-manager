/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cdt97y1esgp5vk8")

  collection.listRule = "(@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER') && @request.auth.company = company "
  collection.viewRule = "(@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER') && @request.auth.company = company "

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cdt97y1esgp5vk8")

  collection.listRule = "@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER'"
  collection.viewRule = "@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER'"

  return dao.saveCollection(collection)
})
