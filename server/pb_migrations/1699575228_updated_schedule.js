/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtzi2qg5c3f832f")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fs9rpvtn",
    "name": "title",
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
  const collection = dao.findCollectionByNameOrId("rtzi2qg5c3f832f")

  // remove
  collection.schema.removeField("fs9rpvtn")

  return dao.saveCollection(collection)
})
