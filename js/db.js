let db;


const dbPromise = new Promise((resolve, reject) => {

  const request = indexedDB.open("DaydreamersDB", 2);

  request.onupgradeneeded = function (event) {
    db = event.target.result;

    db.createObjectStore("books", {
      keyPath: "id",
      autoIncrement: true
    });
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    resolve(db);
  };

  request.onerror = function (event) {
    reject(event.target.error);
  };

})



export function getBooks() {

  return dbPromise.then((db) => {

    return new Promise((resolve, reject) => {
      const transaction = db.transaction("books", "readonly");
      const store = transaction.objectStore("books");

      const books = [];
      const request = store.openCursor();

      request.onsuccess = function (event) {
        const cursor = event.target.result;

        if (cursor) {
          const book = cursor.value;
          book.id = cursor.key;
          books.push(book);
          cursor.continue();
        } 
        
        else {
          resolve(books);
        }
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  });
}



export function addBook(book) {

  return dbPromise.then((db) => {

    const transaction = db.transaction("books", "readwrite");
    const store = transaction.objectStore("books");

    store.add(book);

  })
}


export function getBook(id) {

  return dbPromise.then((db) => {

    return new Promise((resolve, reject) => {
      const transaction = db.transaction("books", "readonly");
      const store = transaction.objectStore("books");

      const request = store.get(id);

      request.onsuccess = function () {
        resolve(request.result);
      };

      request.onerror = function () {
        reject(request.error);
      };
    });

  })
}


export function updateBook(book) {

  return dbPromise.then((db) => {


    const transaction = db.transaction("books", "readwrite");
    const store = transaction.objectStore("books");

    store.put(book);
  })
}


export function deleteBook(id) {

  return dbPromise.then((db) => {

    const transaction = db.transaction("books", "readwrite");
    const store = transaction.objectStore("books");

    store.delete(id);
  })
}
