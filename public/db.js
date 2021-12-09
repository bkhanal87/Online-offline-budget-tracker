// create a new db
let db;
const request = window.indexedDB.open("BudgetDB", 1);

//Schema

request.onupgradeneeded = function (event) {
  db = event.target.result;

  // object store called "BudgetStore" created
  const BudgetStore = db.createObjectStore("BudgetStore", {
    autoincrement: true,
  });

  // create budgets to query on their transactions
  BudgetStore.createIndex("budgets", "transactions");
};

// if the user has successfully accessed the BudgetStore and opened a transaction
request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};
// if unsuccessful
request.onerror = function (event) {
  console.log("error");
  console.log(event.target.errorCode);
};

// save record as transaction created with readwrite access

function saveRecord(record) {
  const transaction = db.transaction(["BudgetStore", "readwrite"]);
  // To access pending budget store
  const objectStore = transaction.objectStore("BudgetStore");
  objectStore.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["BudgetStore"], "readwrite");
  const budgetStore = transaction.objectStore("BudgetStore");
  const getAll = budgetStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          const transaction = db.transaction(["BudgetStore"], "readwrite");
          const budgetStore = transaction.objectStore("BudgetStore");
          budgetStore.clear();
        });
    }
  };
}

window.addEventListener("online", checkDatabase);
