/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t8bxpcrksicbma5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bk90rtyt",
    "name": "client",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "r5ue26omv6w22m9",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("t8bxpcrksicbma5")

  // remove
  collection.schema.removeField("bk90rtyt")

  return dao.saveCollection(collection)
})
