async function loginUser(
    email,
    password
){

    const result =
    await apiLogin(
        email,
        password
    );

    if(result.success){

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        window.location.href =
        "dashboard.html";

    }else{

        alert(
            "Invalid Login"
        );
    }
}

function logoutUser(){

    localStorage.removeItem(
        "loggedIn"
    );

    window.location.href =
    "login.html";
}