/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jnx25mtazs4p1qt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qlzxybet",
    "name": "cancelled",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jnx25mtazs4p1qt")

  // remove
  collection.schema.removeField("qlzxybet")

  return dao.saveCollection(collection)
})
