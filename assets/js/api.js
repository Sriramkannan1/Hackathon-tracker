const API_URL = "https://script.google.com/macros/s/AKfycbzK7NCtq4h-ZbFzgTUR4G0WRGBr3zs2jWA6fd3Qy5uZeAq1oA3WL_pbBtldpWlb1Zww/exec";

async function apiRegister(userData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action: "registerUser", ...userData })
        });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

async function apiLogin(email, password) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action: "login", email: email, password: password })
        });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}

async function apiGet(action, params = "") {
    try {
        const userStr = localStorage.getItem("hack_current_user");
        let email = "";
        if (userStr) {
            const user = JSON.parse(userStr);
            email = user.email || "";
        }

        const response = await fetch(`${API_URL}?action=${action}&email=${encodeURIComponent(email)}${params}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function apiPost(data) {
    try {
        const userStr = localStorage.getItem("hack_current_user");
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.email) data.ownerEmail = user.email;
        }

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}