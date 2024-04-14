/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qomym7lqn63c9dc")

  // remove
  collection.schema.removeField("cvn6klzn")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wxqryyph",
    "name": "permission",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "MANAGER",
        "WORKER"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("qomym7lqn63c9dc")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cvn6klzn",
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

  // remove
  collection.schema.removeField("wxqryyph")

  return dao.saveCollection(collection)
})
