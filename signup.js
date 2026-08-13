let userData = JSON.parse(localStorage.getItem("userData")) || [];

function saveData(){
    localStorage.setItem("userData",JSON.stringify(userData));
}

const form  = document.getElementById("userForm");

form.addEventListener('submit',(event)=>{
    event.preventDefault();

    const formdata = new FormData(form);

    const data = Object.fromEntries(formdata);
    userData.push(data);
    saveData();
    form.reset();

});

function deleteData() {
    localStorage.clear();
}

// deleteData();

function debounce(func,delay=300){
   let timerId;
   return (...args)=>{
      clearTimeout(timerId);
      timerId = setTimeout(()=>{
         func(...args);
      },delay);
   };
}

function validateName(name){
    return /^[a-zA-Z]+( [a-zA-Z]+)*$/.test(name);
}

// function validateEmail(email) {

// }

