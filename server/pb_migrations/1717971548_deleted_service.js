/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ly44da1tu5v4gq3");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "ly44da1tu5v4gq3",
    "created": "2023-10-28 19:04:52.319Z",
    "updated": "2023-10-29 01:55:02.339Z",
    "name": "service",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fuybutjd",
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
        "id": "fig6xuji",
        "name": "tax",
        "type": "relation",
        "required": true,
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
      },
      {
        "system": false,
        "id": "i7d5da4k",
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
    "indexes": [],
    "listRule": " @request.auth.company = company ",
    "viewRule": "@request.auth.company = company ",
    "createRule": "(@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER') && @request.auth.company = company ",
    "updateRule": "(@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER') && @request.auth.company = company ",
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
