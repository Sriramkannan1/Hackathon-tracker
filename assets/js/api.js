const API_URL =
"https://script.google.com/macros/s/AKfycbzgy9xSrANYKI_3rKk73ekETZ57AHq_XoyPlkwrLtQy1TEOMA3v_GYkXi9Ic5hEvQlq/exec";

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