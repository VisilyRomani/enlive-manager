/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "6c0af6kmb5jswbv",
    "created": "2024-06-21 02:51:38.243Z",
    "updated": "2024-06-21 02:51:38.243Z",
    "name": "address",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "iyjfmpyw",
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
        "id": "5d5xfjkm",
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
        "id": "eoogzzo1",
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
        "id": "nt6d9ia5",
        "name": "active",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "j6e5n4vk",
        "name": "client",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "7a23ie7fb8sju9x",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.company.id = client.company.id ",
    "viewRule": "@request.auth.company.id = client.company.id ",
    "createRule": "@request.auth.company.id = client.company.id \n",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("6c0af6kmb5jswbv");

  return dao.deleteCollection(collection);
})
