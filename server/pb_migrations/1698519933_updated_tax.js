/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cdt97y1esgp5vk8")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l8abb02c",
    "name": "company",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "2fh0qc1wjqqg3ix",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cdt97y1esgp5vk8")

  // remove
  collection.schema.removeField("l8abb02c")

  return dao.saveCollection(collection)
})
