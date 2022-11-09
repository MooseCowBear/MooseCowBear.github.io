//some basic table operations.
//we want students to be able to rename the x, y columns. when they do, we need to populate the changes throughout

const xCol = document.getElementById("x-col"); //for changing the x column
const xErr = document.getElementById("x-err");

xCol.addEventListener("blur", updateValueXErr); //want to populate acceptable changes when they are done making the change, so add a listener for when they leave the th

function updateValueXErr(e) { 

	//updates +/- x columns header as long as the new name is 1. not used, and 2. not "none", else it returns the x col header back to "x"

	let newColName = e.target.innerHTML;

	const validName = checkName(newColName, 1); 

	if (!validName)
	{
		newColName = "x"; //if the entered name has already been used or is "none", don't want to accept
		e.target.innerHTML = newColName;
	}

	//updates the table
	xErr.innerHTML = "&plusmn; " + newColName; //want to update the buttons in the formula modal too...

	//updates the formula modal
	const xButtonFormula = document.getElementById("x-btn");
	const xErrButtonFormula = document.getElementById("x-err-btn");

	xButtonFormula.innerHTML = newColName;
	xErrButtonFormula.innerHTML = "&plusmn; " + newColName;

	//updating the dropdowns 
	document.querySelectorAll('.x-dropdown').forEach(element => {
		element.innerHTML = newColName;
	});

	document.querySelectorAll('.x-err-dropdown').forEach(element => {
		element.innerHTML = "&plusmn; " + newColName;
	});
}

const yCol = document.getElementById("y-col"); //for changing the y column
const yErr = document.getElementById("y-err");

yCol.addEventListener("blur", updateValueYErr);

function updateValueYErr(e) {

	let newColName = e.target.innerHTML;

	const validName = checkName(newColName, 2);

	if (!validName)
	{
		newColName = "y"; //if the entered name has already been used or is "none", don't want to accept
		e.target.innerHTML = newColName;
	}

	//updating the table
  	yErr.innerHTML = "&plusmn; " + newColName;

	//updating the formula modal
	const yButtonFormula = document.getElementById("y-btn");
	const yErrButtonFormula = document.getElementById("y-err-btn");
	yButtonFormula.innerHTML = newColName;
	yErrButtonFormula.innerHTML = "&plusmn; " + newColName;

	//updating the dropdowns 
	document.querySelectorAll('.y-dropdown').forEach(element => {
		element.innerHTML = newColName;
	});

	document.querySelectorAll('.y-err-dropdown').forEach(element => {
		element.innerHTML = "&plusmn; " + newColName;
	});
}


const table = document.getElementById("table"); //will reference the table a lot

//adding a row to the table
function addRow() 
{ 
	let rowCount = table.rows.length;
	let cellCount = table.rows[0].cells.length; 
	let row = table.insertRow(rowCount); //make a new row

	for(let i = 0; i < cellCount; i++)
	{
    		let cell = row.insertCell(i); //fill row with cells

		//the first 5 cells in a row are more complicated. 
		if (i === 0) //insert the checkmark, the label and the span - "input"/checkbox and "span" and children of the label, which is in turn a child of the cell
		{
			const chk = document.createElement("input");
			const lbl = document.createElement("label");
			const spn = document.createElement("span");

			chk.setAttribute("type", "checkbox");
			lbl.setAttribute("class", "container");
			spn.setAttribute("class", "checkmark"); 

			cell.appendChild(lbl);
			lbl.appendChild(chk);
			lbl.appendChild(spn); 
		}
   		else if (i > 0 && i < 5) //these are columns where we want to accept input, the surrounding div was needed for styling
   		{
			const d = document.createElement("div");
			const inp = document.createElement("input");
			d.setAttribute("class", "cell-div");
			inp.setAttribute("type", "text");
			inp.setAttribute("class", "edit-cell");

			cell.appendChild(d); //put the div in the cell
			d.appendChild(inp); //put the text input in the div
   		}
		else //for calculated cells styling
		{
			cell.setAttribute("class", "calculated-cell");
		}
	}
}

document.querySelector("#row").onclick = addRow;

//recalculating when there has been a change to the table
const selector = ".edit-cell"; //add this class to all content editable cells - when new row is added, need to add this class to indices 1 - 4 inclusive
table.addEventListener("input", function() //input or blur?
{
	const closest = event.target.closest(selector);

	if (closest !== null) //want to exclude clicking on checkbox
	{
		const val = closest.value; //NEED TO CHECK IF THE INPUT IS A TEXT INPUT!!! else get error from checkbox

  		if (closest && table.contains(closest)) 
		{
    			// handle class event
			const goodInput = checkInput(val); //is the input a number, or empty string, both are ok here

			if (goodInput) //if the input is good, take away the warning border
			{
				closest.parentNode.parentNode.style.border = 0; //input is in a div in a td, want the border to belong to td
				closest.parentNode.parentNode.style.borderCollapse = "collapse"; //in case there had been the warning border, want to remove it when the input is good
			}
			else //not a number so want to add a warning 
			{
				closest.parentNode.parentNode.style.borderCollapse = "separate";  
				closest.parentNode.parentNode.style.border = "3px solid #B51A1A"; //dark red. - change to ems
			}

			//calculate everything, some things might become "", "!", or get new values. bc of slope we can't just compute the row changed
			const numRows = table.rows.length; 

			for (let i = 5; i < table.rows[0].cells.length; i ++) //each calculated col, if any
			{
				//need to go row by row
				for (let row = 1; row < numRows; row ++)
				{
					const formula = formulaMap.get(i); 
					const computedValue = compute(formula, row, numRows);

					table.rows[row].cells[i].innerHTML = computedValue;
				}
			}
  		}
	} //end if not null
});

//references to everything we need for the formula enterer

const warning = document.getElementById("invalid-formula"); 

const delFormula = document.getElementById("del");

const clearFormula = document.getElementById("clear");

const cancelFormula = document.getElementById("cancel");

const leftParenthesis = document.getElementById("left-paren");

const rightParenthesis = document.getElementById("right-paren");

const power = document.getElementById("pow");

const seven = document.getElementById("seven");

const eight = document.getElementById("eight");

const nine = document.getElementById("nine");

const divide = document.getElementById("divide");

const four = document.getElementById("four");

const five = document.getElementById("five");

const six = document.getElementById("six");

const multiply = document.getElementById("multiply");

const one = document.getElementById("one");

const two = document.getElementById("two");

const three = document.getElementById("three");

const subtract = document.getElementById("subtract");	

const zero = document.getElementById("zero");

const point = document.getElementById("point");

const negation = document.getElementById("plusminus");

const add = document.getElementById("add");
					
const sin = document.getElementById("sin");

const cos = document.getElementById("cos");

const tan = document.getElementById("tan");

const sqRoot = document.getElementById("sqRoot");
		
const natLog = document.getElementById("natLog");

const log = document.getElementById("log");

const slope = document.getElementById("slope");

const submitBtn = document.getElementById("submit");

const e = document.getElementById("e"); 

const pi = document.getElementById("pi");

const absoluteValue = document.getElementById("abs");

const log2 = document.getElementById("log2");

let prevNum = false;

let number = "";

let ROC = 0; //to indicate what stage of rate of change we are in....

let newFormula = ""; //to display for students as they type

const infix = new Array(); //to hold the array that will get processed to postfix

const formulaMap = new Map(); //key = column index, value = postfix arr - need to store all the entered formulas

const operators = ["+", "-", "/", "*", "^"]; 
const functions = ["log10", "ln", "negate", "sqRoot", "sin", "cos", "tan", "slope", "log2", "abs"]; //keeping track of what is an operator and what is a function for making the postfix

//functions for opening and closing formula calculator modal 
const formModal = document.getElementById("formModal");
const formBtn = document.getElementById("col");
const span = document.getElementById("close"); 

formBtn.onclick = function() { //when the user clicks on the add column button, open the modal
  	formModal.style.display = "block";
}

span.onclick = function() //when the user clicks on <span> (x), reset and close the modal
{
	resetModal();
  	formModal.style.display = "none";
}

//window.onclick = function(event) //when the user clicks anywhere outside of the modal, reset and close it
//{
  	//if (event.target === formModal) 
	//{
		//resetModal();
  		//formModal.style.display = "none";
  	//}
//}

window.addEventListener('click', function(event) {
	if (event.target === formModal) 
	{
		resetModal();
  		formModal.style.display = "none";
  	}
});

function resetModal() //resetting the modal, in case it was closed with partial entries
{
	//clear out any name, and remove warning if there was one
	const nameLabel = document.getElementById("name-input-label");
	const nameForm = document.getElementById("name");

	nameLabel.innerHTML = "add a name: "; //in case it had "distinct", remove it
	nameLabel.style.color = "#481E65"; 
	nameLabel.style.fontWeight = "normal";
	nameForm.style.border = "none";

	nameForm.value = "";

	warning.style.visibility = "hidden";

	//resetting all the variables
	newFormula = ""; 
	infix.length = 0; 
	prevNum = false;
	number = "";
	ROC = 0;

	updateDisplay(); //clear for next time

	//turn on the non column buttons in case they were off
	enableNonColButtons();
}

//functions for the formula calculator
function updateDisplay(){
	const display = document.querySelector(".calculator-screen");
	display.innerHTML = newFormula;
}

function updateNumber(){ //only called when a non-digit button is pressed
	if (prevNum) //if the number finishes here, push it to the infix arr, update prevNum bool and empty number
	{
		infix.push(number); //pushing string
		prevNum = false;
		number = ""; 
	}
}

function disableNonColButtons(){
	document.querySelectorAll('button.calc-btn').forEach(elem => {
    	elem.disabled = true;
	elem.classList.remove("hov");
});
}

function enableNonColButtons(){
	document.querySelectorAll('button.calc-btn').forEach(elem => {
    	elem.disabled = false;
	elem.classList.add("hov");
});
}

function getColNameFromIndex(index)
{
	const row = table.rows[0]; //want the headers
	const col = row.cells[index]; //want header at index 
	
	return col.innerHTML;
}


delFormula.onclick = function () {
	if(number !== "") //if number is not empty....don't need to do anything with infix arr since number hasn't been added to it yet
	{
		number = number.slice(0, number.length - 1); 
		newFormula = newFormula.slice(0, newFormula.length - 1);
		updateDisplay();
	}
	else //number is the empty string
	{
		if (infix.length === 0)
		{
			return;
		}
		else if (typeof infix[infix.length -1] === "string" && infix[infix.length - 1].startsWith("col"))
		{
			const col = infix.pop(); //remove the last elem of infix arr
			let index = col.slice(3); //remove "col" from front
			index = parseInt(index); //convert from string to int

			const colName = getColNameFromIndex(index);

			newFormula = newFormula.slice(0, newFormula.length - colName.length); //chop off column name from formula string
			updateDisplay();
		}
		else if (infix[infix.length - 1] === "(") //won't affect negate, which is good. 
		{
			if (functions.includes(infix[infix.length - 2])) //
			{
				infix.pop(); 
				const endingFcn = infix.pop(); //2nd to last elem
				if (endingFcn == "sqRoot")
				{
					newFormula = newFormula.slice(0, newFormula.length - 8); //bc "&#8730;(" has 8 chars
				}
				else
				{
					newFormula = newFormula.slice(0, newFormula.length - (endingFcn.length + 1)); //+1 for the left parenthesis
				}
				updateDisplay();
			}	
			else //here is just open "("
			{
				infix.pop();
				newFormula = newFormula.slice(0, newFormula.length - 1); 
				updateDisplay();
			}
		}
		else if (infix[infix.length - 1] === ")")
		{
			if (infix[infix.length - 5] === "slope")
			{
				let curr; 
				let toSlice = 0; 
				while (curr !== "slope")
				{
					curr = infix.pop(); //as soon as we've pooped slope we're done
					if (curr.startsWith("col")) //curr is always a string
					{
						let index = col.slice(3); //remove "col" from front
						index = parseInt(index); //convert from string to int

						const colName = getColNameFromIndex(index);
						toSlice += colName.length;
					}
					else
					{
						toSlice += curr.length;
					}
				}
				newFormula = newFormula.slice(0, toSlice); 
				enableNonColButtons(); //in case they were deactivated
				updateDisplay;
			}
			else //")" all by itself
			{
				infix.pop();
				newFormula = newFormula.slice(0, newFormula.length - 1); 
				updateDisplay();
			}
		}
		else if (infix[infix.length - 1] === Math.PI)
		{
			infix.pop(); 
			newFormula = newFormula.slice(0, newFormula.length - 4); //"&pi;" has 4 chars
			updateDisplay();
		}
		else //either negate or an operator or E is at the end.... or PI? test that this is correct
		{
			infix.pop();
			newFormula = newFormula.slice(0, newFormula.length - 1); 
			updateDisplay();
		}
	}
}

clearFormula.onclick = function (){
	resetModal();
}

cancelFormula.onclick = function (){
	resetModal();
	formModal.style.display = "none";
}

leftParenthesis.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "(";
	updateDisplay();
	updateNumber();
	infix.push("(");
}

rightParenthesis.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += ")";
	updateDisplay();
	updateNumber();
	infix.push(")");
}

power.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "^";
	updateDisplay();
	updateNumber();
	infix.push("^");
}

seven.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "7";	
	updateDisplay();
	prevNum = true;
	number += "7";
}

eight.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "8";
	updateDisplay();
	prevNum = true;
	number += "8";
}

nine.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "9";
	updateDisplay();
	prevNum = true;
	number += "9";
}

divide.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "/";
	updateDisplay();
	updateNumber();
	infix.push("/");
}

four.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "4";
	updateDisplay();
	prevNum = true;
	number += "4";
}

five.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "5";
	updateDisplay();
	prevNum = true;
	number += "5";
}

six.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "6";
	updateDisplay();
	prevNum = true;
	number += "6";
}

multiply.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "*";
	updateDisplay();
	updateNumber();
	infix.push("*");
}

one.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "1";
	updateDisplay();
	prevNum = true;
	number += "1";
}

two.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "2";
	updateDisplay();
	prevNum = true;
	number += "2";
}

three.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "3";
	updateDisplay();
	prevNum = true;
	number += "3";
}

subtract.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "-";
	updateDisplay();
	updateNumber();
	infix.push("-");
}

zero.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "0";
	updateDisplay();
	prevNum = true;
	number += "0";
}

point.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += ".";
	updateDisplay();
	prevNum = true;
	number += ".";
}

negation.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += " -"; 
	updateDisplay();
	updateNumber();
	infix.push("negate");
}

add.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "+";
	updateDisplay();
	updateNumber();
	infix.push("+");
}

sin.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "sin(";
	updateDisplay();
	updateNumber();
	infix.push("sin");
	infix.push("(");
}

cos.onclick = function (){ 
	warning.style.visibility = "hidden"; 
	newFormula += "cos(";
	updateDisplay();
	updateNumber();
	infix.push("cos");
	infix.push("(");
}

tan.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "tan(";
	updateDisplay();
	updateNumber();
	infix.push("tan");
	infix.push("(");
}

sqRoot.onclick = function (){ 
	warning.style.visibility = "hidden"; 
	newFormula += "&#8730;" + "(";
	updateDisplay();
	updateNumber();
	infix.push("sqRoot");
	infix.push("(");
}

natLog.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "ln(";
	updateDisplay();
	updateNumber();
	infix.push("ln");
	infix.push("(");
}

log.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "log10(";
	updateDisplay();
	updateNumber();
	infix.push("log10");
	infix.push("(");
}

slope.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "Rate of Change( , )";  
	updateDisplay();
	updateNumber();
	infix.push("slope"); 
	infix.push("(");
	ROC = 1;

	//deactivate all non-col buttons, until the second column choice is made
	disableNonColButtons();
}

e.onclick = function (){
	warning.style.visibility = "hidden"; 
	newFormula += "e";
	updateDisplay();
	updateNumber();
	infix.push(Math.E); //pushing the value instead of string
}

pi.onclick = function (){ 
	warning.style.visibility = "hidden"; 
	newFormula += "&pi;"; 
	updateDisplay();
	updateNumber();
	infix.push(Math.PI); //pushing the value instead of string
}

absoluteValue.onclick = function () {
	warning.style.visibility = "hidden"; 
	newFormula += "abs(";
	updateDisplay();
	updateNumber();
	infix.push("abs");
	infix.push("(");
}

log2.onclick = function () {
	warning.style.visibility = "hidden"; 
	newFormula += "log2(";
	updateDisplay();
	updateNumber();
	infix.push("log2");
	infix.push("(");
}


function addColumnToFormula(columnName){ //column namne will be innerHTML of buttons, so when a button is clicked, want to hold the value of its inner html to pass to this function

	const row = table.rows[0]; //want the headers
	
	let colFound = false;
	for (let i = 0, col; col = row.cells[i]; i++) 
	{
		const header = col.innerHTML;
		if (header === columnName)
		{
			infix.push("col" + i); //whoever's header matches the innerhtml of the button pushed
			colFound = true;
		}

	}
	if (!colFound) //above loop can't find err columns 
	{
		for (let i = 0, col; col = row.cells[i]; i++) 
		{
			const header = col.innerHTML;
			if (header.includes(columnName.slice(1, columnName.length - 1))) //so, since we know we didn't get an exact match we want to look for the column name with the +/- symbol removed. 
			{
				infix.push("col" + i);
			}
		}
	}
	
	if (ROC === 1)
	{
		newFormula = newFormula.slice(0, newFormula.length - 4);
		newFormula += columnName;
		newFormula += ", )";
		ROC = 2;
	}
	else if (ROC === 2)
	{
		newFormula = newFormula.slice(0, newFormula.length - 2);
		newFormula += columnName;
		newFormula += ")";
		ROC = 0;
		infix.push(")");

		//reactivate other, non-col buttons here...
		enableNonColButtons(); 
	}
	else
	{
		newFormula += columnName; //if not in ROC, then just add the column name
	}
	updateDisplay();
}

//LISTENING FOR ANY COLUMN BUTTON CLICK in the formula enterer modal
const columns = document.getElementById("col-names");

columns.addEventListener("click", function (e) {
	if (e.target && e.target.matches(".col-btn"))
	{
		const columnName = e.target.innerHTML; 
		addColumnToFormula(columnName);
	}
});


//NOW TRANSFERRING TO POST FIX FORM AND CHECKING VALIDITY. 

//two maps used to make postfix
const precedence = new Map();
precedence.set("+", 1);
precedence.set("-", 1);
precedence.set("/", 2);
precedence.set("*", 2);
precedence.set("^", 3);

const association = new Map();
association.set("+", "left");
association.set("-", "left");
association.set("/", "left");
association.set("*", "left");
association.set("^", "right");

function isColumn(elem)
{ 
	if(elem !== "(" && elem !== ")" && !operators.includes(elem) && !functions.includes(elem)) //element is a column if it is not a number, an operator, a function or a parenthesis. 
	{
		return true;
	}
	return false;
}

function makePostfix(){ //infix and postfix are arrays
	//shunting yard algorithm with validation
	const postfix = new Array(); //values get pushed to the postfix array

	const operatorStack = new Array(); //operators get pushed to a stack, temporarily

	let expectingOperator = false; //this lets us validate the infix expression while we are making the postfix array. we can think of operators and ")" as going together, and numbers, columns, functions and "(" going together

	if (operators.includes(infix[infix.length - 1])) //if infix ended with an operator, won't be valid so go ahead and quit
	{
		return [false, postfix];
	}
	for (let i = 0; i < infix.length; i ++) //now we iterate over the infix array
	{

		if (!isNaN(infix[i])) //do we have a number? (note: isNaN() weeds out inputs like "12.3.356" see the "else" condition below)
		{
			if (expectingOperator) //if we wanted an operator and we got a number, quit
			{
				return [false, postfix];
			}
			const value = parseFloat(infix[i]); //need to convert the string number to a float
			postfix.push(value); //want to push the string converted to a float - we do this here because we want things like "123.345.24" to be NaN, which we catch as invalid below
			expectingOperator = true; //a number needs to be followed by an operator, or ")"
		}
		else //not a number
		{
			if (isColumn(infix[i])) //have already checked if the elem is a number, so now, is it a column? 
			{
				if (expectingOperator) //were we expecting an operator when we saw the column? 
				{
					return [false, postfix];
				}
				if ((operatorStack.length >= 2 && operatorStack[operatorStack.length - 2] !== "slope") || operatorStack.length < 2) //here, we need to know if we are in the middle of completing Rate of Change. 
				{
					expectingOperator = true; //if not in the process of completing slope, if in a slope sitation then we will want another column so expecting operator stays false
				}
				postfix.push(infix[i]); //columns are references to values so push to the postfix arr
			}
			else if (functions.includes(infix[i])) 
			{
				if (expectingOperator)
				{
					return [false, postfix];
				}
				operatorStack.push(infix[i]); //functions get pushed to the operator stack
				expectingOperator = false; //after a function we do not want an operator. 
			}
			else if (infix[i] === "(")
			{
				if (expectingOperator)
				{	
					return [false, postfix];
				}
				operatorStack.push(infix[i]);
				expectingOperator = false; //after "(" want function or value or another "("
			}
			else if (operators.includes(infix[i]))
			{
				if (!expectingOperator) //got an operator when we didn't want one
				{
					return [false, postfix];
				}
				while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(" && (precedence.get(operatorStack[operatorStack.length - 1]) > precedence.get(infix[i]) || functions.includes(operatorStack[operatorStack.length - 1]) || (precedence.get(operatorStack[operatorStack.length - 1]) === precedence.get(infix[i]) && association.get(infix[i]) === "left"))) 
				{
					//the rule here is a little complicated. we need to compare the operator we are pushing to the top of the stack. we want to remove elements from the stack if 1. the top element is not a "(" and 2. the top element has higher precendence than the operator we are pushing, or 3. the top element is the same precendence but the new operator has left association. (note: functions get treated as always being of higher precedence than operators)

					const op = operatorStack.pop();
					postfix.push(op);
				}
				operatorStack.push(infix[i]);
				expectingOperator = false; //don't want another operator after this one
			}
			else if (infix[i] === ")") 
			{
				if (!expectingOperator) //want to be expecting an operator when we see ")"
				{
					return [false, postfix];
				}
				while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(")
				{
					const op = operatorStack.pop();
					postfix.push(op);
				}
				if (operatorStack.length === 0) //we have a right parenthesis that has not matching left
				{
					return [false, postfix];
				}
				operatorStack.pop(); //get rid of the left parenthesis. expectingOperator is already true and we want it to stay true
				
			}
			else //here is where we catch multiple ".", or a single "." without any numerals accompanying it
			{
				return [false, postfix];
			}
		}
	}
	while (operatorStack.length > 0) //now move any remaining operators/functions from the operator stack to the postfix
	{
		const op = operatorStack.pop();
		if (op === "(") //we have a left parenthesis without a matching right
		{
			return [false, postfix];
		}
		postfix.push(op);
	}

	if (postfix.length === 0) //for the case where there is only a set of matched parentheses, e.g. "((()))", or if they only hit the submit button without entering anything
	{
		return [false, postfix];
	}
	return [true, postfix];
}

//helper functions for computing from postfix

function degreesToRadians(degrees)
{
  	const pi = Math.PI;
  	return degrees * (pi/180);
}

function convertColumn(poppedElem, rowIndex)      
{
	//the postfix array with have references to columns in the form "col" + index. need to grab the value from the table when its time to evaluate
	if (typeof poppedElem === 'string')
	{
		const val = poppedElem.slice(3, poppedElem.length); //slice off "col"
		const colIndex = parseInt(val); 
				
		const row = table.rows[rowIndex];
		const cell = row.cells[colIndex];

		let input;
		if (colIndex < 5)
		{
			input = cell.firstChild.firstChild.value; 
		}
		else
		{
			input = cell.innerHTML; 
		}
		
		if (input === "") //empty cell
		{
			return ""; //won't add anything to the cell 
		}

		else
		{
			const good = checkInput(input); 
			if (good)
			{
				return parseFloat(input); //return the float of the number in the call 
			}
			else
			{
				return "!"; //something was in the cell but it wasn't a number
			}
		}
	}
	return poppedElem; //if not a string do nothing - numbers have already been converted from strings to floats
}


function compute(postfix, rowIndex, numRows){ 

	//for computing cell values from postfix 

	const stack = new Array(); //holds values
	
	for(let i = 0; i < postfix.length; i ++)
	{
		if (!isNaN(postfix[i])) 
		{
			stack.push(postfix[i]);
		}

		else if (isColumn(postfix[i])) 
		{
			stack.push(postfix[i]); //just push the column name, sub value when popped

		}
		else if (postfix[i] === "+") 
		{
			let one = stack.pop();
			let two = stack.pop();

			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!") //one is either a number, "!" (if not a valid input to the cell) or "" (empty string if the cell is empty), 
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}
		
			two = convertColumn(two, rowIndex); 

			if (two === "" || two === "!")
			{
				return two; 
			}
			
			stack.push(one + two);
		}
		else if (postfix[i] === "-")
		{
			let one = stack.pop();
			let two = stack.pop();

			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!")
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}
		
			two = convertColumn(two, rowIndex);

			if (two === "" || two === "!")
			{
				return two; 
			}
			
			stack.push(two - one);
		}
		else if (postfix[i] === "/")
		{
			let one = stack.pop();
			let two = stack.pop();

			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!")
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}
		
			two = convertColumn(two, rowIndex);

			if (two === "" || two === "!")
			{
				return two; 
			}

			if (!isFinite(two / one)) //are we dividing by 0?
			{
				return "!"; 
			}

			stack.push(two / one);
		}
		else if (postfix[i] === "*")
		{
			let one = stack.pop();
			let two = stack.pop();

			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!")
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}
		
			two = convertColumn(two, rowIndex);

			if (two === "" || two === "!")
			{
				return two; 
			}
			stack.push(two * one);
		}
		else if (postfix[i] === "^")
		{
			let one = stack.pop();
			let two = stack.pop();

			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!")
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}
		
			two = convertColumn(two, rowIndex);

			if (two === "" || two === "!")
			{
				return two; 
			}

			stack.push(two ** one);
		}
		else if (postfix[i] === "log10") 
		{
			let one = stack.pop();
			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!")
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}

			const val = Math.log10(one);
			if (!isFinite(val)) //negative log?
			{
				return "!";
			}
			stack.push(val);
		}
		else if (postfix[i] === "ln")
		{
			let one = stack.pop();
			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!")
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}
		
			const val = Math.log(one);
			if (!isFinite(val))
			{
				return "!";
			}
			stack.push(val);
		}
		else if (postfix[i] === "log2")
		{
			let one = stack.pop();
			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!")
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}
		
			const val = Math.log2(one);
			if (!isFinite(val))
			{
				return "!";
			}
			stack.push(val);
		}
		else if (postfix[i] === "negate")
		{
			let one = stack.pop();
			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!")
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}
			stack.push(-one);
		}
		else if (postfix[i] === "abs")
		{
			let one = stack.pop();
			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!")
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}
			stack.push(Math.abs(one));
		}
		else if (postfix[i] === "sqRoot")
		{
			let one = stack.pop();
			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!")
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}
			
			if (isFinite(one**0.5)) //is one < 0? 
			{
				return "!"; 
			}
			stack.push(one**0.5);
		}
		else if (postfix[i] === "sin")
		{
			let one = stack.pop();
			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!")
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}
			stack.push(Math.sin(degreesToRadians(one)));
		}
		else if (postfix[i] === "cos")
		{
			let one = stack.pop();
			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!")
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}
			stack.push(Math.cos(degreesToRadians(one)));
		}
		else if (postfix[i] === "tan")
		{
			let one = stack.pop();
			one = convertColumn(one, rowIndex);

			if (one === "" || one === "!")
			{
				return one; //won't add anything to the cell if empty string, or "!" if "!"
			}
			stack.push(Math.tan(degreesToRadians(one)));
		}
		else //SLOPE
		{
			const X = stack.pop(); //y then x in the postfix, so x will get popped from stack first in eval
			const Y = stack.pop();
			
			if (rowIndex > 1 && rowIndex < numRows - 1) //first index of data is 1, but if in a slope situation can only compute index 2 - last index - 1
			{
				const xVal = X.slice(3, X.length); //slice off "col"
				const xColIndex = parseInt(xVal);

				const yVal = Y.slice(3, Y.length);
				const yColIndex = parseInt(yVal);

				const nPlusOne = table.rows[rowIndex + 1]; //pick out the rows we want
				const nMinusOne = table.rows[rowIndex - 1];

				const xPlus = nPlusOne.cells[xColIndex];
				const xMinus = nMinusOne.cells[xColIndex]; 

				const yPlus = nPlusOne.cells[yColIndex];
				const yMinus = nMinusOne.cells[yColIndex];

				//need to parse the value/inner html...if any empty or a bad val... quit and return appropriate string

				let xPlusVal, xMinusVal, yPlusVal, YMinusVal; 

				if (xColIndex < 5)
				{
					if (xPlus.value === "" || xMinus.value === "")
					{
						return ""; 
					}
					else
					{
						const goodPlus = checkInput(xPlus.firstChild.firstChild.value);
						const goodMinus = checkInput(xMinus.firstChild.firstChild.value);

						if (!goodPlus || !goodMinus)
						{
							return "!"; 
						}
						else
						{
							xPlusVal = parseFloat(xPlus.firstChild.firstChild.value);
							xMinusVal = parseFloat(xMinus.firstChild.firstChild.value);
						}
					}
				}

				else
				{
					if (xPlus.innerHTML === "" || xMinus.innerHTML === "")
					{
						return ""; 
					}
					else
					{
						const goodPlus = checkInput(xPlus.innerHTML);
						const goodMinus = checkInput(xMinus.innerHTML);

						if (!goodPlus || !goodMinus)
						{
							return "!"; 
						}
						else
						{
							xPlusVal = parseFloat(xPlus.innerHTML);
							xMinusVal = parseFloat(xMinus.innerHTML);
						}
					}
				}

				if (yColIndex < 5)
				{
					if (yPlus.value === "" || yMinus.value === "")
					{
						return ""; 
					}
					else
					{
						const goodPlus = checkInput(yPlus.firstChild.firstChild.value);
						const goodMinus = checkInput(yMinus.firstChild.firstChild.value);

						if (!goodPlus || !goodMinus)
						{
							return "!"; 
						}
						else
						{
							yPlusVal = parseFloat(yPlus.firstChild.firstChild.value);
							yMinusVal = parseFloat(yMinus.firstChild.firstChild.value);
						}
					}
				}
				else
				{
					if (yPlus.innerHTML === "" || yMinus.innerHTML === "")
					{
						return ""; 
					}
					else
					{
						const goodPlus = checkInput(yPlus.innerHTML);
						const goodMinus = checkInput(yMinus.innerHTML);

						if (!goodPlus || !goodMinus)
						{
							return "!"; 
						}
						else
						{
							yPlusVal = parseFloat(yPlus.innerHTML);
							yMinusVal = parseFloat(yMinus.innerHTML);
						}
					}
				}
				const val = (yPlusVal - yMinusVal)/(xPlusVal - xMinusVal);

				if (!isFinite(val)) //dividing by 0? 
				{
					return "!";
				}
				stack.push(val);
			}
			else //row is not a valid row
			{
				return ""; 
			}
		}
	}

	let lastVal = stack.pop();

	if (isColumn(lastVal)) //need this for the case where the formula = "col#", which is technically a thing that is okay to do even though there's no reason to do it
	{
		lastVal = convertColumn(lastVal, rowIndex);
	}

	return roundToSignificantDigits(lastVal, 5); //round to 5 significant digits
}

function addToFormulaMap(postfix) 
{
	//when we have a new valid, postfix formula, want to update the formula map. need to find the number of columns in the table and then add an entry --> curr#cols: curr postfix
	const currNumCols = document.getElementById('table').rows[0].cells.length; 
	formulaMap.set(currNumCols, postfix); 
}

function addFormulaColumn(newColName) 
{
	//need to add the column, and then for each cell in the column, evaluate and add value to the cell if possible

	const numRows = document.querySelector("table").rows.length; 

	const currNumCols = document.getElementById('table').rows[0].cells.length; //number of columns before adding the new one 

	//add a th for the column, its innerHTML is whatever was entered in the "add a name" box
  	for (const [i, row] of [...document.querySelectorAll("#table tr")].entries()) {
    		
    		const cell = document.createElement(i ? "td" : "th")
		
		if (cell.nodeName === "TH")
          	{
            		cell.innerHTML = newColName;
          	}
		else //if its a td
		{
			const formula = formulaMap.get(currNumCols); //grab the formula we need to evaluate. 
			const cellValue = compute(formula, i, numRows); 
			cell.innerHTML = cellValue;
			cell.classList.add("calculated-cell"); //need this to make the new column cells come in with a decent width compared to the original cells
		}
    		row.appendChild(cell); 
	}
}

submitBtn.onclick = function (){ 
	//check validity, add formula to formula map if valid, create column, fill appropriate cells

	updateNumber();

	const nameForm = document.getElementById("name"); //whatever was in the name text input field at the time of submit button was pressed
	const newColName = nameForm.value; 

	if (nameForm.value === "") //no name given - naming columns is required, so warn
	{	
		const nameLabel = document.getElementById("name-input-label");
		nameLabel.style.color = "#B51A1A"; 
		nameLabel.style.fontWeight = "bold"; //emphasizing asking for a name
		nameForm.style.border = "3px solid #B51A1A"; //dark red border
	}

	else //they added a name 
	{
		const validName = checkName(newColName, 0); //check that the name is distinct and != "none"

		if (validName)
		{
			const nameLabel = document.getElementById("name-input-label");

			//need to change the name input style back in case there had been a warning
			nameLabel.innerHTML = "add a name: "; //in case it had "distinct", remove it
			nameLabel.style.color = "#481E65"; 
			nameLabel.style.fontWeight = "normal";
			nameForm.style.border = "none";

			const [valid, postfix] = makePostfix(); //returns postfix and false if invalid, true if valid 

			if (valid) 
			{
				addToFormulaMap(postfix); //add the valid formula to the formula map for ref when evaluating 

				//need to update the table
				addFormulaColumn(newColName); //adds and evaluates whatever it can

				//update the graphing dropdowns 
				extendVariableDropdowns(newColName);

				//clear new formula string and infix arr for next time
				newFormula = "";
				infix.length = 0;
				
				//updating the formula modal
				const newColumnButton = document.createElement('button'); 
				newColumnButton.classList.add("col-btn");
				newColumnButton.innerHTML = newColName;
		
				columns.appendChild(newColumnButton); 

				nameForm.value = ""; //reset the value in the name field for next time
				updateDisplay(); //clear for next time
				formModal.style.display = "none"; //make modal hidden again
			}
			else
			{ 
				//leave open modal in this case, and warn
				warning.style.visibility = "visible"; 
				updateDisplay();
			}

		} //end if valid name

		else //name given was already taken, so highlight in red, bold, add "distinct"
		{
			const nameLabel = document.getElementById("name-input-label");
			nameLabel.innerHTML = "add a distinct name: "; 
			nameLabel.style.color = "#B51A1A"; 
			nameLabel.style.fontWeight = "bold";
			nameForm.style.border = "3px solid #B51A1A"; //dark red border
		}
	}
}

function checkName(colName, cellIndex) //cellIndex for checking changes to x, y columns
{
	const strippedColName = colName.trim().toLowerCase(); //take out any white space from front or back, make lower case
	
	if (strippedColName === "none")
	{
		return false;
	}

	let good = true;

	for (let i = 1; i < table.rows[0].cells.length; i++) //loop table heads
	{
		const cell = table.rows[0].cells[i];
		if (i !== cellIndex && cell.innerHTML === strippedColName)
		{
			good = false;
			break;
		}
	}
	return good; 
}



// js to dynamically add selections to the dependent and independent dropdowns - will run this when 1. adding a column, 2.changing a column name (above when table is updated)

function extendVariableDropdowns(colName)
{
	//adds any new columns as options in dropdowns

	const independent = document.getElementById("independent-dropdown");
	const dependent = document.getElementById("dependent-dropdown");

	const independentError = document.getElementById("independent-err-dropdown");
	const dependentError = document.getElementById("dependent-err-dropdown");

	const newIndependentOption = document.createElement("div");
	newIndependentOption.setAttribute("class", "dropdown-option");
	newIndependentOption.innerHTML = colName;
	independent.appendChild(newIndependentOption);

	const newDependentOption = document.createElement("div");
	newDependentOption.setAttribute("class", "dropdown-option");
	newDependentOption.innerHTML = colName;
	dependent.appendChild(newDependentOption);

	const newIndependentErr = document.createElement("div");
	newIndependentErr.setAttribute("class", "dropdown-option");
	newIndependentErr.innerHTML = colName;
	independentError.appendChild(newIndependentErr);

	const newDependentErr = document.createElement("div");
	newDependentErr.setAttribute("class", "dropdown-option");
	newDependentErr.innerHTML = colName;
	dependentError.appendChild(newDependentErr);

}

//getting the data from the table

function checkInput(input) //want empty string ok - needed in both listener for adding values to table and in the getting values from the table to graph, and also when computing calculated columns
{ 
	const inp = input.trim(); //take out any leading and trailing white space

	//check if the input is a valid number or the empty string
	if(isFinite(inp)){ 
  		return true;
	}
	return false;
}

function getData(independentCol, dependentCol, independentErr, dependentErr) //takes names of columns
{
	//looping the table to get data points, separating by whether the "exclude" checkbox is checked or not, called when a new fit is selected or the "refit" button is clicked. 

	//first convert names of columns to indices, so loop the table headers and see which match

	let independentColIndex, dependentColIndex; 
	let independentErrIndex = dependentErrIndex = "none";

	for (let i = 0; i < table.rows[0].cells.length; i ++)
	{
		const cellText = table.rows[0].cells[i].innerHTML; 
		if (cellText === independentCol)
		{
			independentColIndex = i;
		}
		else if (cellText === dependentCol)
		{
			dependentColIndex = i;
		}
		else if (cellText === independentErr)
		{
			independentErrIndex = i;
		}
		else if (cellText === dependentErr)
		{
			dependentErrIndex = i;
		}
	}
	
	const activeXs = new Array();
	const activeYs = new Array();

	const inactiveXs = new Array();
	const inactiveYs = new Array();

	const activeXerrs = new Array();
	const activeYerrs = new Array();

	const inactiveXerrs = new Array();
	const inactiveYerrs = new Array();

	for (let i = 1, row; row = table.rows[i]; i++) //looping each row
	{
		const firstCol = row.cells[0]; 
		const child = firstCol.getElementsByTagName("input"); //returns array
		const chk = child[0]; 
		
		if (chk.checked) //checked means exclude this point from the fit
		{
			//if checked, inactive point... grab value from independent col and dependent col
			let x, y;

			if (independentColIndex < 5)
			{
				x = row.cells[independentColIndex].firstChild.firstChild.value; //div inside cell, input inside div - for the cells that students can add values to directly, needed all the divs so it would look ok
			}
			else
			{
				x = row.cells[independentColIndex].innerHTML; //for a calculated column
			}
			if (dependentColIndex < 5)
			{
				y = row.cells[dependentColIndex].firstChild.firstChild.value; 
			}
			else
			{
				y = row.cells[dependentColIndex].innerHTML;
			}

			if (checkInput(x) && checkInput(y) && x !== "" && y !== "") //if both are numbers, and not the empty string bc checkinput doesn't exclude it
			{
				inactiveXs.push(parseFloat(x));
				inactiveYs.push(parseFloat(y));

				//need to grab the errors now, only care to check if the point is good
				if (independentErrIndex !== "none")
				{
					let xErr;

					if (independentErrIndex < 5)
					{
						xErr = row.cells[independentErrIndex].firstChild.firstChild.value;
					}
					else
					{
						xErr = row.cells[independentErrIndex].innerHTML;
					}
					if (checkInput(xErr) && xErr !== "")
					{
						inactiveXerrs.push(parseFloat(xErr));
					}
					else
					{
						inactiveXerrs.push(0);
					}
				}
				else
				{
					inactiveXerrs.push(0);
				}

				if (dependentErrIndex !== "none") //if there is y-err
				{
					let yErr;
					
					if (dependentErrIndex < 5)
					{
						yErr = row.cells[dependentErrIndex].firstChild.firstChild.value;
					}
					else
					{
						yErr = row.cells[dependentErrIndex].innerHTML;
					}
					if (checkInput(yErr) && yErr !== "") //check if its a valid input
					{
						inactiveYerrs.push(parseFloat(yErr)); //if so, add it
					}
					else
					{
						inactiveYerrs.push(0); //else add 0
					}
				}
				else
				{
					inactiveYerrs.push(0); //if no y-err selected, add 0
				}
				
			}
		}
		else
		{
			//active point
			let x, y;
			
			if (independentColIndex < 5)
			{
				x = row.cells[independentColIndex].firstChild.firstChild.value; 
			}
			else
			{
				x = row.cells[independentColIndex].innerHTML;
			}
			if (dependentColIndex < 5)
			{
				y = row.cells[dependentColIndex].firstChild.firstChild.value;
			}
			else
			{
				y = row.cells[dependentColIndex].innerHTML;
			}

			if (checkInput(x) && checkInput(y) && x !== "" && y !== "") //if both are numbers
			{
				activeXs.push(parseFloat(x));
				activeYs.push(parseFloat(y));

				//need to grab the errors now
				let xErr;

				if (independentErrIndex !== "none")
				{
					if (independentErrIndex < 5)
					{
						xErr = row.cells[independentErrIndex].firstChild.firstChild.value;
					}
					else
					{
						xErr = row.cells[independentErrIndex].innerHTML;
					}
					if (checkInput(xErr) && xErr !== "")
					{
						activeXerrs.push(parseFloat(xErr));
					}
					else
					{
						activeXerrs.push(0);
					}
				}
				else
				{
					activeXerrs.push(0);
				}

				if (dependentErrIndex !== "none") //if there is y-err
				{
					let yErr;
					
					if (dependentErrIndex < 5)
					{
						yErr = row.cells[dependentErrIndex].firstChild.firstChild.value;
					}
					else
					{
						yErr = row.cells[dependentErrIndex].innerHTML;
					}
					if (checkInput(yErr) && yErr !== "") //check if its a valid input
					{
						activeYerrs.push(parseFloat(yErr)); //if so, add it
					}
					else
					{
						activeYerrs.push(0); //else add 0
					}
				}
				else
				{
					activeYerrs.push(0); //if no y-err selected, add 0
				}
			}
		}
	}

	return {"activeX": activeXs, "activeY": activeYs, "inactiveX": inactiveXs, "inactiveY": inactiveYs, "activeXerr": activeXerrs, "activeYerr": activeYerrs, "inactiveXerr": inactiveXerrs, "inactiveYerr": inactiveYerrs}; //for graphing and fitting
}

//js for selecting a fit - when all five elements are selected, call graphing function

//first, adding a click event for fit selection buttons that will display the dropdowns when there is no hover effect (i.e. touch devices)


//try event listeners for each button....testing one...

const independentButton = document.getElementById("independent");

independentButton.onclick = function (){

	const parent = independentButton.parentNode;
	const dropdown = parent.querySelector(".dropdown-content");
	
	dropdown.classList.toggle("show");
}

const independentErrButton = document.getElementById("independent-err");

independentErrButton.onclick = function (){

	const parent = independentErrButton.parentNode;
	const dropdown = parent.querySelector(".dropdown-content");
	
	dropdown.classList.toggle("show");
}

const dependentButton = document.getElementById("dependent");

dependentButton.onclick = function (){

	const parent = dependentButton.parentNode;
	const dropdown = parent.querySelector(".dropdown-content");
	
	dropdown.classList.toggle("show");
}

const dependentErrButton = document.getElementById("dependent-err");

dependentErrButton.onclick = function (){

	const parent = dependentErrButton.parentNode;
	const dropdown = parent.querySelector(".dropdown-content");
	
	dropdown.classList.toggle("show");
}

const fitSelectorButton = document.getElementById("fit-selector");

fitSelectorButton.onclick = function (){

	const parent = fitSelectorButton.parentNode;
	const dropdown = parent.querySelector(".dropdown-content");

	dropdown.classList.toggle("show");
}

let fitSelection = null; 
let independent = null; //want these to be names
let dependent = null;

let independentErr = null;
let dependentErr = null; 

let thereIsAGraph = false; //want these all global for the dynamic redrawing of the canvas if the size of the window changes
let currData;
let regressLineXs;
let regressLineYs; 

let currXRange;
let currYRange;
let currCoefs;

const dropdownSelector = ".dropdown-option"; 

const independentDropdown = document.querySelector("#independent-dropdown");

independentDropdown.addEventListener("click", function()
{
	const closest = event.target.closest(dropdownSelector); //if this is the one we want to highlight, then can we change all other 
	independent = closest.innerHTML; 

	//want to keep the chosen node highlighted in the hover color - so remove "current" class name from the previous selection (if there was one)
	const parent = closest.parentNode; 
	for (const child of parent.children) //when there is a new selection, first remove "current" class from previous selection
	{
		if (child.classList.contains("current"))
		{
			child.classList.remove("current");
		}
	}

	//add "current" class name to the new selected option
	closest.classList.add("current"); 
	
	if (dependent !== null && fitSelection !== null && independentErr !== null && dependentErr !== null) //if all selections have been made
	{
		[thereIsAGraph, currData, regressLineXs, regressLineYs, currXRange, currYRange, currCoefs] = fitGraphReport(fitSelection, independent, dependent, independentErr, dependentErr);  
	}

	//we don't know whether the dropdown is displayed because of hover or because of a click/classlist contains show...
	if (independentDropdown.classList.contains("show"))
	{
		independentDropdown.classList.remove("show"); 
	}
});

const independentErrDropdown = document.querySelector("#independent-err-dropdown");

independentErrDropdown.addEventListener("click", function()
{
	const closest = event.target.closest(dropdownSelector);
	independentErr = closest.innerHTML; 

	//want to keep the chosen node highlighted in the hover color - so remove "current" class name from the previous selection (if there was one)
	const parent = closest.parentNode; 
	for (const child of parent.children) //when there is a new selection, first remove "current" class from previous selection
	{
		if (child.classList.contains("current"))
		{
			child.classList.remove("current");
		}
	}

	//add "current" class name to the new selected option
	closest.classList.add("current"); 

	if (dependent !== null && fitSelection !== null && independent !== null && dependentErr !== null)
	{
		[thereIsAGraph, currData, regressLineXs, regressLineYs, currXRange, currYRange, currCoefs] = fitGraphReport(fitSelection, independent, dependent, independentErr, dependentErr);
	}
	
	if (independentErrDropdown.classList.contains("show"))
	{
		independentErrDropdown.classList.remove("show"); 
	}
});


const dependentDropdown = document.querySelector("#dependent-dropdown");

dependentDropdown.addEventListener("click", function()
{ 
	const closest = event.target.closest(dropdownSelector);
	dependent = closest.innerHTML; 

	//want to keep the chosen node highlighted in the hover color - so remove "current" class name from the previous selection (if there was one)
	const parent = closest.parentNode; 
	for (const child of parent.children) //when there is a new selection, first remove "current" class from previous selection
	{
		if (child.classList.contains("current"))
		{
			child.classList.remove("current");
		}
	}

	//add "current" class name to the new selected option
	closest.classList.add("current"); 

	if (independent !== null && fitSelection !== null && independentErr !== null && dependentErr !== null)
	{
		[thereIsAGraph, currData, regressLineXs, regressLineYs, currXRange, currYRange, currCoefs] = fitGraphReport(fitSelection, independent, dependent, independentErr, dependentErr);
	}
	if (dependentDropdown.classList.contains("show"))
	{
		dependentDropdown.classList.remove("show"); 
	}
});

const dependentErrDropdown = document.querySelector("#dependent-err-dropdown");

dependentErrDropdown.addEventListener("click", function()
{
	const closest = event.target.closest(dropdownSelector);
	dependentErr = closest.innerHTML; 

	//want to keep the chosen node highlighted in the hover color - so remove "current" class name from the previous selection (if there was one)
	const parent = closest.parentNode; 
	for (const child of parent.children) //when there is a new selection, first remove "current" class from previous selection
	{
		if (child.classList.contains("current"))
		{
			child.classList.remove("current");
		}
	}

	//add "current" class name to the new selected option
	closest.classList.add("current"); 

	if (dependent !== null && fitSelection !== null && independent !== null && independentErr !== null)
	{
		[thereIsAGraph, currData, regressLineXs, regressLineYs, currXRange, currYRange, currCoefs] = fitGraphReport(fitSelection, independent, dependent, independentErr, dependentErr);
	}
	if (dependentErrDropdown.classList.contains("show"))
	{
		dependentErrDropdown.classList.remove("show"); 
	}
});

const fitDropdown = document.querySelector("#fit-dropdown");

fitDropdown.addEventListener("click", function()
{
	const closest = event.target.closest(dropdownSelector);
	fitSelection = closest.innerHTML; 
	fitSelection = fitSelection.toLowerCase();

	//want to keep the chosen node highlighted in the hover color - so remove "current" class name from the previous selection (if there was one)
	const parent = closest.parentNode; 
	for (const child of parent.children) //when there is a new selection, first remove "current" class from previous selection
	{
		if (child.classList.contains("current"))
		{
			child.classList.remove("current");
		}
	}

	//add "current" class name to the new selected option
	closest.classList.add("current"); 

	if (dependent !== null && independent !== null && independentErr !== null && dependentErr !== null)
	{
		[thereIsAGraph, currData, regressLineXs, regressLineYs, currXRange, currYRange, currCoefs] = fitGraphReport(fitSelection, independent, dependent, independentErr, dependentErr);
	}
	if (fitDropdown.classList.contains("show"))
	{
		fitDropdown.classList.remove("show"); 
	}
});


//want to clean data points by 1. removing duplicates, and 2. in the case of power law, only include positive x values. 
function cleanData(xs, ys, fit)
{
	const cleanXs = new Array();
	const cleanYs = new Array();

	const seen = new Set();

	if (fit === "power law" || fit === "square root") //power law, sq root want only non neg xs, so we will ignore the negatives
	{
		for (let i = 0; i < xs.length; i ++)
		{
			if (xs[i] >= 0)
			{
				const point = xs[i] + "," + ys[i]; //make a string to represent the tuple instead of array because two instances with same values will be treated as distinct if array
				if (!seen.has(point)) 
				{
					cleanXs.push(xs[i]);
					cleanYs.push(ys[i]);
					seen.add(point);
				}
			}
		}
	}
	else
	{
		for (let i = 0; i < xs.length; i ++)
		{
			const point = xs[i] + "," + ys[i];
			if (!seen.has(point)) 
			{
				cleanXs.push(xs[i]);
				cleanYs.push(ys[i]);
				seen.set(point);
			}
		}
	}
	return [cleanXs, cleanYs]; //removes duplicate data points
}


const superscripts = {0: 8304, 1: 185, 2: 178, 3: 179, 4: 8308, 5: 8309, 6: 8310, 7: 8311, 8: 8312, 9: 8313, "-": 8315}; //need this for the graph labels, and fit report

//get reference to the canvas
const theGraph = document.getElementById("graph");
const ctx = theGraph.getContext("2d");

//calls appropriate fitting function, graphs, reports the fit
function fitGraphReport(fitSelection, independent, dependent, independentErr, dependentErr) //call whenever new selectors or refit button is pushed
{
	const dataObject = getData(independent, dependent, independentErr, dependentErr);

	const xs = dataObject.activeX.concat(dataObject.inactiveX); //want range to include all the points
	const ys = dataObject.activeY.concat(dataObject.inactiveY);
	const xRange = getRanges(xs); 
	const yRange = getRanges(ys);

	if (fitSelection === "none")
	{
		setSize();
		graph(dataObject, [], [], independent, dependent, xRange, yRange); //nothing to report
		reportRMSE(dataObject, fitSelection, [], false); 
		reportFit(fitSelection, [], []);

		const graphDiv = document.getElementById("graph-div").style.display = "grid"; //display div, if not displayed already
		
		return [true, dataObject, [], [], xRange, yRange, []]; //will hold these in global vars for resizing graph when window size changes 
	}
	else
	{
		//get the fit 
		const [fitToReport, coefs, covar, regressXs, regressYs] = fitPoints(dataObject, fitSelection, xRange); //needs x min and x max

		//graph
		setSize();
		graph(dataObject, regressXs, regressYs, independent, dependent, xRange, yRange); //creates x min and x max

		//report
		if (fitToReport)
		{
			reportRMSE(dataObject, fitSelection, coefs, fitToReport); 
			reportFit(fitSelection, coefs, covar);
		}
		else //wasn't enough data, so warn
		{
			addNotEnoughDataWarning(fitSelection);
		}

		const graphDiv = document.getElementById("graph-div").style.display = "grid"; //display div, if not displayed already
		return [true, dataObject, regressXs, regressYs, xRange, yRange, coefs]; 
	}
}

function fitPoints(dataObject, fitSelection, xRange) //won't call this is fit == none
{
	//want to return: coefs, covar -- for report; xs and ys to graph for regression line; fitToReport boolean to denote whether there is anything to graph

	//for regression line - made this into a separate function, but haven't updated this part yet 
	const xsToGraph = new Array(); //for the regression line, the x-axis broken up into 1000 points
	const incr = (xRange.max - xRange.min)/1000; //more points than this made a more solid line but at the expense of being slow
	
	let curr = xRange.min;
	while (curr <= xRange.max)
	{
		xsToGraph.push(curr);
		curr += incr; 
	}

	if (fitSelection === "exactly proportional")
	{
		const toGraph = solveForY(xsToGraph, fitSelection, []);
		return [true, [], [], toGraph[0], toGraph[1]]; 
	}
	else
	{
		const [cleanXs, cleanYs] = cleanData(dataObject.activeX, dataObject.activeY, fitSelection);

		if (cleanXs.length < 3) //and check if there is enough data
		{
			return [false, [], [], [], []]; 
		}
		else
		{
			if (fitSelection === "exponential" || fitSelection === "power law")
			{
				//call nonlinear fitting routine
				const [coefs, covar, graph] = nonlinearFit(cleanXs, cleanYs, fitSelection);
				
				if (graph)
				{
					const toGraph = solveForY(xsToGraph, fitSelection, coefs);
					return [true, coefs, covar, toGraph[0], toGraph[1]]; 
				}
				else //not enough data points for nonlinear fit
				{
					return [false, [], [], [], []];
				}
			}
			else//linear 
			{
				const [coefs, covar] = SVDfitWithCovar(cleanXs, cleanYs, fitSelection); 
				const toGraph = solveForY(xsToGraph, fitSelection, coefs);
				
				return [true, coefs, covar, toGraph[0], toGraph[1]]; 
			}
		}
	}
}

//drawing the graph
function graph(dataObject, regressXs, regressYs, independent, dependent, xRange, yRange) // [] for regressXs, Ys means no line to graph 
{
	//regressXs, Ys are from a call to solveForY - which we do after we fit and get coefs, covar
	const border = 40;
	
	//clear the canvas - do i need this if i resize? 
	ctx.clearRect(0, 0, theGraph.width, theGraph.height);

	ctx.globalAlpha = 1.0; 

	ctx.fillStyle = '#F8EEFF'; 
	ctx.fillRect(border, border, theGraph.width - border*2, theGraph.height - border*2); 
	ctx.font = "lighter 1em Arial"; 
	ctx.fillStyle = "#2E2E2E" 
	ctx.textBaseline = 'middle';
	ctx.textAlign = "center";

	//add graph lines

	const lineAdjX = getLineAdjustment(xRange.max, xRange.min, true); //want the lines to leave room for numbers on the axes
	const lineAdjY = getLineAdjustment(yRange.max, yRange.min, false);

	drawGraphLines(xRange, yRange, theGraph.width, theGraph.height, border, true, lineAdjX, independent); //x lines
	drawGraphLines(xRange, yRange, theGraph.width, theGraph.height, border, false, lineAdjY, dependent); //y lines

	//graph inactive points, error bars
	plot(dataObject.inactiveX, dataObject.inactiveY, dataObject.inactiveXerr, dataObject.inactiveYerr, xRange, yRange, theGraph.width, theGraph.height, border, false, true, lineAdjX, lineAdjY);

	//graph active points, error bars - want these above the inactive points in case there is overlap
	plot(dataObject.activeX, dataObject.activeY, dataObject.activeXerr, dataObject.activeYerr, xRange, yRange, theGraph.width, theGraph.height, border, true, true, lineAdjX, lineAdjY);

	if (regressXs.length > 0) //if there is a regression line to graph
	{
		const dummyErrs = Array(regressXs.length).fill().map(()=> Array(regressXs.length).fill(0)); //regression line doesn't have any errors
		ctx.globalAlpha = 0.2; //want regression line to be a little transparent
		plot(regressXs, regressYs, dummyErrs, dummyErrs, xRange, yRange, theGraph.width, theGraph.height, border, false, false, lineAdjX, lineAdjY);
	}
}

function reportRMSE(dataObject, fitSelection, coefs, fitToReport) //fit report is false if fit == none or not enough data points
{
	const RMSE = document.getElementById("rmse");
	if (fitToReport)
	{
		
		let [rmse, addInf] = computeRMSE(dataObject.activeX, dataObject.activeY, fitSelection, coefs);
		
		if (addInf)
		{
			RMSE.innerHTML = "RMSE: " + rmse + " + " + "&infin;";
		}
		else
		{
			RMSE.innerHTML = "RMSE: " + rmse;
		}
	}
	else
	{
		RMSE.innerHTML = "";
	}
}

function addNotEnoughDataWarning(fitSelection) //if no regression line to add bc fit could not be performed
{
	const fitReport = document.getElementById("coefs");  //will just put this in the coefs slot
	fitReport.innerHTML = "not enough data for " + fitSelection + " fit"; 
}

function reportFit(fit, coefs, covar)
{
	const eqParagraph = document.getElementById("equation");	
	const coefParagraph = document.getElementById("coefs");

	//std error is +/- (covar for coef)^2
	//will report the fit as a formula y = etc

	if (fit === "quadratic") // coefs[0]*x^2 + coefs[1]*x + coefs[2]
	{
		const eq = "y = Ax" + String.fromCharCode(178) + " + Bx + C"; 
		
		const a = "A = " + coefs[0] + " " + "&plusmn;" + " " + Math.sqrt(covar[0][0]);
		const b = "B = " + coefs[1] + " " + "&plusmn;" + " " + Math.sqrt(covar[1][1]); 
		const c = "C = " + coefs[2] + " " + "&plusmn;" + " " + Math.sqrt(covar[2][2]);
		
		eqParagraph.innerHTML = eq;
		coefParagraph.innerHTML = a + "</br>" + b + "</br>" + c; 
	}
	else if (fit === "linear") //coefs[0]*x + coefs[1]
	{
		const eq = "y = Ax + B";
		
		const a = "A = " + coefs[0] + " " + "&plusmn;" + " " + Math.sqrt(covar[0][0]);
		const b = "B = " + coefs[1] + " " + "&plusmn;" + " " + Math.sqrt(covar[1][1]); 

		eqParagraph.innerHTML = eq;
		coefParagraph.innerHTML = a + "</br>" + b;
	}
	else if (fit === "square law") //coefs[0]*x^2
	{
		const eq = "y = Ax" + String.fromCharCode(178);

		const a = "A = " + coefs[0] + " " + "&plusmn;" + " " + Math.sqrt(covar[0][0]);

		eqParagraph.innerHTML = eq;
		coefParagraph.innerHTML = a;
	}
	else if (fit === "inverse") //coefs[0]*(1/x)
	{
		const eq = "y = A/x";
		
		const a = "A = " + coefs[0] + " " + "&plusmn;" + " " + Math.sqrt(covar[0][0]);

		eqParagraph.innerHTML = eq;
		coefParagraph.innerHTML = a;
	}
	else if (fit === "inverse square") //coefs[0]*(1/x^2)
	{
		const eq = "y = A/x" + String.fromCharCode(178);

		const a = "A = " + coefs[0] + " " + "&plusmn;" + " " + Math.sqrt(covar[0][0]);

		eqParagraph.innerHTML = eq;
		coefParagraph.innerHTML = a;
	}
	else if (fit === "proportional") //coefs[0]*x
	{
		const eq = "y = Ax";
	
		const a = "A = " + coefs[0] + " " + "&plusmn;" + " " + Math.sqrt(covar[0][0]);

		eqParagraph.innerHTML = eq;
		coefParagraph.innerHTML = a;
	}
	else if (fit === "exactly proportional")
	{
		const eq = "y = x";
		
		eqParagraph.innerHTML = eq;
	}
	else if (fit === "square root") //coefs[0]*sqroot(x)
	{
		const eq = "y = A" + "&#8730" + "x"; //test this
		
		const a = "A = " + coefs[0] + " " + "&plusmn;" + " " + Math.sqrt(covar[0][0]);

		eqParagraph.innerHTML = eq;
		coefParagraph.innerHTML = a;
	}	
	else if (fit === "exponential") //coefs[2]*e^(coefs[3]*x) + coefs[4]
	{
		
		const eq = "y = Ae" + "<sup>Bx</sup>"  + " + C"; //not sure how to make a superscript x

		const a = "A = " + coefs[2] + " " + "&plusmn;" + " " + Math.sqrt(covar[2][2]);
		const b = "B = " + coefs[3] + " " + "&plusmn;" + " " + Math.sqrt(covar[3][3]); 
		const c = "C = " + coefs[4] + " " + "&plusmn;" + " " + Math.sqrt(covar[4][4]);
		
		eqParagraph.innerHTML = eq;
		coefParagraph.innerHTML = a + "</br>" + b + "</br>" + c; 
	}
	else if (fit === "power law") //coefs[0]*x^coefs[1] - if coefs[1] is fractional, have to exclude negative x values
	{
		const eq = "y = Ax" + "<sup>B</sup>"; //supescript b

		const a = "A = " + coefs[0] + " " + "&plusmn;" + " " + Math.sqrt(covar[0][0]);
		const b = "B = " + coefs[1] + " " + "&plusmn;" + " " + Math.sqrt(covar[1][1]); 
		
		eqParagraph.innerHTML = eq;
		coefParagraph.innerHTML = a + "</br>" + b; 
	}
	else if (fit === "no relation") //no relation 
	{
		const eq = "y = A";
		const a = "A = " + coefs[0] + " " + "&plusmn;" + " " + Math.sqrt(covar[0][0]);

		eqParagraph.innerHTML = eq;
		coefParagraph.innerHTML = a;
	}
	else //none
	{
		eqParagraph.innerHTML = "";
		coefParagraph.innerHTML = "";
	}
}


// functions for the actual drawing parts

function drawLine(begin, end, stroke, width) { 

        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;

    	ctx.beginPath();
    	ctx.moveTo(...begin);
    	ctx.lineTo(...end);
    	ctx.stroke();
}

function getRanges(values)  
{
	let min = Math.min(...values); 
	let max = Math.max(...values);

	const diff = max - min;
	const sci = diff.toExponential();
	const index = sci.indexOf("e"); 
	const base = parseInt(sci.slice(0, index)); 

	const power = parseInt(sci.slice(index + 1)); //getting the power of the difference
	
	const padding = 10**power; //dont want data points to be right on the edge of the graph
	
	//rounding to the nearest "nice" number

	if (power < 0)
	{
		min = roundDecimal(min - padding, Math.abs(power));
		max = roundDecimal(max + padding, Math.abs(power));
	}
	else
	{
		min = roundInt(min - padding, power);
		max = roundInt(max + padding, power);
	}

	return {"min": min, "max": max}
}

//rounding fcns for getranges

function roundDecimal(num, places) {
    const multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
}

function roundInt(num, pow)
{
  return Math.round(num/10**pow)*10**pow;
}

function scaleValue(num, rangeObject, newMax, newMin)
{
	return ((num - rangeObject.min) * (newMax - newMin)) / (rangeObject.max - rangeObject.min) + newMin; 
}

function scalePoint(x, y, rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border) 
{
	const scaledX = scaleValue(x, rangeObjectx, canvasWidth - border, border);
	const scaledY = canvasHeight - scaleValue(y, rangeObjecty, canvasHeight - border, border); 

	return [scaledX, scaledY]; 
}

//error bars
function plotXErrorBar(xerr, x, y, rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border, color, width, crossLineWidth, crossLineLength, lineAdjustment) 
{
	if (xerr !== 0)
	{
		//err bar
		const start = scalePoint(x + xerr, y, rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border); //right side
		const end = scalePoint(x - xerr, y, rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border); //left side - check for overflow

		let truncated = false;
		if (end[0] < lineAdjustment + border)
		{
			end[0] = lineAdjustment + border; //don't want to draw into the graph labels
			truncated = true;
		}
		
		drawLine(start, end, color, width); 
		
		//now cross bars
		const rightStart = [start[0], start[1] - 0.5*crossLineLength];
		const rightEnd = [start[0], start[1] + 0.5*crossLineLength];

		drawLine(rightStart, rightEnd, color, crossLineWidth);

		if (!truncated)
		{

			const leftStart = [end[0], end[1] - 0.5*crossLineLength];  //want to start half (length of the cross bar - width of the bar) above 
			const leftEnd = [end[0], end[1] + 0.5*crossLineLength]; //want to end half (len of cross bar - width of bar) below

			drawLine(leftStart, leftEnd, color, crossLineWidth);
		}
	}
}
function plotYErrorBar(yerr, x, y, rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border, color, width, crossLineWidth, crossLineLength, lineAdjustment) 
{
	if (yerr !== 0) //add condition about lineAdjustment
	{
		const start = scalePoint(x, y + yerr, rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border); //top - dont have to worry about line adjustment
		const end = scalePoint(x, y - yerr, rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border); //bottom - need to check if y - yerr would overflow 
		
		let truncated = false;
		if (end[1] > canvasHeight - (lineAdjustment + border))
		{
			end[1] = canvasHeight - (lineAdjustment + border); //don't want to draw into the graph labels
			truncated = true;
		}

		drawLine(start, end, color, width); 
	
		const topStart = [start[0] - 0.5*crossLineLength, start[1]];
		const topEnd = [start[0] + 0.5*crossLineLength, start[1]];

		drawLine(topStart, topEnd, color, crossLineWidth);
		
		if (!truncated)
		{
			const bottomStart = [end[0] - 0.5*crossLineLength, end[1]];  
			const bottomEnd = [end[0] + 0.5*crossLineLength, end[1]];

			drawLine(bottomStart, bottomEnd, color, crossLineWidth);
		}
	}
}

function plotPoint(x, y, xerr, yerr, rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border, color, size, lineAdjustmentX, lineAdjustmentY) 
{
	if (y > rangeObjecty.min && y < rangeObjecty.max) //don't want our regression line to over run the border
	{
		let [scaledX, scaledY] = scalePoint(x, y, rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border);

		ctx.beginPath();
		ctx.arc(scaledX, scaledY, size, 0, 2 * Math.PI); //first two are x, y, 3rd is radius, 4th = start, 5th = end
		ctx.fillStyle = color;
		ctx.strokeStyle = color;; //so outline will be same color as the inside of the dot. 
		ctx.fill();
		ctx.stroke();
	
		const width = 2; //for testing of this function before making the dynamic part
		const crossLineWidth = 2;
		const crossLineLength = 6;

		plotXErrorBar(xerr, x, y, rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border, color, width, crossLineWidth, crossLineLength, lineAdjustmentX); //need to pass width, crossLineWidth, crossLineLength
		plotYErrorBar(yerr, x, y, rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border, color, width, crossLineWidth, crossLineLength, lineAdjustmentY); 
	}
}

//xerr and yerr will contain zeros if not filled
function plot(xs, ys, xerr, yerr, rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border, active, data, lineAdjustmentX, lineAdjustmentY) //data bool = tue, then plotting data points, otherwise plotting regression line 
{
	const primaryPointColor = "#481E65"; 
	const secondaryPointColor = "#9A81A5";

	let color = primaryPointColor; //default is for active, data point 
	let size = 3; 
	if (!data)
	{
		size = 1; //we will be drawing a line  
	}
	if (!active)
	{
		color = secondaryPointColor; //if the point isn't active, change it to a grayish color but still plot it
	}
	
	for (let i = 0; i < xs.length; i ++) 
	{
		plotPoint(xs[i], ys[i], xerr[i], yerr[i], rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border, color, size, lineAdjustmentX, lineAdjustmentY); 
	}
}

//functions to check whether the axis number should be placed - if it won't fit in its entirety, don't place it
function isYNumberOnCanvas(text, position, canvasHeight, border) 
{
	//assumes that text is centered
	//position indicates y value

	const metrics = ctx.measureText(text);
	const height = Math.abs(metrics.actualBoundingBoxAscent) + Math.abs(metrics.actualBoundingBoxDescent);

	if ((position + height/2) > canvasHeight - border) //if number would dip below the bottom of the canvas
	{
		return false;
	}
	else if((position - height/2) < border) //if number would go above top of the canvas
	{
		return false;
	}
	return true;
}

function isXNumberOnCanvas(text, position, canvasWidth, border)
{
	//now position is x value
	//again assumes text is centered

	const metrics = ctx.measureText(text);
	const width = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);

	if ((position - width/2) < border) //spills over left side, with 1px of padding so the number won't be right up against the edge
	{
		return false;
	}
	else if ((position + width/2) > canvasWidth - border) //spills over rightside
	{
		return false;
	}
	return true;
}

function xAdjustmentForAxisNumber(text) 
{
	//don't want the numbers to be right on the edge of the graph part of the canvas

	const metrics = ctx.measureText(text);
	const width = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight); //width of text

	return Math.ceil(width/2) + 10; //plus a bit of padding
}

function yAdjustmentForAxisNumber(text) 
{
	const metrics = ctx.measureText(text);
	const height = Math.abs(metrics.actualBoundingBoxAscent) + Math.abs(metrics.actualBoundingBoxDescent); //height of text

	return Math.ceil(height/2) + 6; //plus a bit of padding 
}

function getLabel(curr, power) 
{
	if (power !== 0)
	{
		const num = curr/10**power;
		return num 
	}
	return curr 
}

function getLineAdjustment(maxVal, minVal, power, x) 
{
	//don't want the lines to overflow the numbers, need to determine how much space the numbers need

	const ma = ctx.measureText(getLabel(minVal, power)); 
	const mi = ctx.measureText(getLabel(maxVal, power));

	let lineAdjustment;

	if (!x) 
	{
		lineAdjustment = Math.abs(ma.actualBoundingBoxAscent) + Math.abs(ma.actualBoundingBoxDescent) + 10; //want height
	}
	else //want wider width
	{
		if(Math.abs(ma.actualBoundingBoxLeft) + Math.abs(ma.actualBoundingBoxRight) > Math.abs(mi.actualBoundingBoxLeft) + Math.abs(mi.actualBoundingBoxRight))
		{
			//max is wider
			lineAdjustment = Math.ceil(Math.abs(ma.actualBoundingBoxLeft) + Math.abs(ma.actualBoundingBoxRight)) + 10;
		}
		else //min is wider
		{
			lineAdjustment = Math.ceil(Math.abs(mi.actualBoundingBoxLeft) + Math.abs(mi.actualBoundingBoxRight)) + 10; 
		}
	}
	return lineAdjustment;
}


function addPowerLabel(power, superscripts) 
{
	let powerLabel = "";
	if (power !== 0)
	{
		const powString = Math.abs(power).toString();
		const supers = new Array();
		if (power < 0)
		{
			const m = superscripts["-"];
			supers.push(m);
		}
		for (let i = 0; i < powString.length; i ++)
		{
			const char = powString[i];
			const s = superscripts[char]; //can't access with .char - no idea why
			supers.push(s); 
		}
	
		powerLabel += "   x10 " + String.fromCharCode(...supers); //extra white space for readability
	}
	return powerLabel;
}

function addLabel(label, canvasWidth, canvasHeight, power, x, superscripts) //x = true if x-axis label
{
	const powerLabel = addPowerLabel(power, superscripts);
	const fullLabel = label + powerLabel;	
	
	const txt = ctx.measureText(powerLabel);
	const labelHeight = Math.abs(txt.actualBoundingBoxAscent) + Math.abs(txt.actualBoundingBoxDescent);
	
	if (!x)
	{
		ctx.rotate(270 * Math.PI / 180);
		ctx.fillText(fullLabel, -canvasHeight/2, labelHeight);  
		ctx.rotate(-270 * Math.PI / 180); //rotate back 
	}
	else
	{
		ctx.fillText(fullLabel, canvasWidth/2, canvasHeight - labelHeight); 
	}
}

//when graph label values are very long and can't be shortened with a x10^something, as in a range from 100.000000001 - 100.000000005, we don't want to graph numbers at every line on the x-axis because they will overlap each other. so we check, how many pixels are between the lines and how many pixels do the numbers take up and then determine if we need to place every other line, every third, etc. 

function getLinesToSkip(incr, curr, rangeObjectx, canvasWidth, border)
{
	let incrPx = scaleValue(incr + rangeObjectx.min, rangeObjectx, canvasWidth - border, border); 
	incrPx -= border;

	const sampleLabel = (Math.round(curr) + incr).toString(); //round to an int and then tack on the decimal part, because curr itself might be an int or curr + incr might be an int and then we won't get the widest label

	const labelMeasured = ctx.measureText(sampleLabel);

	const labelWidth = Math.abs(labelMeasured.actualBoundingBoxLeft) + Math.abs(labelMeasured.actualBoundingBoxRight); 

	return Math.ceil(labelWidth/incrPx);
}

function drawGraphLines(rangeObjectx, rangeObjecty, canvasWidth, canvasHeight, border, x, lineAdjustment, axisLabel) //x = true means drawing vertical lines, else hoizontal 
{
	const axesColor = "white"; //originally was going to make the axes a darker color, but it looks better without  
	const otherLinesColor = "white"; 

	let min = rangeObjectx.min;
	let max = rangeObjectx.max;

	let otherMin = rangeObjecty.min;
	let otherMax = rangeObjecty.max;

	let curr = max;

	if (!x)
	{
		min = rangeObjecty.min;
		max = rangeObjecty.max;
		otherMin = rangeObjectx.min;
		otherMax = rangeObjectx.max;
	}

	let increment = (max - min)/10; //tells us how much space should go between lines - want to divide the canvas into roughly 10

	//rounding the increment
	increment = roundToSignificantDigits(increment, 1); 

	//first find where the first line will go - want any extra pixels to be on the side of the numbers, and at the same time we want to set the power by the smallest number displayed on the graph 
	while (curr > min)
	{
		curr -= increment; 
	}

	let roundTo = 0;

	if (increment < 1) //if we have a fractional increment 
	{
		const incrementSci = increment.toExponential();
		const incrementIndex = incrementSci.indexOf("e"); 
		const incrementPow = parseInt(incrementSci.slice(incrementIndex + 1)); 
		roundTo = Math.abs(incrementPow); 
	}

	if (roundTo !== 0)
	{
		curr = roundDecimal(curr, roundTo);
	}

	let everyXLines = 1; 
	if (x)
	{
		everyXLines = getLinesToSkip(increment, curr, rangeObjectx, canvasWidth, border); 
	}

	let power = 0; //start with power = 0. if draw orgin first, doesn't matter
	let firstLineNotZero = true;

	let lineCount = 0; 

	//now draw the lines 
	while (curr < max) 
	{
		if (x) //vertical lines
		{
			const currScaled = scaleValue(curr, rangeObjectx, canvasWidth - border, border); //x value of line

			if (currScaled > border + lineAdjustment + 10) //adding 10px so that lower right numbers don't crowd each other
			{

				if (curr === 0)
				{
					drawLine([currScaled, canvasHeight - (border + lineAdjustment)], [currScaled, border], axesColor, 1); 
					lineCount ++; 
				}
      
				else 
				{
					if (currScaled > lineAdjustment) //also want to not draw if beyond the numbers
					{
						if (firstLineNotZero) 
						{
							firstLineNotZero = false;

							if ((min > -1 && max < 1) || ((min < -10 || max > 10) && (max - min) > 10)) //leave the power at 0 for cases where it would look crazy to change it
							{
								const sci = increment.toExponential();
								const index = sci.indexOf("e"); 
								power = parseInt(sci.slice(index + 1)); //the smaller numbers will determine the power
							}
						}
						drawLine([currScaled, canvasHeight - (border + lineAdjustment)], [currScaled, border], otherLinesColor, 1); 
						lineCount ++; 
					}
				}
      			
				const label = getLabel(curr, power); 

      				const placeNumber = isXNumberOnCanvas(label, currScaled, canvasWidth, border); //making sure the number won't be cut off weirdly
			
				if (placeNumber)
				{
					if (lineCount % everyXLines === 0) 
					{
						const yadjustment = yAdjustmentForAxisNumber(label);
						ctx.fillText(label, currScaled, canvasHeight - (yadjustment + border));
					}
   		 		}

			} //end if currScaled > lineAdj
		}
		else //horizontal lines, y-axis lines
		{
			
			const currScaled = canvasHeight - scaleValue(curr, rangeObjecty, canvasHeight - border, border);

			if (currScaled < canvasHeight - (border + lineAdjustment))
			{
				if (curr === 0)
				{
					drawLine([border + lineAdjustment, currScaled], [canvasWidth - border, currScaled], axesColor, 1);
				}
				else 
				{
					if (currScaled < canvasHeight - lineAdjustment)
					{
						if (firstLineNotZero) 
						{
							firstLineNotZero = false;
							if ((min > -1 && max < 1) || ((min < -10 || max > 10) && (max - min) > 10)) 
							{
								const sci = increment.toExponential();
								const index = sci.indexOf("e"); 
								power = parseInt(sci.slice(index + 1)); 
							}
						}
						drawLine([border + lineAdjustment, currScaled], [canvasWidth - border, currScaled], otherLinesColor, 1);
					}
				}
			
				const label = getLabel(curr, power); 
				const placeNumber = isYNumberOnCanvas(label, currScaled, canvasHeight, border);
			
				if (placeNumber)
				{
					const xadjustment = xAdjustmentForAxisNumber(label); 
					ctx.fillText(label, border + xadjustment, currScaled); //left side, y values 
				}
			} //end if currScaled ...
		} //end else (horizontal lines)

		curr += increment;
		
		//need to round curr, if increment is fractional
		if (roundTo !== 0)
		{
			curr = roundDecimal(curr, roundTo);
		}


	} //end while loop
	
	if (x)
	{
		//before adding the axis labels, we draw white rectangles over the border areas and cover over any data points that were drawn outside the graph area due to zooming
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvasWidth, border);
		ctx.fillRect(0, canvasHeight - border, canvasWidth, border);
		ctx.fillStyle = "black";
		addLabel(axisLabel, canvasWidth, canvasHeight, power, true, superscripts);
	}
	else
	{
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, border, canvasHeight); 
		ctx.fillRect(canvasWidth - border, 0, border, canvasHeight);  
		ctx.fillStyle = "black";
		addLabel(axisLabel, canvasWidth, canvasHeight, power, false, superscripts);
	}
}

function roundToSignificantDigits(num, n)
{
  	if (num === 0)
   	{
      		return 0;
    	}
  	const d = Math.ceil(Math.log10(num < 0 ? -num: num));
  	const power = n - d;
  
   	const magnitude = Math.pow(10, power);
   	const shifted = Math.round(num*magnitude);
   	return shifted/magnitude;
}

//clearing the graph, and the fit selections

const clearGraph = document.getElementById("clear-graph");
clearGraph.onclick = function(){
	const graphDiv = document.getElementById("graph-div"); //holds both the canvas and the graph report div
	graphDiv.style.display = "none";
	thereIsAGraph = false; 

	//change all graph selector vars to null
	dependent = null;
	independent = null;
	dependentErr = null;
	independentErr = null;
	fitSelection = null;

	//need to remove highlight from dropdowns that were previously chosen
	const dropdownOptions = document.querySelectorAll(".dropdown-option");

	dropdownOptions.forEach(opt => 
	{
		if (opt.classList.contains("current"))
		{
			opt.classList.remove("current");
		}
	
	});
}

//refitting
const refit = document.getElementById("refit");

refit.onclick = function (){
	[thereIsAGraph, currData, regressLineXs, regressLineYs, currXRange, currYRange] = fitGraphReport(fitSelection, independent, dependent, independentErr, dependentErr);
}

//dynamic sizing
function setSize() 
{
	let width = window.innerWidth;
	let height = Math.ceil(width*(530/880)); 

	const maxWidth = 880;
	const maxHeight = 530;
	
	if (width > maxWidth)
	{
		width = maxWidth;
	}
	if (height > maxHeight)
	{
		height = maxHeight;
	}
	theGraph.width = width;
	theGraph.height = height;
}

function flexCanvasSize() {
	if (thereIsAGraph) 
	{
        	setSize(); //of the on screen canvas
    		graph(currData, regressLineXs, regressLineYs, independent, dependent, currXRange, currYRange); 
	}
}

window.onresize = flexCanvasSize;

//zooming in and out on graph
let numAvailableZoomIns = 0;

const zoomIn = document.getElementById("zoom-in");
const zoomOut = document.getElementById("zoom-out");

zoomIn.onclick = function()
{
	if (numAvailableZoomIns > 0) //don't want to allow infinite zooming in because the graph gets nuts
	{
		adjustRange(true, currXRange, currYRange);

		zoomGraph(currXRange);
		numAvailableZoomIns --;
	}
}

zoomOut.onclick = function()
{
	adjustRange(false, currXRange, currYRange);

	zoomGraph(currXRange);
	numAvailableZoomIns ++;
}

function adjustRange(zoomin, xRange, yRange) //zoomin bool to indicate whether the range should get smaller or bigger
{
	const xdifference = xRange.max - xRange.min;
	const ydifference = yRange.max - yRange.min;

	let newXmax, newXmin, newYmax, newYmin;

	if (zoomin)
	{
		newXmax = xRange.max - xdifference/4; 
		newXmin = xRange.min + xdifference/4;

		newYmax = yRange.max - ydifference/4;
		newYmin = yRange.min + ydifference/4;

	}
	else
	{
		newXmax = xRange.max + xdifference/2;
		newXmin = xRange.min - xdifference/2;

		newYmax = yRange.max + ydifference/2;
		newYmin = yRange.min - ydifference/2;
	}

	xRange.max = newXmax;
	xRange.min = newXmin;
	yRange.max = newYmax;
	yRange.min = newYmin;

}

function zoomGraph(xRange) 
{
	//new xs for regression line
	getRegressionLine(xRange);

	flexCanvasSize(); //use the same function to redraw the graph as we use when we change the window size
}

function getRegressionLine(xRange)
{
	const xsToGraph = new Array(); 
	const incr = (xRange.max - xRange.min)/1000; //more points than this made a more solid line (when the line was near vertical) but at the expense of being slow
	
	let curr = xRange.min;
	while (curr <= xRange.max)
	{
		xsToGraph.push(curr);
		curr += incr; 
	}
	
	const toGraph = solveForY(xsToGraph, fitSelection, currCoefs); 
	regressLineXs = toGraph[0];
	regressLineYs = toGraph[1];
}


//for clicking and dragging the canvas to a different center
let clickedOnCanvas = false;

let startx, starty, endx, endy;

const canvas = document.querySelector('canvas') 
canvas.addEventListener('mousedown', function(e) { //start drag when mouse clicks the canvas

    	[startx, starty] = getCursorPositionGeneral(e);
	clickedOnCanvas = true;
})

addEventListener('mouseup', function(e) { //want to be able to end the drag anywhere
	
	if (clickedOnCanvas)
	{
		clickedOnCanvas = false; //reset when mouse is lifted
		[endx, endy] = getCursorPositionGeneral(e); 
		
		shiftRange(currXRange, currYRange);
		getRegressionLine(currXRange); 
		flexCanvasSize(); 
	}
})

function getCursorPositionGeneral(event) 
{ 
    	const x = event.clientX;
    	const y = event.clientY;	
	return [x, y];
}

function shiftRange(xRange, yRange) 
{
	const width = theGraph.width; 
	const height = theGraph.height;

	const xdiff = xRange.max - xRange.min;
	const ydiff = yRange.max - yRange.min; 

	const xincr = roundToSignificantDigits(xdiff/10, 1); 
	const yincr = roundToSignificantDigits(ydiff/10, 1); 

	const xchange = startx - endx;
	const ychange = starty - endy;

	let xshift = xchange*(xRange.max - xRange.min)/width; 
	let yshift = ychange*(yRange.max - yRange.min)/height;

	xshift = roundToIncrementMultiple(xshift, xincr); 
	yshift = roundToIncrementMultiple(yshift, yincr);

	xRange.max = xRange.max + xshift; 
	xRange.min = xRange.max - xdiff;
	yRange.max = yRange.max + yshift; //needs to be the opposite way
	yRange.min = yRange.max - ydiff;
}

function roundToIncrementMultiple(num, incr)
{
	return Math.ceil(num/incr)*incr; //isn't quite rounding, but doesn't matter. only care that we are close to proportional to the drag and that we end on a mult of increment so that we don't end up with insane values for the graph lines.
}

//everything for the fits, calculating rmse, points for plotting the regression line
//SVD algorithm from Golub and Reinsch 1970, except that goto statements have been replaced by functions. 
function SVD(m, n, eps, tol, inputMatrix)
{
	//outputs SVD matrices U, V, q, where q is a triangular matrix represented as an array. 
	
	//first, size the output arrs appropriately... which technically you don't need to do in javascript but that's how I like it

	const u = Array(m).fill().map(()=> Array(n).fill(0.0)); 
	const v = Array(n).fill().map(()=> Array(n).fill(0.0));
	const q = Array(n).fill(0.0);

	const e = Array(n).fill(0.0);

	for (let i = 0; i < m; i ++)
	{
		for (let j = 0; j < n; j++)
		{
			u[i][j] = inputMatrix[i][j]; //here we choose to leave the input matrix untouched, it could be overwritten
		}
	}

	let l, s, f, h, y; 

	let g = x = 0;
	
	for (let i = 0; i < n; i ++)
	{
		e[i] = g;
		s = 0; 
		l = i + 1
		for (let j = i; j < m; j ++)
		{
			s += u[j][i]**2;
		}
		if (s < tol)
		{
			g = 0;
		}
		else
		{
			f = u[i][i];
			if (f < 0)
			{
				g = Math.sqrt(s);
			}
			else
			{
				 g = -Math.sqrt(s);
			}

			h = f * g - s;
			u[i][i] = f - g;

			for (let j = l; j < n; j ++)
			{
				s = 0;
				for (let k = i; k < m; k ++)
				{
					s += u[k][i] * u[k][j];
				}

				f = s / h;

				for (let k = i; k < m; k++)
				{
					u[k][j] += f * u[k][i];
				}
			}
		}
		q[i] = g;
		s = 0;

		for (let j = l; j < n; j ++)
		{
			s += u[i][j]**2;
		}
		if (s < tol)
		{
			g = 0;
		}
		else
		{
			f = u[i][i + 1];
			if (f < 0)
			{
				g = Math.sqrt(s);
			}
			else
			{
				g = -Math.sqrt(s);
			}
			h = f * g - s;
			u[i][i + 1] = f - g;

			for (let j = l; j < n; j ++)
			{
				e[j] = u[i][j] / h;
			}
			for (let j = l; j < m; j ++)
			{
				s = 0;
				for (let k = l; k < n; k ++)
				{
					s += u[j][k] * u[i][k];
				}
				for (let k = l; k < n; k ++)
				{
					u[j][k] += s * e[k];
				}
			}
		}

		y = Math.abs(q[i]) + Math.abs(e[i]);
		if (y > x)
		{
			x = y;
		}
		
	} //end for i

	//accumulation of right-hand transformations
	for (let i = n - 1; i > -1; i --)
	{
		if (g !== 0)
		{
			h = u[i][i + 1] * g;
			for (let j = l; j < n; j ++)
			{
				v[j][i] = u[i][j] / h;
			}
			for (let j = l; j < n; j++)
			{
				s = 0;
				for (let k = l; k < n; k ++)
				{
					s += u[i][k] * v[k][j];
				}
				for (let k = l; k < n; k ++)
				{
					v[k][j] += s * v[k][i];
				}
			}
		}
		for (let j = l; j < n; j ++)
		{
			v[i][j] = 0;
			v[j][i] = 0;
		}
		v[i][i] = 1;
		g = e[i];
		l = i;
	}

	//accumulation of left-hand transformations
	for (let i = n - 1; i > -1; i --)
	{
		l = i + 1;
		g = q[i];

		for (let j = l; j < n; j++)
		{
			u[i][j] = 0;
		}
		if (g !== 0)
		{
			h = u[i][i] * g;
			for (let j = l; j < n; j ++)
			{
				s = 0;
				for (let k = l; k < m; k ++)
				{
					s += u[k][i] * u[k][j];
				}
				f = s / h;
				for (let k = i; k < m; k ++)
				{
					u[k][j] += f * u[k][i];
				}
			}
			for(let j = i; j < m; j ++)
			{
				u[j][i] /= g;
			}
		}
		else
		{
			for (let j = i; j < m; j ++)
			{
				u[j][i] = 0;
			}
		}
		u[i][i] += 1;
	}

	//diagonalization of the bidiagonal form
	eps *= x;
	let z = 0;
	for (let k = n - 1; k > -1; k --)
	{
		let its = 0;
		let cont = true;
		let converged = false;

		while(cont)
		{
			[its, converged, z] = testFsplitting(k, e, u, eps, q, m, n, v, its, z);
			if (its > 30 || converged === true)
			{
				cont = false;
			}
		}
	}

	return [q, u, v]; //arr that can be unpacked with {u, v, w} = SVD(m, n, eps, tol, inputMatrix);
}

function QRtransformation(m, n, q, e, k, l, z, v, u) //plus shift from bottom 2x2 minor. only returning z, all other (non-arr) values will be overwritten
{
	let x = q[l]; 
	let y = q[k - 1];
	let g = e[k - 1];
	let h = e[k];
	let f = ((y - z) * (y + z) + (g - h) * (g + h)) / (2 * h * y);

	g = Math.sqrt(f * f + 1);
	let interm = 0;
	if (f < 0)
	{
		interm = f - g;
	}
	else
	{
		interm = f + g;
	}
	f = ((x - z) * (x + z) + h * (y/interm - h)) / x;

	let c = 1.0
	let s = 1.0;

	for (let i = l + 1; i < k + 1; i ++) //won't be here is k == l
	{
		g = e[i];
		y = q[i];
		h = s * g;
		g = c * g;
		z = Math.sqrt(f * f + h * h);
		e[i - 1] = z;
		c = f / z;
		s = h / z;
		f = x * c + g * s;
		g = -x * s + g * c;
		h = y * s;
		y *= c;
		for (let j = 0; j < n; j ++) //always want v returned
		{
			x = v[j][i - 1];
			z = v[j][i];
			v[j][i - 1] = x * c + z * s;
			v[j][i] = -x * s + z * c;
		}
		z = Math.sqrt(f * f + h * h);
		q[i - 1] = z;
		c = f / z;
		s = h / z;
		f = c * g + s * y;
		x = -s * g + c * y;
		for (let j = 0; j < m; j ++) //always want u returned
		{
			y = u[j][i - 1];
			z = u[j][i];
			u[j][i - 1] = y * c + z * s;
			u[j][i] = -y * s + z * c;
		}
	}
	e[l] = 0;
	e[k] = f;
	q[k] = x;

	return z;
}

function convergence(z, n, k, v, q) 
{
	if (z < 0)
	{
		q[k] = -z;
		for (let j = 0; j < n; j ++)
		{
			v[j][k] = -v[j][k];
		}
	}
}

function testFconvergence(k, l, q)
{
	let converged = false;
	z = q[k];
	if (l === k)
	{
		converged = true;
	}
	return [z, converged];
}

function cancellation(l, eps, e, u, q, m, k)
{
	let c = z = 0;
	let s = 1.0;
	let ll = l - 1; 
	let converged = false;

	let f, g, h, y;

	for (let i = l; i < k + 1; i ++)
	{
		f = s * e[i];
		e[i] *= c;
		if (Math.abs(f) <= eps)
		{
			[z, converged] = testFconvergence(k, l, q);
			if (converged)
			{
				return [z, converged];
			}
		}
		else
		{
			g = q[i];
			q[i] = Math.sqrt(f * f + g * g);
			h = q[i];
			c = g / h;
			s = -f / h;
			for (let j = 0; j < m; j ++)
			{
				y = u[j][ll];
				z = u[j][i];
				u[j][ll] = y * c + z * s;
				u[j][i] = -y * s + z * c;
			}
		}
	}
	[z, converged] = testFconvergence(k, l, q); 
	return [z, converged];
}

function testFsplitting(k, e, u, eps, q, m, n, v, its, z)
{
	its += 1;
	let L = 0;
	let converged = false;

	for (let l = k; l > -1; l --)
	{
		L = l;
		if (Math.abs(e[l]) <= eps)
		{
			[z, converged] = testFconvergence(k, L, q);
			if (converged)
			{
				convergence(z, n, k, v, q);
				return [its, true, z];
			}
		}
		if (Math.abs(q[l - 1]) <= eps)
		{
			if (L > 0)
			{
				[z, converged] = cancellation(L, eps, e, u, q, m, k);
				if (converged)
				{
					convergence(z, n, k, v, q);
					return [its, true, z];
				}
			}
			else
			{
				[z, converged] = testFconvergence(k, L, q);
				if (converged)
				{
					convergence(z, n, k, v, q);
					return [its, true, z];
				}
			}
		}	
	}
	if (L > 0)
	{
		[z, converged] = cancellation(L, eps, e, u, q, m, k);
		if (converged)
		{
			convergence(z, n, k, v, q);
			return [its, true, z];
		}
	}
	else
	{
		[z, converged] = testFconvergence(k, L, q);
		if (converged)
		{
			convergence(z, n, k, v, q);
			return [its, true, z];
		}
	}
	z = QRtransformation(m, n, q, e, k, L, z, v, u);
	return [its, false, z];
}

//functions to solve for Ax = b, once we have the decomp
function invertDiag(q)
{
	const qInverse =  Array(q.length).fill().map(()=> Array(q.length).fill(0.0)); 
	for (let i = 0; i < q.length; i ++)
	{
		if (q[i] !== 0)
		{
			qInverse[i][i] = 1/q[i];
		}
		else
		{
			qInverse[i][i] = 0;
		}
	}
	return qInverse;
}

function dot(v1, v2)
{
	//assumed vectors of same length, in this context we always get the right size of matrices. 
	let dotProduct = 0;
	for (let i = 0; i < v1.length; i ++)
	{
		dotProduct += v1[i] * v2[i]
	}
	return dotProduct;
}

function getMatrixCol(B, index, len)
{
	//creating an array out of a column in the matrix, bc dot takes two arrays
	const column = Array(len).fill(0.0);
	for (let i = 0; i < len; i ++)
	{
		column[i] = B[i][index];
	}
	return column;
}

function matrixMult(A, B)
{
	//again, assumes the right sizes, which we will have 
	const result = Array(A.length).fill().map(()=> Array(B[0].length).fill(0.0)); 
	for (let i = 0; i < A.length; i ++)
	{
		for(let j = 0; j < B[0].length; j ++)
		{
			const Bcol = getMatrixCol(B, j, A.length);
			dotPr = dot(A[i], Bcol);
			result[i][j] = dotPr;
		}
	}
	return result;
}

function matrixVectMult(A, v)
{
	const result = new Array();
	for (let i = 0; i < A.length; i ++)
	{
		const dotPr = dot(A[i], v);
		result.push(dotPr);
	}
	return result;
}

function transpose(A)
{
	const At = Array(A[0].length).fill().map(()=> Array(A.length).fill(0.0)); 
	for (let i = 0; i < A.length; i ++)
	{
		for (let j = 0; j < A[0].length; j ++)
		{
			At[j][i] = A[i][j];
		}
	}
	return At;
}

function getVariance(v, q, numCoefs) 
{
	//fills diagonal of the covariance matrix
	const cvm = Array(numCoefs).fill().map(()=> Array(numCoefs).fill(0.0)); 
	for (let i = 0; i < numCoefs; i ++)
	{
		let sum = 0;
		for (let j = 0; j < numCoefs; j ++)
		{
			if (q[j] !== 0)
			{
				sum += (v[i][j]/q[j])**2;
			}
		}
		cvm[i][i] = sum;
	}
	return cvm;
}

function svdCovariance(v, q, numCoefs) //fills the non-diag portion oc covariance matrix
{
	//creates covariance matrix
	const qti = Array(numCoefs).fill(0.0);

	const cvm = getVariance(v, q, numCoefs); //first get diagonal

	for (let i = 0; i < numCoefs; i ++) //now calc nondiagonals
	{
		qti[i] = 0;
		if (q[i] !== 0)
		{
			qti[i] = 1/(q[i]**2);
		}
	}
	for (let i = 0; i < numCoefs; i ++)
	{
		for (let j = 0; j < i; j ++)
		{
			let sum = 0;
			for (let k = 0; k < numCoefs; k ++)
			{
				sum += v[i][k] * v[j][k] * qti[k];
			}
			cvm[i][j] = sum;
			cvm[j][i] = sum;
		}
	}
	return cvm;
}

function getNumCoefs(fit)
{
	//tells us how many columns our starting matrix should have
	if (fit === "quadratic")
	{
		return 3;
	}
	else if (fit === "linear")
	{
		return 2;
	}
	else
	{
		return 1;
	}
}

function makeMatrix(xs, fit)
{
	const numCoefs = getNumCoefs(fit);
	const numPts = xs.length;
	const A = Array(numPts).fill().map(()=> Array(numCoefs).fill(0.0)); 
	
	for (let i = 0; i < numPts; i ++)
	{
		const afuncs = funcsLinear(xs[i], fit); 
		for (let j = 0; j < numCoefs; j ++)
		{
			A[i][j] = afuncs[j];
		}
	}
	return A;
}

function funcsLinear(xi, fit)
{
	//a modification of the funcs function as in nPlot. 
	if (fit === "quadratic")
	{
		return [xi**2, xi, 1.0];
	}
	else if (fit === "linear")
	{
		return [xi, 1.0];
	}
	else if (fit === "square law")
	{
		return [xi**2];
	}
	else if (fit === "inverse")
	{
		if (xi !== 0)
		{
			return [1/xi];
		}
		else
		{
			return [0];
		}
	}
	else if (fit === "inverse square")
	{
		if (xi !== 0)
		{
			return [1/xi**2];
		}
		else
		{
			return [0];
		}
	}
	else if (fit === "proportional")
	{
		return [xi];
	}
	else if (fit === "square root")
	{
		if (xi >= 0)
		{
			return [Math.sqrt(xi)];
		}
		else
		{
			return [0];
		}
	}
	else //no relation 
	{
		return [1.0]; 
	}
}

function SVDfitWithCovar(xs, ys, fit) 
{
	const A = makeMatrix(xs, fit);

	m = A.length; //rows
	n = A[0].length; //cols
	tol = 0.0000000000000000000000000000001 //31 0s
	eps = 0.00000001; 

	let sigma, u, v;

	[sigma, u, v] = SVD(m, n, eps, tol, A);

	const sigmaInverse = invertDiag(sigma);
	const uT = transpose(u); 

	let pseudoInverse = matrixMult(v, sigmaInverse);
	pseudoInverse = matrixMult(pseudoInverse, uT);

	const coefs = matrixVectMult(pseudoInverse, ys);
	const covar = svdCovariance(v, sigma, n); 

	return [coefs, covar];
}

//now everything for the nonlinear fits (power law and exponential)
function powerLawTrans(xs, ys)
{
	//the nonlinear fit needs a reasonable starting point, which we obtain by transforming the data and running a linear fit on the transformation

	const lxs = new Array();
	const lys = new Array();

	for (let i = 0; i < xs.length; i ++)
	{
		if (xs[i] > 0 && ys[i] > 0)
		{
			lxs.push(Math.log(xs[i]));
			lys.push(Math.log(ys[i]));
		}
	}
	return [lxs, lys];
}

function exponentialTrans(xs, ys)
{
	const lxs = new Array();
	const lys = new Array();

	for (let i = 0; i < xs.length; i ++)
	{
		if (ys[i] > 0)
		{
			lxs.push(xs[i]);
			lys.push(Math.log(ys[i]));
		}
	}
	return [lxs, lys];
}

function funcsNonlinear(xi, a) //as in nPlot
{
	const y = a[0] * (xi**a[1]) + a[2] * Math.exp(xi * a[3]) + a[4]; 
	const dyda =  Array(5).fill(0.0);
	
	dyda[0] = xi**a[1]; 
	if (xi > 0)
	{
		dyda[1] = a[0] * (xi**a[1]) * Math.log(xi);
	}
	dyda[2] = Math.exp(xi * a[3]);
	dyda[3] = a[2] * xi * Math.exp(xi * a[3]);
	dyda[4] = 1.0;

	return [y, dyda];
}

function mrqmin(xs, ys, numPts, a, totalCoef, ia, covar, alpha, beta, numFitCoef, values) //values contains lambda, chisq and ochisq
{	
	const atry = Array(totalCoef).fill(0.0); //holds temporary coef values
	const da = Array(totalCoef).fill(0.0);

	if (values.Lambda < 0) //the first round
	{
		values.Lambda = 0.001;
		values.ochisq = mrqcof(xs, ys, numPts, a, totalCoef, ia, numFitCoef, alpha, beta);
		
		for (let j = 0; j < totalCoef; j ++)
		{
			atry[j] = a[j];
		}
	}

	for (let j = 0; j < numFitCoef; j ++)
	{
		for (let k = 0; k < numFitCoef; k ++)
		{
			covar[j][k] = alpha[j][k];
		}
		covar[j][j] = alpha[j][j] * (1 + values.Lambda);
		da[j] = beta[j];
	}
	
	//gaussian elim
	gaussj(covar, numFitCoef, da); 

	if (values.Lambda === 0) //last call
	{
		//shifting covar matrix
		covsrt(covar, totalCoef, ia, numFitCoef); 
		return;
	}

	let jj = -1;
	for (let i = 0; i < totalCoef; i ++)
	{
		if (ia[i] !== 0)
		{
			jj += 1;
			atry[i] = a[i] + da[jj];
		}
	}

	values.chisq = mrqcof(xs, ys, numPts, atry, totalCoef, ia, numFitCoef, covar, da);

	if (values.chisq < values.ochisq) //did the trial succeed? if so, keep it and decrease the step
	{
		values.Lambda *= 0.1;
		values.ochisq = values.chisq;

		for (let i = 0; i < numFitCoef; i ++)
		{
			for (let j = 0; j < numFitCoef; j ++)
			{
				alpha[i][j] = covar[i][j];
			}
			beta[i] = da[i];
		}
		for (let i = 0; i < totalCoef; i ++)
		{
			a[i] = atry[i]; 
		}
	}
	else //a fail, so make the step bigger
	{
		values.Lambda *= 10;
		values.chisq = values.ochisq;
	}
}

function covsrt(a, totalCoef, ia, numFitCoef) 
{
	//sorts out the covar matrix so things are in their right place, which really need just for the exponential fit. w/o this the covar matrix is in the upper left corner of the 5x5 matrix, want it in the bottom right - alternatively we could omit this and just remember that there was a shift

	for (let i = 0; i < totalCoef; i ++)
	{
		for (let j = 0; j < i; j ++)
		{
			a[i][j] = 0;
			a[j][i] = 0;
		}
	}

	let k = numFitCoef - 1;

	for (let j = totalCoef - 1; j > -1; j --)
	{
		if (ia[j] !== 0)
		{
			for (let i = 0; i < totalCoef; i ++)
			{
				const temp = a[i][k];
				a[i][k] = a[i][j];
				a[i][j] = temp;
			}
			
			for (let i = 0; i < totalCoef; i ++)
			{
				const temp = a[k][i];
				a[k][i] = a[j][i];
				a[j][i] = temp;
			}
			k -= 1;
		}
	}
}

function gaussj(a, n, b)
{
	const ipiv = Array(n).fill(0.0);
	const indxc = Array(n).fill(0.0);
	const indxr = Array(n).fill(0.0);

	let irow = 0;
	let icol = 0;
	let big;

	for (let i = 0; i < n; i ++)
	{
		big = 0;
		
		for(let j = 0; j < n; j ++)
		{
			if (ipiv[j] !== 1)
			{
				for (let k = 0; k < n; k ++)
				{
					if (ipiv[k] === 0)
					{
						if (Math.abs(a[j][k]) >= big)
						{
							big = Math.abs(a[j][k]);
							irow = j;
							icol = k;
						}
					}
				}
			}
		}
		ipiv[icol] += 1;
		
		if (irow !== icol)
		{
			for (let j = 0; j < n; j ++)
			{
				const temp = a[irow][j];
				a[irow][j] = a[icol][j];
				a[icol][j] = temp;
			}
			const temp = b[irow];
			b[irow] = b[icol];
			b[icol] = temp;
		}
		indxr[i] = irow;
		indxc[i] = icol;

		if (a[icol][icol] === 0)
		{
			console.log("singular matrix");
			return;
		}
		const pivinv = 1/a[icol][icol];
		a[icol][icol] = 1;

		for (let j = 0; j < n; j ++)
		{
			a[icol][j] *= pivinv;
		}
		b[icol] *= pivinv;
		
		for (let j = 0; j < n; j ++)
		{
			if (j !== icol)
			{
				const temp = a[j][icol];
				a[j][icol] = 0;
				
				for (let k = 0; k < n; k ++)
				{
					a[j][k] -= a[icol][k] * temp;
				}
				b[j] -= b[icol] * temp;
			}
		}
	}

	for (let i = n - 1; i > -1; i --)
	{
		if (indxr[i] !== indxc[i])
		{
			for (let j = 0; j < n; j ++)
			{
				const temp = a[j][indxr[i]];
				a[j][indxr[i]] = a[j][indxc[i]];
				a[j][indxc[i]] = temp;
			}
		}
	}
}

function mrqcof(xs, ys, numPts, a, totalCoef, ia, numFitCoef, alpha, beta)
{
	for (let i = 0; i < numFitCoef; i ++)
	{
		for (let j = 0; j < i + 1; j ++)
		{
			alpha[i][j] = 0;
		}
		beta[i] = 0;
	}
	let chisq = 0;
	
	for (let i = 0; i < numPts; i++)
	{
		const [ymod, dyda] = funcsNonlinear(xs[i], a);
		const dy = ys[i] - ymod;
		let jj = -1; //this and kk keep the relevant parts in the upper left of the covar matrix

		for (let j = 0; j < totalCoef; j ++)
		{
			if (ia[j] !== 0)
			{
				jj += 1;
				const wt = dyda[j];
				let kk = -1;
			
				for (let k = 0; k < j + 1; k ++)
				{
					if (ia[k] !== 0)
					{
						kk += 1;
						alpha[jj][kk] += wt * dyda[k]; 
					}
				}

				beta[jj] += dy * wt
			}
		}
		chisq += dy * dy;
	}

	for (let i = 0; i < numFitCoef; i ++)
	{
		for (let j = 0; j < i; j ++)
		{
			alpha[j][i] = alpha[i][j];
		}	
	}
	return chisq;
}

function nonlinearFit(xs, ys, fit) //procedure from Numerical Recipes
{
	const covar = Array(5).fill().map(()=> Array(5).fill(0.0)); // 5x5 matrices
	const alpha = Array(5).fill().map(()=> Array(5).fill(0.0)); 

	const ia = Array(5).fill(0);
	const a = Array(5).fill(0.0);
	let lxs, lys;

	if (fit === "power law")
	{
		[lxs, lys] = powerLawTrans(xs, ys);
	}
	else //exponential
	{
		[lxs, lys] = exponentialTrans(xs, ys);
	}

	if (lxs.length < 3)
	{
		console.log("Not enough data");
		return [a, covar, false]; //false indicates nothing to graph
	}

	let [linCoefs, ] = SVDfitWithCovar(lxs, lys, "linear"); //don't care about the covar matrix that we get fom this

	const numPts = xs.length;
	const totalCoef = 5;
	let numFitCoef;

	if (fit === "power law") 
	{
		ia[0] = 1;
		ia[1] = 1;

		a[0] = Math.exp(linCoefs[1]);
		a[1] = linCoefs[0];
		numFitCoef = 2;
	}
	else //again, exponential 
	{
		ia[2] = 1;
		ia[3] = 1;
		ia[4] = 1;

		a[2] = Math.exp(linCoefs[1]);
		a[3] = linCoefs[0];
		numFitCoef = 3;
	}

	let done = false;
	const maxIts = 200;
	let its = 0;

	let beta = Array(5).fill(0.0);

	let prevChisq = 1000000;

	const values = {chisq: prevChisq, ochisq: 0, Lambda: -1} //these will be changed in the mrqmin call and we want to keep track of them

	while (!done)
	{
		its += 1; 
		
		mrqmin(xs, ys, numPts, a, totalCoef, ia, covar, alpha, beta, numFitCoef, values); //covar, alpha, beta passed by reference

		if (values.chisq < prevChisq)
		{
			const test = (prevChisq - values.chisq)/values.chisq;
			if (Math.abs(test) < 0.0001)
			{
				console.log("convergence");
				done = true;
			}
		}
		prevChisq = values.chisq; 

		if (its > maxIts)
		{
			console.log("no convergence");

			return [a, covar, true]; //no convergence but we have a fit to graph
		}
	}
	values.Lambda = 0;

	mrqmin(xs, ys, numPts, a, totalCoef, ia, covar, alpha, beta, numFitCoef, values); 

	return [a, covar, true]; 
}

//solving for y, for regression line
function solveForY(xs, fit, coefs)
{
	const xsToGraph = new Array();
	const ysToGraph = new Array();

	if (fit === "quadratic") // coefs[0]*x^2 + coefs[1]*x + coefs[2]
	{
		for (let i = 0; i < xs.length; i++)
		{
			xsToGraph.push(xs[i]);
			ysToGraph.push(coefs[0]*xs[i]**2 + coefs[1]*xs[i] + coefs[2]);
		}
	}
	else if (fit === "linear") //coefs[0]*x + coefs[1]
	{
		for (let i = 0; i < xs.length; i++)
		{
			xsToGraph.push(xs[i]);
			ysToGraph.push(coefs[0]*xs[i] + coefs[1]);
		}
	}
	else if (fit === "square law") //coefs[0]*x^2
	{
		for (let i = 0; i < xs.length; i++)
		{
			xsToGraph.push(xs[i]);
			ysToGraph.push(coefs[0]*xs[i]**2);
		}
	}
	else if (fit === "inverse") //coefs[0]*(1/x)
	{
		for (let i = 0; i < xs.length; i++)
		{
			if (xs[i] !== 0)
			{
				xsToGraph.push(xs[i]);
				ysToGraph.push(coefs[0]*(1/xs[i])); 
			}
		}
	}
	else if (fit === "inverse square") //coefs[0]*(1/x^2)
	{
		for (let i = 0; i < xs.length; i++)
		{
			if (xs[i] !== 0)
			{
				xsToGraph.push(xs[i]);
				ysToGraph.push(coefs[0]*(1/xs[i]**2)); 
			}
		}
	}
	else if (fit === "proportional") //coefs[0]*x
	{
		for (let i = 0; i < xs.length; i++)
		{
			xsToGraph.push(xs[i]);
			ysToGraph.push(coefs[0]*xs[i]);
		}
	}
	else if (fit === "square root") //coefs[0]*sqroot(x)
	{
		for (let i = 0; i < xs.length; i++)
		{
			if (xs[i] >= 0)
			{
				xsToGraph.push(xs[i]);
				ysToGraph.push(coefs[0]*Math.sqrt(xs[i]));
			}
		}
	}
	else if (fit === "exactly proportional") //y = x
	{
		for (let i = 0; i < xs.length; i++)
		{
			xsToGraph.push(xs[i]);
			ysToGraph.push(xs[i]);
		}
	}	
	else if (fit === "exponential") //coefs[2]*e^(coefs[3]*x) + coefs[4]
	{
		for (let i = 0; i < xs.length; i++)
		{
			xsToGraph.push(xs[i]);
			ysToGraph.push(coefs[2]*Math.E**(coefs[3]*xs[i]) + coefs[4]); 
		}
	}
	else if (fit === "power law") //coefs[0]*x^coefs[1] - if coefs[1] is fractional, have to exclude negative x values
	{
		//need to distinguish between points that are ok and ones that are not
		for (let i = 0; i < xs.length; i++)
		{
			if (isWhole(coefs[1])) 
			{
				if (xs[i] > 0)
				{
					xsToGraph.push(xs[i]);
					ysToGraph.push(coefs[0]*xs[i]**coefs[1]);
				}
			}
			else 
			{
				xsToGraph.push(xs[i]);
				ysToGraph.push(coefs[0]*xs[i]**coefs[1]); 
			}
		}
	}
	else //no relation 
	{
		for (let i = 0; i < xs.length; i++)
		{
			xsToGraph.push(xs[i]);
			ysToGraph.push(coefs[0]); 
		} 
	}

	return [xsToGraph, ysToGraph]; 
}

function isWhole(num) //helper function used to determine which x values are okay for power law
{
	const f = Math.floor(num);
	if (num - f > 0)
	{
		return false;
	}
	return true; 
}

function computeRMSE(xs, ys, fit, coefs) //if x is undefined for the fit, then will add + inf to the value 
{
	let sumOfErrSq = 0;
	let N = xs.length; //for keeping track of singularities

	if (fit === "quadratic") // coefs[0]*x^2 + coefs[1]*x + coefs[2]
	{
		for (let i = 0; i < xs.length; i++)
		{
			yhat = coefs[0]*xs[i]**2 + coefs[1]*xs[i] + coefs[2];
			sumOfErrSq += (ys[i] - yhat)**2;
		}
	}
	else if (fit === "linear") //coefs[0]*x + coefs[1]
	{
		for (let i = 0; i < xs.length; i++)
		{
			yhat = coefs[0]*x + coefs[1];
			sumOfErrSq += (ys[i] - yhat)**2;
		}
	}
	else if (fit === "square law") //coefs[0]*x^2
	{
		for (let i = 0; i < xs.length; i++)
		{
			yhat = coefs[0]*xs[i]**2;
			sumOfErrSq += (ys[i] - yhat)**2;
		}
	}
	else if (fit === "inverse") //coefs[0]*(1/x)
	{
		N = 0;
		for (let i = 0; i < xs.length; i++)
		{
			if (xs[i] !== 0)
			{
				N += 1;
				yhat = coefs[0]*(1/xs[i]);
				sumOfErrSq += (ys[i] - yhat)**2;
			}
		}
	}
	else if (fit === "inverse square") //coefs[0]*(1/x^2)
	{
		N = 0;
		for (let i = 0; i < xs.length; i++)
		{
			if (xs[i] !== 0)
			{
				N += 1;
				yhat = coefs[0]*(1/xs[i]**2); 
				sumOfErrSq += (ys[i] - yhat)**2;
			}
		}
	}
	else if (fit === "proportional") //coefs[0]*x
	{
		for (let i = 0; i < xs.length; i++)
		{
			yhat = coefs[0]*xs[i];
			sumOfErrSq += (ys[i] - yhat)**2;
		}
	}
	else if (fit === "square root") //coefs[0]*sqroot(x)
	{
		N = 0;
		for (let i = 0; i < xs.length; i++)
		{
			if (xs[i] >= 0)
			{
				N += 1;
				yhat = coefs[0]*Math.sqrt(xs[i]);
				sumOfErrSq += (ys[i] - yhat)**2;
			}
		}
	}
	else if (fit === "exactly proportional") //y = x
	{
		for (let i = 0; i < xs.length; i++)
		{
			yhat = xs[i];
			sumOfErrSq += (ys[i] - yhat)**2;
		}
	}	
	else if (fit === "exponential") //coefs[2]*e^(coefs[3]*x) + coefs[4]
	{
		for (let i = 0; i < xs.length; i++)
		{
			yhat = coefs[2]*Math.E**(coefs[3]*xs[i]) + coefs[4]; 
			sumOfErrSq += (ys[i] - yhat)**2;
		}
	}
	else if (fit === "power law") //coefs[0]*x^coefs[1] - if coefs[1] is fractional, have to exclude negative x values
	{
		N = 0;
		//need to distinguish between points that are ok and ones that are not
		for (let i = 0; i < xs.length; i++)
		{
			if (isWhole(coefs[1])) 
			{
				if (xs[i] > 0)
				{
					N += 1;
					yhat = coefs[0]*xs[i]**coefs[1];
					sumOfErrSq += (ys[i] - yhat)**2;
				}
			}
			else 
			{
				N += 1;
				yhat = coefs[0]*xs[i]**coefs[1]; 
				sumOfErrSq += (ys[i] - yhat)**2;
			}
		}
	}
	else //no relation 
	{
		for (let i = 0; i < xs.length; i++)
		{
			yhat = coefs[0]; 
			sumOfErrSq += (ys[i] - yhat)**2;
		} 
	}

	let addInf = false;
	if (N !== xs.length)
	{
		addInf = true;
	}

	return [Math.sqrt(sumOfErrSq/N), addInf]; //addInf tells us whether to display RMSE + inf to indicate their were undefined points
}

//refreshing the page - need to test
const clearEverything = document.getElementById("clear-everything");
clearEverything.onclick = refresh; //shared fate says this will work

function refresh() {
        window.location.reload(); 
	console.log("fitSelection", fitSelection, "infix", infix); //testing that global vars are reset
	console.log("formulaMap", formulaMap.entries()); 
}
