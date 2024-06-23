/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6c0af6kmb5jswbv")

  collection.updateRule = "@request.auth.company.id = client.company.id \n"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6c0af6kmb5jswbv")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
