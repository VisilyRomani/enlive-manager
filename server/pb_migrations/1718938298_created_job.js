/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "lh35voriiy2jor3",
    "created": "2024-06-21 02:51:38.244Z",
    "updated": "2024-06-21 02:51:38.244Z",
    "name": "job",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "6xuhe3rm",
        "name": "status",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "PENDING",
            "IN_PROGRESS",
            "COMPLETED",
            "RESCHEDULE",
            "CANCELED",
            "SCHEDULED"
          ]
        }
      },
      {
        "system": false,
        "id": "thswnkge",
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
        "id": "h0zbhpas",
        "name": "notes",
        "type": "text",
        "required": false,
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
        "id": "y4g6g3w7",
        "name": "address",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "6c0af6kmb5jswbv",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "5oxcqooq",
        "name": "task",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "db40oqd9l5pfh7q",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "xcvj9don",
        "name": "order",
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
        "id": "ijspfbv2",
        "name": "job_number",
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
        "id": "sv0sspnv",
        "name": "update_description",
        "type": "text",
        "required": false,
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
        "id": "99cx2cwa",
        "name": "invoiced",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.company = company",
    "viewRule": "@request.auth.company = company",
    "createRule": "@request.auth.company = company && (@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')",
    "updateRule": "@request.auth.company = company && (@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')",
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("lh35voriiy2jor3");

  return dao.deleteCollection(collection);
})
