/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rimk6pyhjin29nr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l4ufm3r0",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rimk6pyhjin29nr")

  // remove
  collection.schema.removeField("l4ufm3r0")

  return dao.saveCollection(collection)
})
