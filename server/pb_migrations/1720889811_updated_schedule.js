/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7pxtv531l666odf")

  // remove
  collection.schema.removeField("jy4vgher")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7pxtv531l666odf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jy4vgher",
    "name": "test",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
