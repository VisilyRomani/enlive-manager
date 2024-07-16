/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("e28yshcc83e4hrf")

  collection.updateRule = "(@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER') && @request.auth.company = company "

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("e28yshcc83e4hrf")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
