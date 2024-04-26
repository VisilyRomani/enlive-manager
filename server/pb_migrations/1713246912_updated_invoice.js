/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jnx25mtazs4p1qt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qc0siuiq",
    "name": "invoice_data",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "wcv37xs3u9j41ev",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jnx25mtazs4p1qt")

  // remove
  collection.schema.removeField("qc0siuiq")

  return dao.saveCollection(collection)
})
