/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("jnx25mtazs4p1qt");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "jnx25mtazs4p1qt",
    "created": "2024-04-16 05:52:53.404Z",
    "updated": "2024-06-09 22:09:42.334Z",
    "name": "invoice",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "24hbt7yd",
        "name": "job",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "rimk6pyhjin29nr",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "j1jas1ng",
        "name": "invoice_number",
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
        "id": "nbornd5f",
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
        "id": "3y0ne9kr",
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
        "id": "qc0siuiq",
        "name": "invoice_data",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "wcv37xs3u9j41ev",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "379isxsy",
        "name": "invoice_pdf",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 99,
          "maxSize": 5242880,
          "mimeTypes": [
            "application/pdf"
          ],
          "thumbs": [],
          "protected": false
        }
      },
      {
        "system": false,
        "id": "qlzxybet",
        "name": "cancelled",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": "job.address.client.company = @request.auth.company",
    "viewRule": "job.address.client.company = @request.auth.company",
    "createRule": "job.address.client.company = @request.auth.company",
    "updateRule": "job.address.client.company = @request.auth.company",
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
