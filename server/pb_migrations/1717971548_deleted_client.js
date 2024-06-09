/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("r5ue26omv6w22m9");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "r5ue26omv6w22m9",
    "created": "2023-10-22 16:16:34.211Z",
    "updated": "2024-01-18 21:58:03.918Z",
    "name": "client",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "uxhgo6so",
        "name": "first_name",
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
        "id": "1hf6zqmo",
        "name": "last_name",
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
        "id": "vnjtlkx2",
        "name": "email",
        "type": "email",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": []
        }
      },
      {
        "system": false,
        "id": "symqzg6e",
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
        "id": "g4vel0dj",
        "name": "company",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "2fh0qc1wjqqg3ix",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "jyy4rhbp",
        "name": "phone",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.company.id = company.id",
    "viewRule": "@request.auth.company.id = company.id",
    "createRule": "@request.auth.company.id = @request.data.company.id && ( @request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')",
    "updateRule": "@request.auth.company.id = company.id && ( @request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')",
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
