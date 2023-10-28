/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cdt97y1esgp5vk8")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "84o6eyx4",
    "name": "active",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cdt97y1esgp5vk8")

  // remove
  collection.schema.removeField("84o6eyx4")

  return dao.saveCollection(collection)
})
