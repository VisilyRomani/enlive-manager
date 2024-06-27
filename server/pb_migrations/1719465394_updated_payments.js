/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8o2qbtxx9w9whxj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pnmtagft",
    "name": "code",
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
  const collection = dao.findCollectionByNameOrId("8o2qbtxx9w9whxj")

  // remove
  collection.schema.removeField("pnmtagft")

  return dao.saveCollection(collection)
})
