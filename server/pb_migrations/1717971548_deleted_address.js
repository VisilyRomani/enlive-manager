/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("t8bxpcrksicbma5");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "t8bxpcrksicbma5",
    "created": "2023-10-22 16:17:37.848Z",
    "updated": "2024-01-18 21:05:20.901Z",
    "name": "address",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "jpyb6daj",
        "name": "address",
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
        "id": "kyl6fudj",
        "name": "lat",
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
        "id": "vqvc56l2",
        "name": "lng",
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
        "id": "oydbhcgq",
        "name": "active",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "bk90rtyt",
        "name": "client",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "r5ue26omv6w22m9",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.company.id=client.company.id ",
    "viewRule": "@request.auth.company.id=client.company.id ",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
