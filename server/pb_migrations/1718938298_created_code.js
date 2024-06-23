/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "v543daq4tjokv33",
    "created": "2024-06-21 02:51:38.243Z",
    "updated": "2024-06-21 02:51:38.243Z",
    "name": "code",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "yvmxjyon",
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
        "id": "lc3zhhqj",
        "name": "permission",
        "type": "select",
        "required": true,
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
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("v543daq4tjokv33");

  return dao.deleteCollection(collection);
})
