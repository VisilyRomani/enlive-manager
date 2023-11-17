/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2fh0qc1wjqqg3ix")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1ihpohfx",
    "name": "job_count",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2fh0qc1wjqqg3ix")

  // remove
  collection.schema.removeField("1ihpohfx")

  return dao.saveCollection(collection)
})
