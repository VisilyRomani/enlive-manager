/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtzi2qg5c3f832f")

  // remove
  collection.schema.removeField("zks4p0h2")

  // remove
  collection.schema.removeField("dpsuuwy8")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pj9cfi10",
    "name": "scheduled_date",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rtzi2qg5c3f832f")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zks4p0h2",
    "name": "schedule_start",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dpsuuwy8",
    "name": "schedule_end",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "pj9cfi10",
    "name": "date",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
})
