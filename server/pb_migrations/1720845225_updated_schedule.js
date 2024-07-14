/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7pxtv531l666odf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tfqwcmyq",
    "name": "schedule_date",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7pxtv531l666odf")

  // remove
  collection.schema.removeField("tfqwcmyq")

  return dao.saveCollection(collection)
})
