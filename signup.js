function signup(){
    let fname=document.getElementById('firstName').value;
    let lname=document.getElementById('lastName').value;
    let email=document.getElementById('email').value;
    let password=document.getElementById('password').value;
    let existingUsers = JSON.parse(localStorage.getItem("USERS")) || []; 
     userExists=existingUsers.some(user => user.username===email)

     event.preventDefault();
    if(!fname||!lname||!email||!password){
        alert("Please fill all the fields");
    } 
    else if(userExists){
        alert("User already exists");
    }
    else{
        let user = {
            "firstName":fname,
            "lastName":lname,
            "username":email,
            "password":password
            };
            existingUsers.push(user);
            localStorage.setItem("USERS", JSON.stringify(existingUsers));
            alert("SignUp Successfully....!")
            window.location.href='login.html'
    }
}