/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "cdt97y1esgp5vk8",
    "created": "2023-10-28 19:03:21.446Z",
    "updated": "2023-10-28 19:03:21.446Z",
    "name": "tax",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "pxwkjgtq",
        "name": "name",
        "type": "text",
        "required": true,
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
        "id": "sekkijna",
        "name": "percent",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": 100,
          "noDecimal": false
        }
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
  const collection = dao.findCollectionByNameOrId("cdt97y1esgp5vk8");

  return dao.deleteCollection(collection);
})
