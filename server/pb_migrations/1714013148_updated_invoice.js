/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jnx25mtazs4p1qt")

  collection.updateRule = "job.address.client.company = @request.auth.company"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jnx25mtazs4p1qt")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
