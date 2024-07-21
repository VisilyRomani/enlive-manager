/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8o2qbtxx9w9whxj")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uuwwxqsv",
    "name": "method",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "CASH",
        "CHEQUE",
        "CARD",
        "E-TRANSFER",
        "DEBIT"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8o2qbtxx9w9whxj")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uuwwxqsv",
    "name": "method",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "CASH",
        "CHEQUE",
        "CARD",
        "E-TRANSFER"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
