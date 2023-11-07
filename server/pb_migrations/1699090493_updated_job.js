/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rimk6pyhjin29nr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9sdjvcmy",
    "name": "order",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rimk6pyhjin29nr")

  // remove
  collection.schema.removeField("9sdjvcmy")

  return dao.saveCollection(collection)
})
