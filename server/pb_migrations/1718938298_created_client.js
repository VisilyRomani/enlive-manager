/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "7a23ie7fb8sju9x",
    "created": "2024-06-21 02:51:38.243Z",
    "updated": "2024-06-21 02:51:38.243Z",
    "name": "client",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "woa9i62n",
        "name": "first_name",
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
        "id": "q5fbstin",
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
        "id": "citbfda7",
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
        "id": "s7hzuhyz",
        "name": "email",
        "type": "email",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      },
      {
        "system": false,
        "id": "ygls5kgn",
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
      },
      {
        "system": false,
        "id": "tia7xddb",
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
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("7a23ie7fb8sju9x");

  return dao.deleteCollection(collection);
})
