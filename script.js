"use strict";
//-----------------------TYPEWRITER---------------------
const str = document.querySelector("#typewriter").textContent;
document.querySelector("#typewriter").textContent = "";
let iterator = 0;
let maxNumberOfIterations;

initLoop();

function initLoop() {
  maxNumberOfIterations = str.length;
  loop();
}

function loop() {
  document.querySelector("#typewriter").textContent += str[iterator];
  iterator++;
  if (iterator < maxNumberOfIterations) {
    setTimeout(loop, 100);
  }
}
///////////////
const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
};
const houseMap = {
  slytherin: "slytherin",
  ravenclaw: "ravenclaw",
  hufflepuff: "hufflepuff",
  gryffindor: "gryffindor",
};

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("ready");
  getData();
  addEventListeners();
}

let filteredStudents = [];
let allStudents = [];
const Student = {
  firstName: null,
  lastName: null,
  middleName: null,
  nickName: null,
  image: null,
  house: null,
  gender: null,
};
//------------------FETCH STUDENT DATA-----------------
async function getData() {
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const data = await response.json();
  console.log(data);
  prepareObjects(data);
  console.table(allStudents);
  displayList();
}

//-----------------CLEAN DATA FROM THE STUDENT JSON FILE---------------
function prepareObjects(data) {
  data.forEach((jsonObject) => {
    const student = Object.create(Student);
    const nameArray = jsonObject.fullname.trim().split(" ");
    let firstName, middleName, lastName, nickName, gender;
    const nickNameIndex = nameArray.findIndex((name, index) => {
      return name.startsWith('"') && name.endsWith('"');
    });
    if (nickNameIndex !== -1) {
      nickName = nameArray[nickNameIndex].replaceAll(`"`, "");
      nickName =
        nickName.charAt(0).toUpperCase() + nickName.slice(1).toLowerCase();
      nameArray.splice(nickNameIndex, 1);
    }
    if (nameArray.length === 1) {
      firstName = nameArray[0];
      lastName = "";
    } else if (nameArray.length === 2) {
      firstName = nameArray[0];
      if (nameArray[1].includes("-")) {
        lastName = nameArray[1].split("-").slice(-1)[0];
        middleName = nameArray[1].split("-").slice(0, -1).join("-");
      } else {
        lastName = nameArray[1];
      }
    } else {
      firstName = nameArray[0];
      middleName = nameArray.slice(1, -1).join(" ");
      if (nameArray[nameArray.length - 1].includes("-")) {
        lastName = nameArray[nameArray.length - 1].split("-").slice(-1)[0];
        middleName +=
          " " +
          nameArray[nameArray.length - 1].split("-").slice(0, -1).join("-");
      } else {
        lastName = nameArray[nameArray.length - 1];
      }
    }

    console.log(nickNameIndex);

    if (lastName) {
      student.lastName =
        lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
    }

    student.firstName =
      firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

    if (middleName) {
      student.middleName =
        middleName.charAt(0).toUpperCase() + middleName.slice(1).toLowerCase();
    }
    if (nickName) {
      student.nickName =
        nickName.charAt(0).toUpperCase() + nickName.slice(1).toLowerCase();
    }

    student.imgSrc = `./images/${lastName.toLowerCase()}_${firstName
      .substring(0, 1)
      .toLowerCase()}.png`;

    student.gender =
      jsonObject.gender.charAt(0).toUpperCase() +
      jsonObject.gender.slice(1).toLowerCase();

    student.house =
      jsonObject.house.trim().charAt(0).toUpperCase() +
      jsonObject.house.trim().slice(1).toLowerCase();
    allStudents.push(student);
  });
  filteredStudents = allStudents;
}
//--------------------DISPLAY STUDENT LIST--------------------
function displayList() {
  document.querySelector("#list").innerHTML = "";
  filteredStudents.forEach(displayStudent);
}
/////////////

//----------------CLONE STUDENTS TO THE HTML TEMPLATE FOR THE LIST-----------
function displayStudent(student) {
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);
  clone.querySelector("[data-field=firstname]").innerHTML = student.firstName;
  // clone.querySelector("[data-field=middlename]").innerHTML = student.middleName;
  // clone.querySelector("[data-field=nickname]").innerHTML = student.nickName;
  clone.querySelector("[data-field=lastname]").innerHTML = student.lastName;
  clone.querySelector("[data-field=house]").innerHTML = student.house;
  clone.querySelector("[data-field=house]").innerHTML = student.house;
  clone
    .querySelector("[data-field=house]")
    .classList.add(houseMap[student.house.toLowerCase()]);
  clone.querySelector("[data-field=image]").src = student.imgSrc;
  // clone.querySelector("[data-field=gender]").innerHTML = student.gender;
  document.querySelector("#list").appendChild(clone);
}

//----------------------FILTER BY HOUSE-------------------------------

function addEventListeners() {
  document
    .querySelector("[data-action='filter']")
    .addEventListener("input", selectFilter);

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));
}

function selectFilter(event) {
  const filter = event.target.value;
  console.log(`Filter selected: ${filter}`);
  filterList(filter);
}

function filterList(filter) {
  if (filter === "gryffindor") {
    filteredStudents = allStudents.filter(
      (student) => student.house === "Gryffindor"
    );
  } else if (filter === "hufflepuff") {
    filteredStudents = allStudents.filter(
      (student) => student.house === "Hufflepuff"
    );
  } else if (filter === "ravenclaw") {
    filteredStudents = allStudents.filter(
      (student) => student.house === "Ravenclaw"
    );
  } else if (filter === "slytherin") {
    filteredStudents = allStudents.filter(
      (student) => student.house === "Slytherin"
    );
  } else {
    filteredStudents = allStudents;
  }
  displayList();
}

//--------------------SORTING--------------------

let direction = 1;

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  const oldElement = document.querySelector(`[data-sort=${settings.sortBy}]`);
  if (oldElement !== null) {
    oldElement.classList.remove("sortby");
  }
  event.target.classList.add("sortby");
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortByProperty);
  return sortedList;
}

function sortByProperty(studentA, studentB) {
  if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
    return -1 * direction;
  } else {
    return 1 * direction;
  }
}
function buildList() {
  const sortedList = sortList(allStudents);
  const filteredList = filterList(sortedList);
  displayList(filteredList);
}
