/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rimk6pyhjin29nr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wmo7ggbq",
    "name": "invoiced",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rimk6pyhjin29nr")

  // remove
  collection.schema.removeField("wmo7ggbq")

  return dao.saveCollection(collection)
})
