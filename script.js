//Logic of my web app
import dayjs from "dayjs";
let habits = JSON.parse(localStorage.getItem("habits")) || [];

//Everyday Reset
habits.forEach((habit)=>{   
   let diff = dayjs().diff(dayjs(habit.lastDone),"days");
   if(diff>=1){
      habit.completed = false;
      if(diff>=2){
         habit.currStreak = 0;
      }
   }
   savelocal();
})


//Event listners
document.getElementById("form").addEventListener("keydown",(event)=>{
      if(event.key==='Enter'){
         event.preventDefault();
         let input = event.target;
         if(input.classList.contains('valid')){
            addHabits(input.value);
            input.classList.remove('valid');
            input.value ="";
         }
      }
   }
);
document.getElementById("addbtn").addEventListener("click",()=>{
      let input = document.getElementById("form");
      if(input.classList.contains("valid")){
         addHabits(input.value);
         input.classList.remove('valid');
         input.value = "";
    }
   }
);;



function debounce(func,delay=300){
   let timerId;
   return (...args)=>{
      clearTimeout(timerId);
      timerId = setTimeout(()=>{
         func(...args);
      },delay);
   };
}

let debouncedValidate = debounce(validate,300);

document.getElementById("form").addEventListener('input',(event)=>{
   debouncedValidate(event,document.getElementById("errormsg"))
});  //need of an arrow function here

function validate(event,ele) {
   let input = event.target;
   let name = nameFormat(input.value,true);
   let msg = ele;
   
   msg.innerText="";
   input.classList.remove('valid');
   input.classList.remove('invalid');

   if(name.length===0) return;
   if(name.length<3){
      msg.innerText = "name length should be atleast 3 character long !";
      input.classList.add('invalid');
   }
   else if(!isAlpha(name)){
      msg.innerText = "Not valid! use only alphabets and minimal spaces.";
      input.classList.add('invalid');
   }
   else if(!ifDuplicate(name)){
      msg.innerText = "This habit already exists !!"
      input.classList.add('invalid');
   }
   else{
      msg.innerText = ""
      input.classList.add('valid');
   }

}

function ifDuplicate(hab){

   for(let i=0;i<habits.length;i++){
      if(habits[i].name === hab){
         return false;
      }
   }
   return true;
}

function fillPB(){
   let fill = document.getElementById('innerPB');
   if(habits.length===0){
      fill.style.width = 0+ '%';
   }
   let per = 0.0;
   let count = 0;

   for(let i=0;i<habits.length;i++){
      if(habits[i].completed===true){
         count++;
      }
   }
   per = (count/habits.length)*100;
   fill.style.width = per + '%';
}


function addHabits(hab){
   hab = nameFormat(hab,true);

      habits.push({
         name : hab,
         lastDone : undefined,      //omitted null as can cause crashes in dayjs
         currStreak : 0 ,
         completed : false,
         createdAt : dayjs().format("YYYY-MM-DD"),
         bestStreak : 0 
   });
      savelocal();
      renderHabits();
}

function deleteHabit(habit){
   habits = habits.filter((hab)=>{ return hab.name!==habit.name }); // or habits = habits.filter((hab)=> hab.name!==habit.name )  (without return)
   savelocal();

}

 async function editHabits(habit){
   let newname = await popEditname();
   if(newname){
      habit.name  = newname;
      savelocal();
   }
  
}
function popEditname(){
   let box = document.createElement('dialog');
   let save = document.createElement('button');
   let cancel = document.createElement('button');
   let panel = document.createElement('div');
   let p = document.createElement('p');
   let msg = document.createElement('p');
   let input = document.createElement('input');

   input.setAttribute('type','text');

   input.classList.add('form');
   box.classList.add('pop-box');
   save.classList.add('btn');
   cancel.classList.add('btn');

   msg.classList.add('error-msg');

   p.innerText = "Enter new name :";
   save.innerText = "save";
   cancel.innerText = "cancel";

   panel.append(save,cancel);
   box.append(p,msg,input,panel);
   document.body.append(box);

   box.showModal();

   
      return new Promise((resolve)=>{
         const controller = new AbortController();

         const helper = (name)=>{
            controller.abort();
            box.close();
            box.remove(); //remove dailog box from DOM to prevent clustering
            resolve(name);
         };

         save.addEventListener('click',()=>{
            if(input.classList.contains("valid")){
            helper(input.value);
            }
         },{signal:controller.signal});

         cancel.addEventListener('click',()=>{
            helper(false);
         },{signal:controller.signal});

         input.addEventListener('keydown',(event)=>{
            if(event.key==='Enter' && input.classList.contains("valid")){
               helper(input.value);
            }
            
         },{signal:controller.signal});

         input.addEventListener('input',(event)=>{
            debouncedValidate(event,msg);
         },{signal:controller.signal});
      });
  
}

function displayHabits(){

   let habitList = document.getElementById('habitlist');
   let placehold = document.getElementById('habitplaceholder');
   if(habits.length===0){
      placehold.textContent = "No habits yet. Add habits";
      habitList.style.display = 'none';
   }
   else{
       placehold.textContent = "";
       habitList.style.display = 'flex';
   }

   habits.forEach((habit)=>{
     
      let name = document.createElement('div');
      let streak = document.createElement('div');
      let toplist = document.createElement('div');
      let ele = document.createElement('div');
      let btn = document.createElement('button');
      let del = document.createElement('button');
      let edit =  document.createElement('button');
      let panel = document.createElement('div');
      let d_n = document.createElement('span');
      
      panel.classList.add('panel');
      ele.classList.add('habCard');
      d_n.classList.add('material-icons');
      btn.classList.add('btn','done');
      del.classList.add('btn','del');
      edit.classList.add('btn','edit');
      name.classList.add('nameCard');
      streak.classList.add('stCard');
      toplist.classList.add('toplist');


      if(habit.completed===false){
         d_n.innerText = "radio_button_unchecked";
         d_n.classList.add('pri-icon');
      }
      else{
         d_n.innerText = "task_alt";
         d_n.classList.add('sec-icon');
      }
    
      name.innerText = nameFormat(habit.name)+'\n'+habit.currStreak + "🔥";
      streak.innerText = "Best Streak"+'\n'+habit.bestStreak+"🏆"
      name.append(d_n);
     
      btn.onclick = ()=>{
         countStreak(habit);
         renderHabits();
      };
      del.onclick = async ()=>{
         const result = await popConfirm();
        if(result){
            
            deleteHabit(habit);
            renderHabits();
         }
      };
      edit.onclick = async ()=>{
         await editHabits(habit);
         renderHabits();
      };

      panel.append(btn,del,edit);
      toplist.append(name,streak);
      ele.append(toplist,panel);
     
      habitList.appendChild(ele);
   })
}

function popConfirm(){
   let confirm = document.createElement('dialog');
   let ok = document.createElement('button');
   let cancel = document.createElement('button');
   let msg = document.createElement('p');
   confirm.classList.add('pop-box');
   ok.classList.add('btn');
   cancel.classList.add('btn');

   msg.innerText = "Delete ❓";
   ok.innerText = "OK";
   cancel.innerText = "Cancel";

   confirm.append(msg,ok,cancel);

   document.body.append(confirm);

   confirm.showModal();

   return new Promise((resolve)=>{
      const controller = new AbortController();
      const helper = (result)=>{
         controller.abort();
         confirm.close();
         confirm.remove();  // remove dailog from DOM
         resolve(result);  // Sends true/false back to whoever called outer function
      };
      ok.addEventListener('click',()=>{
        helper(true);
      },{signal:controller.signal}); //removes event listener after done 

      cancel.addEventListener('click',()=>{
         helper(false);
      },{signal:controller.signal});
   })


}
function isAlpha(str){
   return /^[a-zA-Z]+( [a-zA-Z]+)*$/.test(str);
}

function nameFormat(str,save=false){
   if(save){
      str = str.trim().toLowerCase();
      return str;
   }
   str = str.trim();
   str = str.charAt(0).toUpperCase() + str.slice(1);
   return str;
}

function countStreak(habit){
   let today = dayjs();
   let lastDone = dayjs(habit.lastDone);
   let diff = today.diff(lastDone,"days");
  
   
   if(habit.currStreak===0){
      habit.lastDone = dayjs().format("YYYY-MM-DD");
      habit.completed = true;
      habit.currStreak = 1;
      habit.bestStreak = Math.max(habit.bestStreak,habit.currStreak);
      savelocal();
     
   }
   else if(diff===1){
      habit.currStreak+=1;
      habit.completed = true
      habit.lastDone = dayjs().format("YYYY-MM-DD");
      habit.bestStreak = Math.max(habit.bestStreak,habit.currStreak);
      savelocal();
   }
   else if(diff===0){
     popAlert("This task is already completted for today !");
   }
   else{
      habit.currStreak = 1;
      habit.completed  = true;
      habit.lastDone =  dayjs().format("YYYY-MM-DD HH:mm");
      savelocal();
   }
  
}

function popAlert(msg){
   let box = document.createElement('dialog');
   let icon = document.createElement('span');
   let p  = document.createElement('p');
   let close = document.createElement('button');
   
   p.innerText = msg;
   close.innerText = "Close"
   box.classList.add('pop-box');
   close.classList.add('btn');
   icon.classList.add('alert');

   box.append(icon,p,close);
   document.body.append(box);
   box.showModal();

   close.addEventListener('click',()=>{
      box.close();
      box.remove();
   },{once:true})


}

function renderHabits(){
   let habitList = document.getElementById('habitlist');
   habitList.innerHTML = "";
   displayHabits();
   fillPB();
}
function savelocal() {
    localStorage.setItem("habits", JSON.stringify(habits));
}
displayHabits();
fillPB();


