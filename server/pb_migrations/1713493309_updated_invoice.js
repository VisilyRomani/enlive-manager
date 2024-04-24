/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jnx25mtazs4p1qt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "379isxsy",
    "name": "invoice_pdf",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 99,
      "maxSize": 5242880,
      "mimeTypes": [
        "application/pdf"
      ],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jnx25mtazs4p1qt")

  // remove
  collection.schema.removeField("379isxsy")

  return dao.saveCollection(collection)
})
