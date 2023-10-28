/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rimk6pyhjin29nr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kscbobyb",
    "name": "task",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "1f41rneyzt0woz4",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bnis2ocp",
    "name": "status",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
        "RESCHEDULE",
        "CANCELED",
        "SCHEDULED"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rimk6pyhjin29nr")

  // remove
  collection.schema.removeField("kscbobyb")

  // remove
  collection.schema.removeField("bnis2ocp")

  return dao.saveCollection(collection)
})
