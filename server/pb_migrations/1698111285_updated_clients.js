/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r5ue26omv6w22m9")

  // remove
  collection.schema.removeField("ngdsbv9e")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jyy4rhbp",
    "name": "phone",
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
  const collection = dao.findCollectionByNameOrId("r5ue26omv6w22m9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ngdsbv9e",
    "name": "phone",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // remove
  collection.schema.removeField("jyy4rhbp")

  return dao.saveCollection(collection)
})
