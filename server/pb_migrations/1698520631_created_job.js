/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "rimk6pyhjin29nr",
    "created": "2023-10-28 19:17:11.144Z",
    "updated": "2023-10-28 19:17:11.144Z",
    "name": "job",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fvarld6t",
        "name": "client",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "r5ue26omv6w22m9",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("rimk6pyhjin29nr");

  return dao.deleteCollection(collection);
})
