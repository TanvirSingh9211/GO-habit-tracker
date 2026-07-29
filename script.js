//Logic of my web app
let habits = JSON.parse(localStorage.getItem("habits")) || [];



let input = document.getElementById("form");
input.addEventListener("keydown",(event)=>{
      if(event.key==='Enter'){
         event.preventDefault();
         addHabits();
      }
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
         lastDone : null,
         lastCompleted : false,
         streakCount : 0 ,
         completed : false
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
      habit.name  = newname;
   }
   savelocal();
}

function displayHabits(){

   let habitList = document.getElementById('habitlist');
   let placehold = document.getElementById('habitplaceholder');
   if(habits.length===0){
      placehold.textContent = "No habits yet. Add habits";
   }

   habits.forEach((habit)=>{
      placehold.textContent = "";
      let name = document.createElement('div');
      let streak = document.createElement('div');
      let ele = document.createElement('div');
      let btn = document.createElement('button');
      let del = document.createElement('button');
      let edit =  document.createElement('button');
      ele.classList.add('habCard');
     
      btn.textContent = "Done";
      del.textContent = "🗑️";
      edit.textContent = "⚙️";
      btn.classList.add('btn','push-btn');
      del.classList.add('btn','push-btn');
      edit.classList.add('btn','push-btn');
      name.classList.add('nameCard');
      streak.classList.add('stCard');
      

      name.textContent = habit.name;
      streak.textContent = habit.streakCount + "🔥";
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
      
      ele.append(name,streak,btn,del,edit);
     
      habitList.appendChild(ele);
   })
}
function nameFormat(str){
   str = str.charAt(0).toUpperCase() + str.slice(1);
   return str;
}

function countStreak(habit){
   let today = new Date();
   if(habit.lastDone===null || habit.lastCompleted===false){
      habit.lastDone = new Date();
      habit.lastCompleted = true ;
      habit.completed = true;
      habit.streakCount = 1;
      savelocal();
     
   }
   else if(habit.lastCompleted===true && (habit.lastDone.getTime()-today.getTime())/1000*60*24*60===1){
      habit.streakCount+=1;
      habit.completed = true
      habit.lastDone = new Date();
      savelocal();
   }
   else if((habit.lastDone.getTime()-today.getTime())/1000*60*24*60<=1){
      // nothing
   }
   else{
      habit.lastCompleted = false;
      habit.streakCount = 0;
      completed  = false;
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


