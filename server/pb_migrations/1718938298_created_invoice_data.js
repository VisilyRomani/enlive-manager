/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "gy0jn4k42maer2l",
    "created": "2024-06-21 02:51:38.244Z",
    "updated": "2024-06-21 02:51:38.244Z",
    "name": "invoice_data",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zko7fxab",
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
        "id": "rt1o5clb",
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
        "id": "lw6q6xjl",
        "name": "service",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "3nsc4368uk8urag",
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
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("gy0jn4k42maer2l");

  return dao.deleteCollection(collection);
})
