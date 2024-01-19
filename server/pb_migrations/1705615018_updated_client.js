/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r5ue26omv6w22m9")

  collection.updateRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r5ue26omv6w22m9")

  collection.updateRule = "@request.auth.company.id = @request.data.company.id &&( @request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')"

  return dao.saveCollection(collection)
})
