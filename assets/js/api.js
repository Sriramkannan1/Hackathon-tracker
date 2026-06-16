const API_URL =
"https://script.google.com/macros/s/AKfycbyHjFqr70ZqswMM_5_Zf4IeTEWlYAE9XX0zlAvpyiwFQ49tfyNDqCky3xbk7uo3Oirq/exec";
async function apiRegister(userData){

    const response =
    await fetch(API_URL,{
        method:"POST",
        body:JSON.stringify({
            action:"registerUser",
            ...userData
        })
    });

    return await response.json();
}
async function apiGet(action){

    const response =
    await fetch(
        `${API_URL}?action=${action}`
    );

    return await response.json();
}

async function apiLogin(
    email,
    password
){

    const response =
    await fetch(

`${API_URL}?action=login&email=${email}&password=${password}`

    );

    return await response.json();
}

async function apiPost(data){

    const response =
    await fetch(
        API_URL,
        {
            method:"POST",
            body:JSON.stringify(
                data
            )
        }
    );

    return await response.json();
}