/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ly44da1tu5v4gq3")

  collection.listRule = " @request.auth.company = company "
  collection.viewRule = "@request.auth.company = company "
  collection.createRule = "(@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER') && @request.auth.company = company "
  collection.updateRule = "(@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER') && @request.auth.company = company "

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ly44da1tu5v4gq3")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
