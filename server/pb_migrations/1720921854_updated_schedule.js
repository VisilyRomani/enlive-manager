/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7pxtv531l666odf")

  // remove
  collection.schema.removeField("rufwxsud")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7pxtv531l666odf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rufwxsud",
    "name": "scheduled_date",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
})
