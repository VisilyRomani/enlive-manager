/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t8bxpcrksicbma5")

  collection.listRule = "@request.auth.company.id=client.company.id && active = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t8bxpcrksicbma5")

  collection.listRule = "@request.auth.company.id=client.company.id"

  return dao.saveCollection(collection)
})
