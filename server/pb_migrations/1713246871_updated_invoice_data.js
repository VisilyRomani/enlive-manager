/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wcv37xs3u9j41ev")

  // remove
  collection.schema.removeField("fqhgfnlk")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "j0apzfzn",
    "name": "service",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ly44da1tu5v4gq3",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wcv37xs3u9j41ev")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fqhgfnlk",
    "name": "task",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "1f41rneyzt0woz4",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("j0apzfzn")

  return dao.saveCollection(collection)
})
