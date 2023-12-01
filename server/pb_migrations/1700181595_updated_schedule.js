/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtzi2qg5c3f832f")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hfyrprtt",
    "name": "company",
    "type": "relation",
    "required": true,
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
  const collection = dao.findCollectionByNameOrId("rtzi2qg5c3f832f")

  // remove
  collection.schema.removeField("hfyrprtt")

  return dao.saveCollection(collection)
})
