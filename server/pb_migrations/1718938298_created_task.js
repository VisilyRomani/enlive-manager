/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "db40oqd9l5pfh7q",
    "created": "2024-06-21 02:51:38.244Z",
    "updated": "2024-06-21 02:51:38.244Z",
    "name": "task",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "gzscanmf",
        "name": "service",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "3nsc4368uk8urag",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "jbrsev34",
        "name": "price",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "c4mmejcs",
        "name": "company",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "pdomexente3tkhr",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "o4ighpti",
        "name": "count",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.company = company ",
    "viewRule": "@request.auth.company = company ",
    "createRule": "@request.auth.company = company && (@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')",
    "updateRule": "@request.auth.company = company && (@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')",
    "deleteRule": "@request.auth.company = company && (@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("db40oqd9l5pfh7q");

  return dao.deleteCollection(collection);
})
