/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r5ue26omv6w22m9")

  collection.listRule = "@request.auth.company.id = company.id"
  collection.viewRule = "@request.auth.company.id = company.id"
  collection.createRule = "@request.auth.company.id = @request.data.company.id && ( @request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')"
  collection.updateRule = "@request.auth.company.id = @request.data.company.id &&( @request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r5ue26omv6w22m9")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
