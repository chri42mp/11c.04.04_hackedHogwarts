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
let bloodData;
const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
  expelled: false,
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
  getBlood();
  addEventListeners();
}

let popupStudent = null;
let expelledStudents = [];

let allStudents = [];
const Student = {
  firstname: null,
  lastname: null,
  middlename: null,
  nickname: null,
  image: null,
  house: null,
  gender: null,
  expelled: false,
  bloodstatus: "",
};
//------------------FETCH STUDENT DATA-----------------
async function getBlood() {
  const responsBlood = await fetch(
    "https://petlatkea.dk/2021/hogwarts/families.json"
  );
  bloodData = await responsBlood.json();
  getData();
}
async function getData() {
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );

  const data = await response.json();

  console.log(data);

  prepareObjects(data);
  //  console.table(allStudents);
  displayList(allStudents);
}

//-----------------CLEAN DATA FROM THE STUDENT JSON FILE---------------
function prepareObjects(data) {
  data.forEach((jsonObject) => {
    const student = Object.create(Student);
    const nameArray = jsonObject.fullname.trim().split(" ");
    let firstname, middlename, lastname, nickname;
    const nickNameIndex = nameArray.findIndex((name, index) => {
      return name.startsWith('"') && name.endsWith('"');
    });
    if (nickNameIndex !== -1) {
      nickname = nameArray[nickNameIndex].replaceAll(`"`, "");
      nickname =
        nickname.charAt(0).toUpperCase() + nickname.slice(1).toLowerCase();
      nameArray.splice(nickNameIndex, 1);
    }
    if (nameArray.length === 1) {
      firstname = nameArray[0];
      lastname = "";
    } else if (nameArray.length === 2) {
      firstname = nameArray[0];
      if (nameArray[1].includes("-")) {
        lastname = nameArray[1].split("-").slice(-1)[0];
        middlename = nameArray[1].split("-").slice(0, -1).join("-");
      } else {
        lastname = nameArray[1];
      }
    } else {
      firstname = nameArray[0];
      middlename = nameArray.slice(1, -1).join(" ");
      if (nameArray[nameArray.length - 1].includes("-")) {
        lastname = nameArray[nameArray.length - 1].split("-").slice(-1)[0];
        middlename +=
          " " +
          nameArray[nameArray.length - 1].split("-").slice(0, -1).join("-");
      } else {
        lastname = nameArray[nameArray.length - 1];
      }
    }

    console.log(nickNameIndex);

    if (lastname) {
      student.lastname =
        lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase();
    }

    student.firstname =
      firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();

    if (middlename) {
      student.middlename =
        middlename.charAt(0).toUpperCase() + middlename.slice(1).toLowerCase();
    }
    if (nickname) {
      student.nickname =
        nickname.charAt(0).toUpperCase() + nickname.slice(1).toLowerCase();
    }

    if (student.firstname === "Leanne") {
      student.imgSrc = `./images/empty.png`;
    } else if (student.lastname === "Patil") {
      student.imgSrc = `./images/${student.lastname.toLowerCase()}_${student.firstname.toLowerCase()}.png`;
    } else if (student.lastname.includes("-")) {
      student.imgSrc = `./images/${student.lastName
        .split("-")[1]
        .toLowerCase()}_${student.firstname.substring(0, 1).toLowerCase()}.png`;
    } else {
      student.imgSrc = `./images/${lastname.toLowerCase()}_${firstname
        .substring(0, 1)
        .toLowerCase()}.png`;
    }

    student.gender =
      jsonObject.gender.charAt(0).toUpperCase() +
      jsonObject.gender.slice(1).toLowerCase();

    student.house =
      jsonObject.house.trim().charAt(0).toUpperCase() +
      jsonObject.house.trim().slice(1).toLowerCase();

    student.bloodstatus = addBloodStatus(student, bloodData);

    allStudents.push(student);
  });

  console.log(allStudents);
  return allStudents;
}

//----------------------------ADD EVENTLISTENERS------------------------------
function addEventListeners() {
  document
    .querySelector("[data-action='filter']")
    .addEventListener("input", selectFilter);

  document
    .querySelectorAll("[data-action='sort']")
    .forEach((button) => button.addEventListener("click", selectSort));

  document.querySelector("#expell").addEventListener("click", expellStudent);

  document.querySelector("#expelledStudents").addEventListener("click", () => {
    settings.expelled = true;
    buildList();
  });

  document.querySelector("#activeStudents").addEventListener("click", () => {
    settings.expelled = false;
    buildList();
  });
}

//----------------------FILTER BY HOUSE-------------------------------

function selectFilter(event) {
  const filter = event.target.value;
  console.log(`Filter selected: ${filter}`);
  settings.filter = filter;
  buildList();
}

function filterList(list) {
  let filteredStudents = [];
  if (settings.filter === "gryffindor") {
    filteredStudents = list.filter((student) => student.house === "Gryffindor");
  } else if (settings.filter === "hufflepuff") {
    filteredStudents = list.filter((student) => student.house === "Hufflepuff");
  } else if (settings.filter === "ravenclaw") {
    filteredStudents = list.filter((student) => student.house === "Ravenclaw");
  } else if (settings.filter === "slytherin") {
    filteredStudents = list.filter((student) => student.house === "Slytherin");
  } else {
    filteredStudents = list;
  }
  return filteredStudents;
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

  console.log("sortBy", settings.sortBy);
  console.log("sortDir", settings.sortDir);

  buildList();
}

function sortList(list) {
  let sortedList;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = list.sort(sortByProperty);
  return sortedList;
}

function sortByProperty(studentA, studentB) {
  if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
    return -1 * direction;
  } else {
    return 1 * direction;
  }
}

//-------------------BUILD NEW LIST------------------------
function buildList() {
  let students = allStudents;
  if (settings.expelled) {
    students = expelledStudents;
  }
  const filteredList = filterList(students);
  const sortedList = sortList(filteredList);
  displayList(sortedList);
}

//--------------------DISPLAY STUDENT LIST--------------------
function displayList(list) {
  document.querySelector("#list").innerHTML = "";
  list.forEach(displayStudent);
}

//----------------CLONE STUDENTS TO THE HTML TEMPLATE FOR THE LIST-----------
function displayStudent(student) {
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);
  clone.querySelector("[data-field=firstname]").innerHTML = student.firstname;
  clone.querySelector("[data-field=lastname]").innerHTML = student.lastname;
  clone.querySelector("[data-field=house]").innerHTML = student.house;
  clone
    .querySelector("[data-field=house]")
    .classList.add(houseMap[student.house.toLowerCase()]);
  clone.querySelector("[data-field=image]").src = student.imgSrc;
  clone.querySelector("[data-field=firstname]").innerHTML = student.firstname;
  clone
    .querySelector("article")
    .addEventListener("click", () => showStudent(student));
  document.querySelector("#list").appendChild(clone);
}

function showStudent(student) {
  popupStudent = student;
  console.log("showstudent");
  const popup = document.querySelector("#popup");
  popup.style.display = "flex";
  popup.querySelector("[data-field=firstname]").textContent = student.firstname;
  popup.querySelector("[data-field=middlename]").textContent =
    student.middlename;
  popup.querySelector("[data-field=house]").textContent = student.house;
  popup
    .querySelector("[data-field=house]")
    .classList.add(houseMap[student.house.toLowerCase()]);
  popup.querySelector("[data-field=image]").src = student.imgSrc;
  popup.querySelector("[data-field=lastname]").textContent = student.lastname;
  popup.querySelector("[data-field=gender]").textContent = student.gender;
  popup.querySelector("[data-field=nickname]").textContent = student.nickName;
  popup.querySelector("[data-field=bloodstatus]").textContent =
    student.bloodstatus;
  // popup.addEventListener("click", () => (popup.style.display = "none"));
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector("#expelledRed").classList.remove("expelledRed");
    popup.style.display = "none";
  });
}

//---------------------------EXPELL-------------------------------
function expellStudent() {
  if (expelledStudents.find((student) => student === popupStudent)) {
    return;
  }
  allStudents = allStudents.filter((student) => student !== popupStudent);
  expelledStudents.push(popupStudent);
  document.querySelector("#expelledRed").classList.add("expelledRed");
  buildList();
}

//---------------HACKING---------------------
function addMeToList() {
  let thisStudent = createObjectOfMe();
  allStudents.push(thisStudent);
}

function createObjectOfMe() {
  return {
    firstname: "Christine",
    middlename: "Susanne",
    lastname: "Ramm",
    nickname: "Chrisser",
    gender: "girl",
    house: "slytherin",
    isPrefect: false,
    isInqSquad: false,
    bloodStatus: "Pureblood",
  };
}

//-----------Bloodstatus------------

function addBloodStatus(student, bloodData) {
  let bloodStatus = "muggle";

  const isPure = bloodData.pure.some((element) => student.lastname === element);
  const isHalf = bloodData.half.some((element) => student.lastname === element);

  if (isHalf) {
    bloodStatus = "half";
  } else if (isPure) {
    bloodStatus = "pure";
  }
  return bloodStatus;
}
