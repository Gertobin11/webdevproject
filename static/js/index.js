// modal popup
setTimeout(() => {
    $('#indexModal').modal()
}, 2000);
            
            
// script to change modal to appropriate greeting based on time of day
const hour = new Date().getHours();
let greeting;

switch (true) {
case (hour < 12):
    greeting = "Good morning!";
    break;
case (hour < 18):
    greeting = "Good afternoon!";
    break;
default:
greeting = "Good evening!";
}
document.getElementById('greeting').textContent = greeting;