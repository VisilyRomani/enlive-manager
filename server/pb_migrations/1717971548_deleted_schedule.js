/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("rtzi2qg5c3f832f");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "rtzi2qg5c3f832f",
    "created": "2023-11-04 09:01:02.179Z",
    "updated": "2024-01-17 17:06:13.101Z",
    "name": "schedule",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "pj9cfi10",
        "name": "scheduled_date",
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
        "id": "jlfbkxm6",
        "name": "job",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "rimk6pyhjin29nr",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "idhshgjw",
        "name": "employee",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fs9rpvtn",
        "name": "title",
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
        "id": "hfyrprtt",
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
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.company = company \n",
    "viewRule": "@request.auth.company = company ",
    "createRule": "@request.auth.company = company && (@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')",
    "updateRule": "@request.auth.company = company && (@request.auth.permission = 'OWNER' || @request.auth.permission = 'MANAGER')",
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
