/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7a23ie7fb8sju9x")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mavcxdz9",
    "name": "client_company_name",
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
  const collection = dao.findCollectionByNameOrId("7a23ie7fb8sju9x")

  // remove
  collection.schema.removeField("mavcxdz9")

  return dao.saveCollection(collection)
})
