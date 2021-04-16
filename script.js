console.log("Script Running")
let students = [];
let studentsByClass = [];
const loading = document.getElementById('loading');
const details = document.getElementById('details-content');
const detailsBox = document.getElementById('details');
let classlist = document.getElementById('classlist');
let scrollPos;
let selectedStudent;
let studentElements;

//hides the loading box once data is fetched
function hideLoading(){
    loading.style.display = 'none';
}


//parse gender
function genderShow(gender) {
    if(gender == 'M')
        return 'Male';
    else return 'Female';
}

//function to enable scrolling back to selected student
function backToStudent() {
    window.scrollTo({
        top:scrollPos,
        behavior:'smooth'
    })
}


//function to keep track of current selected student
function studentSelector(divs) {
    for(div of divs) {
        div.addEventListener("click",(e)=>{
            if(selectedStudent){
                selectedStudent.style.border = '1px solid #d7d8da';
            }
            selectedStudent = e.target;
            selectedStudent.style.border = '1px solid black';
        })
    }
}


//function to show details of a clicked student on the right panel
function showDetails(name,age,gender,sports){
    let element = `
                    Name  <span class="detail-span">${name}</span> </br>
                    Age   <span style="margin-left:50px;">${age}</span> </br>
                    Gender  <span style=margin-left:18px;">${genderShow(gender)}</span> </br>
                    Sports <span class="detail-span">${sports}</span> </br>
                   `;
    details.innerHTML = element;
    detailsBox.style.transform = 'translateX(0)'
    scrollPos = window.scrollY;
    window.scrollTo({
        top:0,
        behavior:'smooth'
    });
}

//function to close details panel
function closeDetails(){
    detailsBox.style.transform = 'translateX(500px)'
}

//function to generate elements based on processed data and Add to DOM
function createClasses(){
    var classes = '';

    studentsByClass.map((classwise)=>{
        //classwise[0] - keys (class)
        //classwise[1] - values (array of students in that class)

        var sections = '';
        //get section wise grouped data
        studentsInClass = Object.entries(groupBySection(classwise[1]));
        
        studentsInClass.map((sectionwise)=>{

            let students = '';

            sectionwise[1].map((student)=>{
                students += `<div id="student" class="divs" onclick="showDetails('${student.name}','${student.age}','${student.gender}','${student.sports}',this)">${student.name} 
                                <div id="student-tooltip">
                                <b>Name</b> : ${student.name}</br>
                                <b>Age</b> : ${student.age}</br>
                                <b>Gender</b> : ${genderShow(student.gender)}</br>
                                <b>Sports</b> : ${student.sports}</br>
                                </div>
                            </div>`;
            });

            sections += `<li style="margin-top:10px">Section ${sectionwise[0]}
                            <div id="student-container">
                                ${students}
                            </div>
                        </li>`;
        });

        classes += `<li style="margin-top:30px;"><b>CLASS ${classwise[0]}</b>
                    <ul>${sections}</ul>
                    </li>`;
    });


    classlist.innerHTML = classes;

    //enable formatting for selected student
    divs = document.getElementsByClassName('divs');
    studentSelector(divs);
    
}



//*******FUNCTIONS TO PROCESS DATA**********/


//Class-wise groups the JSON data , creates an object with key:value pairs as
//key - class
//value - array of all students in the class
function arrangeData(){
    result = students.reduce((r,a)=>{
        r[a.class] = r[a.class] || [];
        r[a.class].push(a);
        return r;
    },Object.create(null));

    return result;
}

//Sorts section-wise grouped data alphabetically by section
function sortBySection(obj){
    const ordered = Object.keys(obj).sort().reduce(
        (object, key) => { 
          object[key] = obj[key]; 
          return object;
        }, 
        {}
    );
    return ordered;
}

//Section-wise groups the data grouped Class-wise and returns a key:value pair object
//key - section
//value - array of students in that section
function groupBySection(arr){
    result = arr.reduce((r,a)=>{
        r[a.section] = r[a.section] || [];
        r[a.section].push(a);
        return r;
    },Object.create(null));
    
    //now sorting keys(sections) by alphabet
    result = sortBySection(result);
    return result;
}


const fetchData = () => {
    fetch("https://student-management-api-1u3cd4j7s.now.sh/students")
    .then((res) => res.json(res))
    .then((data) => {
        students = data;

        //logging json parsed data
        console.log(students);

        //hideloadingbutton
        hideLoading();

        //prepare data classwise for creating DOM elements
        studentsByClass = Object.entries(arrangeData());

        //prepare and add dom elements
        createClasses();
    })
}

//fetch data from api
fetchData();

