window.addEventListener('load', init());

function init() {
	// This function is defined in IndexedDB.js
	// so it must be included first in the html head.
	// The function was designed to be reusable so it takes name, version, and callback 
	// functions as parameters.
	openDatabase('DebtDB', 1, 
		function(evt) { // errorCallback
			// handle error
			console.log("request.onerror errcode = " + evt.target.error.name);
		}, 
		function(evt) { // upgradeCallback
			console.log('Database has been created.');
			db = evt.target.result;
			let objectStore = db.createObjectStore("debtSources", { keypath: 'debtID' });
		},
		function(evt) { // successCallback
			console.log('Database has been opened.');
			db = evt.target.result;
			console.log('Reading from debt object store...');
			// This function is from IndexedDB.js
			// It creates a list of items from an object store using a cursor.
			// It takes an object store and a callback function to do something with the 
			// list as parameters.
			getListFromCursor('debtSources', updateDebtDisplay);
		}
	); // end openDatabase
} // end init

function updateDebtDisplay(debtArray) {
	console.log('Updating debt display...');
	let totalDebt = 0;
	let debtListSection = document.querySelector('#debtList');
	let totalSection = document.querySelector('#totalDebt');
  
	if (debtArray.length === 0) {
		// There are no debt entries; tell user to create some
		debtListSection.innerHTML = "<p>There are no debt entries. " 
								  + "You can create them on the Manage Debt page. </p>";
	} else {
		// Sort the array by the amount of each debt source; lowest first
		debtArray.sort(function(debt1, debt2){ 
			return parseFloat(debt1.amount) - parseFloat(debt2.amount) 
		});
    
		for (i = 0; i < debtArray.length; i++) {
			let debtSource = debtArray[i];
      
			// Build total debt
			totalDebt += debtSource.amount;
      
			// Create divs for each debt source to display the data
			let debtDiv = document.createElement('div');
			debtDiv.innerHTML = "<h2>" + debtSource.name + "</h2>"
							  + "<h3> Amount: " + debtSource.amount + "</h3>"
							  + "<h4> Due Date: " + debtSource.dueDate + "</h4>"
							  + "<h4> Min Payment: " + debtSource.minPayment + "</h4>";
			debtListSection.appendChild(debtDiv);
		} // end for
	} // end else
  
	totalSection.innerHTML = "<h1>Your total debt is " + totalDebt + "</h1>";
	console.log('Debt display has been updated.');
} // end updateDebtDisplay