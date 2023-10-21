/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2fh0qc1wjqqg3ix")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "owajujdf",
    "name": "invoice_template",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ur9z5ohjmygdhoq",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2fh0qc1wjqqg3ix")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "owajujdf",
    "name": "invoice_template",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ur9z5ohjmygdhoq",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
