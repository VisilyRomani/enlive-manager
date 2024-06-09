/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("cdt97y1esgp5vk8");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "cdt97y1esgp5vk8",
    "created": "2023-10-28 19:03:21.446Z",
    "updated": "2023-10-28 21:39:29.867Z",
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
      },
      {
        "system": false,
        "id": "84o6eyx4",
        "name": "active",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "l8abb02c",
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
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_8CWBhz0` ON `tax` (\n  `company`,\n  `name`\n)"
    ],
    "listRule": "(@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER') && @request.auth.company = company ",
    "viewRule": "(@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER') && @request.auth.company = company ",
    "createRule": "@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER'",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
