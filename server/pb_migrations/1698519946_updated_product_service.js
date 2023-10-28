/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ly44da1tu5v4gq3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "i7d5da4k",
    "name": "company",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "2fh0qc1wjqqg3ix",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ly44da1tu5v4gq3")

  // remove
  collection.schema.removeField("i7d5da4k")

  return dao.saveCollection(collection)
})
