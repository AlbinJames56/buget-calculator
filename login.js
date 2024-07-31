function login(){
    let uname= document.getElementById('username').value;
    let password= document.getElementById('password').value;

    event.preventDefault();
    // Retrieve the array of users from localStorage
    let existingUser=JSON.parse(localStorage.getItem("USERS")||[]) 
    let user = existingUser.find(user => user.username === uname);

    // Check if user exists and password matches
    if (user && user.password === password) {
        alert("Login Successful");
        window.location.href = "./home.html";
    }else{
        alert("Invalid Credentials");
    }


}