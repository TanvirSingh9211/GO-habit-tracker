let userData = JSON.parse(localStorage.getItem("userData")) || [];

function saveData(){
    localStorage.setItem("userData",JSON.stringify(userData));
}

const form  = document.getElementById("userForm");

form.addEventListener('input',()=>{
    let p = document.getElementById("errormsg");
    p.textContent = "";
});
form.addEventListener('submit',(event)=>{
    event.preventDefault();
    if(validateForm()) {
    const formdata = new FormData(form);

    const data = Object.fromEntries(formdata);
    userData.push(data);
    saveData();
    form.reset();
    }

});

document.getElementById("passbtn").addEventListener('click',(event)=>{
    let btn = event.target;
    const pass = document.getElementById("password");
    if(pass.type === "password"){
        btn.textContent = "visibility";
        pass.type  = "text";
    }
    else {
        btn.textContent = "visibility_off";
        pass.type  = "password";
    }
});

document.querySelector(".pass-container").addEventListener("mouseleave",()=>{
    let btn = document.getElementById("passbtn");
    let pass = document.getElementById("password");
    btn.textContent = "visibility_off";
    pass.type = "password";
})

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

function validateName(){
    let name = document.getElementById("name");
    
    return /^[a-zA-Z]+( [a-zA-Z]+)*$/.test(name.value);
}

function validateEmail() {
    let email = document.getElementById("email");
    
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)
}

function validateAge() {
    let age = document.getElementById("age"); 
    
    return 0 < age.value && age.value<=100;
}
function validatePassword() {
    let pass = document.getElementById("password");
    
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pass.value);

}
function confirmPassword() {
    let cpass = document.getElementById("confirm");
    let pass = document.getElementById("password");
   
    return cpass.value == pass.value
}

function validateForm() {
    const p = document.getElementById("errormsg");
    if(!validateName()){
        p.innerText = "Use only alphabets and minimal spaces in the name !";
        return false;
    }
    else if(!validateAge()){
        p.innerText = "please enter a valid age !";
        return false;
    }
    else if(!validateEmail()){
        p.innerText = "please enter a valid email !";
        return false;
    }
    else if(!validatePassword()){
        p.innerText = "password must contain a capital and lowercase alphabets, numbers & special symbol and should be 8 char long !";
        return false;
    }
    else if(!confirmPassword()){
        p.innerText = "confirm password donot match !";
        return false;
    }
    else {
        return true;
        p.innerText = "";
    }
}