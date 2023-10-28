/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cdt97y1esgp5vk8")

  collection.indexes = [
    "CREATE INDEX `idx_8CWBhz0` ON `tax` (\n  `company`,\n  `name`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cdt97y1esgp5vk8")

  collection.indexes = []

  return dao.saveCollection(collection)
})
