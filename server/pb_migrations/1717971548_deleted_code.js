/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("qomym7lqn63c9dc");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "qomym7lqn63c9dc",
    "created": "2024-04-12 05:04:19.255Z",
    "updated": "2024-06-09 22:09:42.118Z",
    "name": "code",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "z9xghwbr",
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
        "id": "wxqryyph",
        "name": "permission",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "MANAGER",
            "WORKER"
          ]
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.company.id != null && @request.auth.permission = \"OWNER\"",
    "updateRule": null,
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
