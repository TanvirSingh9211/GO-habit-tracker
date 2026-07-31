//Logic of my web app
import dayjs from "dayjs";
let habits = JSON.parse(localStorage.getItem("habits")) || [];



let input = document.getElementById("form");
input.addEventListener("keydown",(event)=>{
      if(event.key==='Enter'){
         event.preventDefault();
         addHabits();
      }
   }
);
let addbtn  = document.getElementById("addbtn");
   addbtn.addEventListener("click",()=>{
      addHabits();
   }
);

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


function addHabits(){
   let hab  = nameFormat(input.value) ;
   if(hab.trim().length===0) return;
   if(ifDuplicate(hab)){
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
      
      input.value = "";
   }
   else{
      alert("This habit already exists !!");
      input.value = "";
   }
}

function deleteHabit(habit){
   habits = habits.filter((hab)=>{ return hab.name!==habit.name }); // or habits = habits.filter((hab)=> hab.name!==habit.name )  (without return)
   savelocal();

}

function editHabits(habit){
   let newname = nameFormat(prompt("enter new habit"));
   if(newname!==null && newname.trim().length!==0){
      if(ifDuplicate(newname)) {
         habit.name  = newname;
      }
      else {
         alert("This habit already exists !!");
      }
   }
   savelocal();
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
      panel.classList.add('panel');
      ele.classList.add('habCard');
   
      btn.classList.add('btn','push-btn','done');
      del.classList.add('btn','push-btn','del');
      edit.classList.add('btn','push-btn','edit');
      name.classList.add('nameCard');
      streak.classList.add('stCard');
      toplist.classList.add('toplist');
      
      if(habit.completed===true){
         name.classList.add('notdone');

      }
      else{
         name.classList.add('notdone');
      }
    
      name.innerText = habit.name+'\n'+habit.currStreak + "🔥";
      streak.innerText = "Best Streak"+'\n'+habit.bestStreak+"🏆"
      
     
      btn.onclick = ()=>{
         countStreak(habit);
         renderHabits();
      };
      del.onclick = ()=>{
        if(confirm("Delete?")){
            
            deleteHabit(habit);
            renderHabits();
         }
      }
      edit.onclick = ()=>{
         editHabits(habit);
         renderHabits();
      }
      panel.append(btn,del,edit);
      toplist.append(name,streak);
      ele.append(toplist,panel);
     
      habitList.appendChild(ele);
   })
}
function nameFormat(str){
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
     alert("This task is already completted for Today !");
   }
   else{
      habit.currStreak = 1;
      habit.completed  = true;
      habit.lastDone =  dayjs().format("YYYY-MM-DD HH:mm");
      savelocal();
   }
  
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


