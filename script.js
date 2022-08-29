const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item')

const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

let updateOnLoad = false;
let draggedItem;
let currentColumn;
let dragging = false;

let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

function getSavedColumns(){
    if(localStorage.getItem('backlogItems')){
        backlogListArray = JSON.parse(localStorage.getItem('backlogItems'));
        progressListArray = JSON.parse(localStorage.getItem('progressItems'));
        completeListArray = JSON.parse(localStorage.getItem('completeItems'));
        onHoldListArray = JSON.parse(localStorage.getItem('onHoldItems'));
    }
    else{
        backlogListArray = ['Release the course', 'Sit back and relax'];
        progressListArray = ['Work on projects', 'Listen to Music'];
        completeListArray = ['Being cool','Getting stuff done'];
        onHoldListArray = ['Being uncool'];
    }
}

function updateSavedColumns(){
    listArrays = [backlogListArray, progressListArray,completeListArray, onHoldListArray];
    const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
    arrayNames.forEach((arrayName, index) => {
        localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
    });
}

function createItemEl(columnEl, column, item, index){
    listEl = document.createElement('li');
    listEl.classList.add('drag-item');
    listEl.textContent = item;
    listEl.draggable = true;
    listEl.setAttribute('ondragstart', 'drag(event)');
    listEl.contentEditable = true;
    listEl.id = index;
    listEl.setAttribute('onfocusout', `updateItem(${index},${column})`);
    columnEl.appendChild(listEl);
}

function filterArray(array){
    const filteredArray = array.filter(item => item !== null);
    return filteredArray;
}

function updateDOM(){
    if(!updateOnLoad){
        getSavedColumns();
    }
    backlogList.textContent = '';
    backlogListArray.forEach((backlog, index) => {
        createItemEl(backlogList, 0, backlog, index);
    });
    backlogListArray = filterArray(backlogListArray);
    progressList.textContent = '';
    progressListArray.forEach((progress, index) => {
        createItemEl(progressList, 1, progress, index);
    });
    progressListArray = filterArray(progressListArray);

    completeList.textContent = '';
    completeListArray.forEach((complete, index) => {
        createItemEl(completeList, 2, complete, index);
    });
    completeListArray = filterArray(completeListArray);

    onHoldList.textContent = '';
    onHoldListArray.forEach((onHold, index) => {
        createItemEl(onHoldList, 3, onHold, index);
    });
    onHoldListArray = filterArray(onHoldListArray);

    updateOnLoad = true;
    updateSavedColumns();
}

function updateItem(id, column){
    const selectedArray = listArrays[column];
    const selectedColumnEl = listColumns[column].children;
   if(!dragging){
    if(!selectedColumnEl[id].textContent){
        delete selectedArray[id];
    }
    else{
        selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
   }
}

function addToColumn(column){
    const itemText = addItems[column].textContent;
    const selectedArray = listArrays[column];
    selectedArray.push(itemText);
    updateDOM();
}

function showInputBox(column){
    addBtns[column].style.visibility = 'hidden';
    saveItemBtns[column].style.display = 'flex';
    addItemContainers[column].style.display = 'flex';
}

function hideInputBox(column){
    addBtns[column].style.visibility = 'visible';
    saveItemBtns[column].style.display = 'none';
    addItemContainers[column].style.display = 'none';
    addToColumn(column);
}

function rebuildArrays(){
    backlogListArray = [];
    for(let i=0; i < backlogList.children.length; i++){
        backlogListArray.push(backlogList.children[i].textContent);
    }
    progressListArray = [];
    for(let i=0; i < progressList.children.length; i++){
        progressListArray.push(progressList.children[i].textContent);
    }
    completeListArray = [];
    for(let i=0; i < completeList.children.length; i++){
        completeListArray.push(completeList.children[i].textContent);
    }
    onHoldListArray = [];
    for(let i=0; i < onHoldList.children.length; i++){
        onHoldListArray.push(onHoldList.children[i].textContent);
    }
    updateDOM();
}

function drag(e){
    draggedItem = e.target;
    dragging = true;
}
function allowDrop(event){
    event.preventDefault();
}
function dragEnter(column){
    listColumns[column].classList.add('over');
    currentColumn = column;
}
function drop(event){
    event.preventDefault();
    listColumns.forEach((column) => {
        column.classList.remove('over');
    });
    const parent = listColumns[currentColumn];
    parent.appendChild(draggedItem);
    rebuildArrays();
    dragging = false;
}

updateDOM();