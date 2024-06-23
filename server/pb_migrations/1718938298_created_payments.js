/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "8o2qbtxx9w9whxj",
    "created": "2024-06-21 02:51:38.244Z",
    "updated": "2024-06-21 02:51:38.244Z",
    "name": "payments",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "g9pllw0b",
        "name": "invoice",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "ark0p4l1ur07rxh",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "mhfsdqzd",
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
        "id": "uuwwxqsv",
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
    "listRule": "invoice.job.company = @request.auth.company\n",
    "viewRule": "invoice.job.company = @request.auth.company\n",
    "createRule": "invoice.job.company = @request.auth.company\n",
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("8o2qbtxx9w9whxj");

  return dao.deleteCollection(collection);
})
