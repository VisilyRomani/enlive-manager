/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ark0p4l1ur07rxh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8v1vsbrr",
    "name": "modified",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ark0p4l1ur07rxh")

  // remove
  collection.schema.removeField("8v1vsbrr")

  return dao.saveCollection(collection)
})
