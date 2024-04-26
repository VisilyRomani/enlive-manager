/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "drup7jmv6pcy5gh",
    "created": "2024-04-25 02:47:17.435Z",
    "updated": "2024-04-25 02:47:17.435Z",
    "name": "payments",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "77ri1cbh",
        "name": "invoice",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "jnx25mtazs4p1qt",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "elupua0a",
        "name": "paid",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "nuol6yuf",
        "name": "method",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "CASH",
            "CHEQUE",
            "CARD",
            "E-TRANSFER"
          ]
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
  const collection = dao.findCollectionByNameOrId("drup7jmv6pcy5gh");

  return dao.deleteCollection(collection);
})
