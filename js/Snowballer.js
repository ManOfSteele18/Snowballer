// BEGIN SNOWBALLER.JS
var debtListSection, addButton;

window.onload = init;

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
			buildDebtProfile();
		}
	); // end openDatabase
  
	debtListSection = document.getElementById('debtList');
  
	addButton = document.getElementById('addButton');
	addButton.setAttribute("onClick", "showAddForm()");
} // end init

function buildDebtProfile() {
	console.log('Reading from debt object store...');
	// This function is from IndexedDB.js
	// It creates a list of items from an object store using a cursor.
	// It takes an object store and a callback function to do something with the 
	// list as parameters.
	getListFromCursor('debtSources', updateDebtDisplay);
} // end buildDebtProfile

function updateDebtDisplay(debtArray) {
	console.log('Updating debt display...');
	let totalDebt = 0;
	let totalSection = document.querySelector('#totalDebt');
  
	if (debtArray.length === 0) {
		// There are no debt entries; tell user to create some
		debtListSection.innerHTML = "<p>There are no debt entries. " 
								  + "You can create them using the add button. </p>";
	} else {
		// Sort the array by the amount of each debt source; lowest first
		debtArray.sort(function(debt1, debt2){ 
			return parseFloat(debt1.amount) - parseFloat(debt2.amount); 
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
		}
	} // end else
  
	totalSection.innerHTML = "<h2>Your total debt is " + totalDebt + "</h2>";
	console.log('Debt display has been updated.');
} // end updateDebtDisplay

function showAddForm() {
	console.log('Displaying the add account form.');
	let addDiv = document.createElement('div');
	addDiv.setAttribute("class", "debtAccount");
	addDiv.innerHTML = "<form>" +
					   "  <label for='amount'>Amount</label>" +
                       "  <input type='number' step='0.01' id='amount'/>" +
                       "  <button id='addAccountButton'>Add Account</button>"
                       "</form>";
  
	//TODO: Move debtArray to global scope
	if (debtArray.length === 0) {
		debtListSection.innerHTML = '';
	}
	debtListSection.appendChild(addDiv);
}
// END SNOWBALLER.JS