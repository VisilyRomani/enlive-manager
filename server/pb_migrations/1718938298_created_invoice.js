/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ark0p4l1ur07rxh",
    "created": "2024-06-21 02:51:38.243Z",
    "updated": "2024-06-21 02:51:38.243Z",
    "name": "invoice",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "3dx8iur5",
        "name": "job",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "lh35voriiy2jor3",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "8bg2ifpg",
        "name": "invoice_number",
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
        "id": "krx2w3zq",
        "name": "issue_date",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "6cqgzg8x",
        "name": "due_date",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "eg2zay8l",
        "name": "invoice_pdf",
        "type": "file",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 99,
          "maxSize": 5242880,
          "mimeTypes": [],
          "thumbs": [],
          "protected": false
        }
      },
      {
        "system": false,
        "id": "v5jmozw1",
        "name": "cancelled",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "38s2hscm",
        "name": "invoice_data",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "gy0jn4k42maer2l",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_gXic0RW` ON `invoice` (`job`)"
    ],
    "listRule": "job.address.client.company = @request.auth.company",
    "viewRule": "job.address.client.company = @request.auth.company",
    "createRule": "job.address.client.company = @request.auth.company",
    "updateRule": "job.address.client.company = @request.auth.company",
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ark0p4l1ur07rxh");

  return dao.deleteCollection(collection);
})
