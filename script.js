"use strict";
//typewriter//
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

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("ready");
  getData();
}

const allStudents = [];
const Student = {
  firstName: null,
  lastName: null,
  middleName: null,
  nickName: null,
  image: null,
  house: null,
  gender: null,
};

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

//Clean data, from the student json file// 
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
}
//display student list// 
function displayList() {
  document.querySelector("#list tbody").innerHTML = "";
  allStudents.forEach(displayStudent);
}
/////////////

//Clone students to html template for the list//
function displayStudent(student) {
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);
  clone.querySelector("[data-field=firstname]").innerHTML = student.firstName;
  clone.querySelector("[data-field=middlename]").innerHTML = student.middleName;
  clone.querySelector("[data-field=nickname]").innerHTML = student.nickName;
  clone.querySelector("[data-field=lastname]").innerHTML = student.lastName;
  clone.querySelector("[data-field=house]").innerHTML = student.house;
  clone.querySelector("[data-field=image]").src = student.imgSrc;
  clone.querySelector("[data-field=gender]").innerHTML = student.gender;
  document.querySelector("#list tbody").appendChild(clone);
}
///////////////
