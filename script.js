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

function addHabits(){
   let hab  = input.value ;
   if(hab.trim().length===0) return;
   if(ifDuplicate(hab)){
      habits.push({
         name : hab,
         lastDone : null,
         lastCompleted : false,
         streakCount : 0 
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
   localStorage.setItem("habits", JSON.stringify(habits));

}

function editHabits(habit){
   let newname = prompt("enter new habit");
   if(newname!==null && newname.trim().length!==0){
      habit.name  = newname;
   }
}

function displayHabits(){

   let habitList = document.getElementById('habitlist');
   let placehold = document.getElementById('habitplaceholder');
   if(habits.length===0){
      placehold.textContent = "No habits yet. Add habits";
   }

   habits.forEach((habit)=>{
      placehold.textContent = "";
      let con = document.createElement('pre');
      let ele = document.createElement('li');
      let btn = document.createElement('button');
      let del = document.createElement('button');
      let edit =  document.createElement('button');
      btn.textContent = "Done";
      del.textContent = "🗑️";
      edit.textContent = "⚙️";

      con.textContent = habit.name + "     " +habit.streakCount+"  🔥";
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
      
      ele.append(con,btn,del,edit);
     
      habitList.appendChild(ele);
   })
}

function countStreak(habit){
   let today = new Date();
   if(habit.lastDone===null || habit.lastCompleted===false){
      habit.lastDone = new Date();
      habit.lastCompleted = true ;
      habit.streakCount = 1;
   }
   else if(habit.lastCompleted===true && (habit.lastDone.getTime()-today.getTime())/1000*60*24*60===1){
      habit.streakCount+=1;
      habit.lastDone = new Date();
   }
   else if((habit.lastDone.getTime()-today.getTime())/1000*60*24*60<=1){
      // nothing
   }
   else{
      habit.lastCompleted = false;
      habit.streakCount = 0;
   }
  
}

function renderHabits(){
   let habitList = document.getElementById('habitlist');
   habitList.innerHTML = "";
   displayHabits();
}

displayHabits();



function savelocal() {
    localStorage.setItem("habits", JSON.stringify(habits));
}


