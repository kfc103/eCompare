import { createData } from "./List";

export const prepareDb = () => {
  return new Promise((resolve, reject) => {
    //prefixes of implementation that we want to test
    let indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    /*window.indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;*/

    //prefixes of window.IDB objects
    /*window.IDBTransaction =
      window.IDBTransaction ||
      window.webkitIDBTransaction ||
      window.msIDBTransaction;
    window.IDBKeyRange =
      window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;*/

    if (!indexedDB) {
      console.log(
        "Your browser doesn't support a stable version of IndexedDB."
      );
    }

    var request = indexedDB.open("eCompareDB", 1);

    request.onerror = function (event) {
      //console.log("error: " + event);
      reject(event);
    };

    request.onsuccess = function (event) {
      var db = request.result;
      //console.log("success: " + db);
      resolve(db);
    };

    // This event is only implemented in recent browsers
    request.onupgradeneeded = function (event) {
      // Save the IDBDatabase interface
      var db = event.target.result;

      if (!db.objectStoreNames.contains("item")) {
        // Create an objectStore for this database
        var objectStore = db.createObjectStore("item", {
          keyPath: "id",
          autoIncrement: true
        });
        objectStore.add(createData(1));
        objectStore.add(createData(2));
      }
    };
  });
};

export const readAll = (db) => {
  return new Promise(function (resolve, reject) {
    if (db) {
      let objectStore = db.transaction("item").objectStore("item");
      let list = [];

      objectStore.openCursor().onsuccess = function (event) {
        let cursor = event.target.result;

        if (cursor) {
          //console.log("Name for id " + cursor.key + " is " + cursor.value.name);
          list.push(cursor.value);
          cursor.continue();
        } else {
          //alert("No more entries!");
          resolve(list);
        }
      };
    } else reject("undefined db");
  });
};

export const clearAll = (db) => {
  return new Promise(function (resolve, reject) {
    if (db) {
      let request = db
        .transaction(["item"], "readwrite")
        .objectStore("item")
        .clear();

      request.onsuccess = function (event) {
        console.log("All items are cleared");
        resolve();
      };
    } else reject();
  });
};

export const putItem = (db, item) => {
  return new Promise(function (resolve, reject) {
    if (db) {
      console.log(item);
      let request = db
        .transaction(["item"], "readwrite")
        .objectStore("item")
        .put(item);

      request.onsuccess = function (event) {
        console.log("item: " + item.id + " is put");
        resolve();
      };
    } else reject();
  });
};

export const deleteItem = (db, key) => {
  return new Promise(function (resolve, reject) {
    if (db) {
      let request = db
        .transaction(["item"], "readwrite")
        .objectStore("item")
        .delete(key);

      request.onsuccess = function (event) {
        console.log("key: " + key + " is deleted");
        resolve();
      };
    } else reject();
  });
};

export const saveAll = (db, datas) => {
  return new Promise(function (resolve, reject) {
    if (db) {
      // for multiple value
      const tx = db.transaction(["item"], "readwrite");

      datas.forEach((data) => {
        tx.objectStore("item").add(data);
        console.log("saveAll" + data);
      });

      tx.oncomplete = function (event) {
        console.log("All items are saved");
        resolve();
      };
    } else reject();
  });
};
