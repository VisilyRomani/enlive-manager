/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ly44da1tu5v4gq3",
    "created": "2023-10-28 19:04:52.319Z",
    "updated": "2023-10-28 19:04:52.319Z",
    "name": "product_service",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fuybutjd",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "fig6xuji",
        "name": "tax",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "cdt97y1esgp5vk8",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "hn92vbxw",
        "name": "active",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ly44da1tu5v4gq3");

  return dao.deleteCollection(collection);
})
