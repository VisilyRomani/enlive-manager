/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wcv37xs3u9j41ev")

  collection.listRule = "service.tax.company = @request.auth.company"
  collection.viewRule = "service.tax.company = @request.auth.company"
  collection.createRule = "service.tax.company = @request.auth.company"
  collection.updateRule = "service.tax.company = @request.auth.company"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wcv37xs3u9j41ev")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
