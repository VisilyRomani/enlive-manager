/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("drup7jmv6pcy5gh")

  collection.listRule = "invoice.job.company = @request.auth.company\n"
  collection.viewRule = "invoice.job.company = @request.auth.company\n"
  collection.createRule = "invoice.job.company = @request.auth.company"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("drup7jmv6pcy5gh")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
