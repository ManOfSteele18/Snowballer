var db;

function openDatabase(name, version, errorCallback, upgradeCallback, 
                      successCallback) {
	console.log('Creating/Opening Database...');
  
	if (!window.indexedDB) {
		window.alert('Your browser does not support a stable version of IndexedDB');
	}
  
	let request = indexedDB.open(name, version);
  
	request.onerror = errorCallback;
	request.onupgradeneeded = upgradeCallback;
	request.onsuccess = successCallback;
} // end createDatabase

function getListFromCursor(objStore, trCompleteCallback) {
	let cursorItemList = [];
	let transaction = db.transaction(objStore);
	let objectStore = transaction.objectStore(objStore);
  
	objectStore.openCursor().onsuccess = function (evt) {
		let cursor = evt.target.result;
    
		if (cursor) {
			cursorItemList.push(JSON.parse(cursor.value));
			cursor.continue();
		}
	};
  
	transaction.oncomplete = function() { trCompleteCallback(cursorItemList) };
} // end getListFromCursor