//Logic of my web app
let habits = JSON.parse(localStorage.getItem("habits")) || [];

function addHabits(){
   let input = document.getElementById("form");
   let habit  = input.value ;
   if(habit.trim().length===0) return;
   habits.push({
      name : habit,
      lastDone : null,
      lastCompleted : false,
      streakCount : 0 
   });
   savelocal();
   renderHabits();
   input.value = "";
}

function deleteHabit(habit){
   habits = habits.filter((hab)=>{ return hab.name!==habit.name }); // or habits = habits.filter((hab)=> hab.name!==habit.name )  (without return)
   localStorage.setItem("habits", JSON.stringify(habits));

}

function displayHabits(){
   let habitList = document.getElementById('habitlist');
   habits.forEach((habit)=>{
      let con = document.createElement('pre');
      let ele = document.createElement('li');
      let btn = document.createElement('button');
      let del = document.createElement('button');
      btn.textContent = "Done";
      del.textContent = "🗑️";

      con.textContent = habit.name + "     " +habit.streakCount+"  🔥";
      btn.onclick = ()=>{
         countStreak(habit);
         renderHabits();
      };
      del.onclick = ()=>{
         deleteHabit(habit);
         renderHabits();
      }
      
      ele.append(con,btn,del);
     
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
   else if(habit.lastCompleted===true && habit.lastDone.getDate()-today.getDate()===1){
      habit.streakCount+=1;
      habit.lastDone = new Date();
   }
   else if(habit.lastDone.getDate()-today.getDate()===0){
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


