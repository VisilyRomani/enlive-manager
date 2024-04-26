/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jnx25mtazs4p1qt")

  collection.listRule = "job.address.client.company = @request.auth.company"
  collection.viewRule = "job.address.client.company = @request.auth.company"
  collection.createRule = "job.address.client.company = @request.auth.company"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jnx25mtazs4p1qt")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
