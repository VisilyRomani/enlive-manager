/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rimk6pyhjin29nr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "eyxen079",
    "name": "address",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "t8bxpcrksicbma5",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rimk6pyhjin29nr")

  // remove
  collection.schema.removeField("eyxen079")

  return dao.saveCollection(collection)
})
