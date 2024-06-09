/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("wcv37xs3u9j41ev");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "wcv37xs3u9j41ev",
    "created": "2024-04-16 05:53:56.818Z",
    "updated": "2024-06-09 22:09:42.300Z",
    "name": "invoice_data",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bwoccodw",
        "name": "quantity",
        "type": "number",
        "required": true,
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
        "id": "kepnit2d",
        "name": "price",
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
        "id": "j0apzfzn",
        "name": "service",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "ly44da1tu5v4gq3",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": "service.tax.company = @request.auth.company",
    "viewRule": "service.tax.company = @request.auth.company",
    "createRule": "service.tax.company = @request.auth.company",
    "updateRule": "service.tax.company = @request.auth.company",
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
