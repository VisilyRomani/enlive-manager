/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1f41rneyzt0woz4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "llqugty1",
    "name": "amount",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1f41rneyzt0woz4")

  // remove
  collection.schema.removeField("llqugty1")

  return dao.saveCollection(collection)
})
