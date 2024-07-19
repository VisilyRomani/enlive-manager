/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ark0p4l1ur07rxh")

  // remove
  collection.schema.removeField("w3kjlb2g")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ark0p4l1ur07rxh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "w3kjlb2g",
    "name": "total_post_tax",
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

  return dao.saveCollection(collection)
})
