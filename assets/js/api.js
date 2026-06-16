const API_URL =
"https://script.google.com/macros/s/AKfycbxA1ueOVLJtb-GV_bJ_HBaMpufdaRXJZSAKI3EzfPSehvLQX2WzBdKHYMzzu8J03J0d/exec";

/* =========================================
   REGISTER USER
========================================= */

async function apiRegister(userData) {

    try {

        console.log("Register Request:", userData);

        const response = await fetch(
            API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                    "text/plain;charset=utf-8"
                },
                body: JSON.stringify({
                    action: "registerUser",
                    ...userData
                })
            }
        );

        const result =
        await response.json();

        console.log(
            "Register Response:",
            result
        );

        return result;

    } catch(error) {

        console.error(error);

        return {
            success:false,
            message:error.message
        };
    }
}

/* =========================================
   LOGIN
========================================= */

async function apiLogin(
    email,
    password
) {

    try {

        const response =
        await fetch(

`${API_URL}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`

        );

        const result =
        await response.json();

        console.log(
            "Login Response:",
            result
        );

        return result;

    } catch(error) {

        console.error(error);

        return {
            success:false,
            message:error.message
        };
    }
}

/* =========================================
   GET DATA
========================================= */

async function apiGet(action) {

    try {

        const response =
        await fetch(
            `${API_URL}?action=${action}`
        );

        const result =
        await response.json();

        console.log(
            "GET Response:",
            result
        );

        return result;

    } catch(error) {

        console.error(error);

        return [];
    }
}

/* =========================================
   POST DATA
========================================= */

async function apiPost(data) {

    try {

        const response =
        await fetch(
            API_URL,
            {
                method:"POST",
                headers:{
                    "Content-Type":
                    "text/plain;charset=utf-8"
                },
                body:JSON.stringify(data)
            }
        );

        const result =
        await response.json();

        console.log(
            "POST Response:",
            result
        );

        return result;

    } catch(error) {

        console.error(error);

        return {
            success:false,
            message:error.message
        };
    }
}