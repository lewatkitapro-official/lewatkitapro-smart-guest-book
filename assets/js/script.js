// ======================================================
// LEWAT KITA SMART GUEST BOOK
// Version 1.0
// ======================================================


// ======================================================
// DOM ELEMENT
// ======================================================
const splash = document.getElementById("splash");

const landing = document.getElementById("landing");
const guestForm = document.getElementById("guest-form");

const minus = document.getElementById("minus");
const plus = document.getElementById("plus");
const pax = document.getElementById("pax");

const guestFields = document.getElementById("guestFields");

const representative = document.getElementById("representative");
const representativeOption = document.getElementById("representativeOption");

const successScreen = document.getElementById("successScreen");

const nextGuest = document.getElementById("nextGuest");
const submitGuest = document.getElementById("submitGuest");

const message = document.getElementById("message");

// ======================================================
// GLOBAL STATE
// ======================================================

let total = 1;

// URL GOOGLE APPS SCRIPT

const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbz5N_MBnI_8-o6HZroelwa5LPWj0vwFOXnmIbhyDVcSIxIAj8WwWGX8R5pYvBBKLlIzYw/exec";

// ======================================================
// LANDING SCREEN
// ======================================================

landing.addEventListener("click", () => {

    landing.style.opacity = "0";

    setTimeout(() => {

        landing.classList.remove("active");

        guestForm.classList.add("active");

        renderGuestFields();

    },300);

});
// ======================================================
// COUNTER +
// ======================================================

plus.addEventListener("click", () => {

    total++;

    renderGuestFields();

});

// ======================================================
// COUNTER -
// ======================================================

minus.addEventListener("click", () => {

    if(total > 1){

        total--;

        renderGuestFields();

    }

});

// ======================================================
// REPRESENTATIVE CHECKBOX
// ======================================================

representative.addEventListener("change", () => {

    renderGuestFields();

});

// ======================================================
// RENDER GUEST FIELDS
// ======================================================

function renderGuestFields() {

    // Kosongkan isi field
    guestFields.innerHTML = "";

    // Update angka counter
    pax.textContent = total;

    // Tampilkan checkbox jika tamu > 1
    if (total > 1) {

        representativeOption.style.display = "block";

    } else {

        representativeOption.style.display = "none";
        representative.checked = false;

    }

    // =============================
    // MODE PERWAKILAN
    // =============================

    if (representative.checked) {

        guestFields.innerHTML = `

            <div class="guest-item">

                <label>Nama Perwakilan</label>

                <input
                    type="text"
                    class="guest-name"
                    placeholder="Masukkan nama perwakilan">

                <small class="error-message"></small>

            </div>

        `;

        return;

    }

    // =============================
    // MODE SEMUA NAMA
    // =============================

    for (let i = 1; i <= total; i++) {

        guestFields.innerHTML += `

            <div class="guest-item">

                <label>Nama Tamu ${i}</label>

                <input
                    type="text"
                    class="guest-name"
                    placeholder="Masukkan nama tamu ${i}">

                <small class="error-message"></small>

            </div>

        `;

    }

}

// ======================================================
// REALTIME VALIDATION
// ======================================================

document.addEventListener("input", (e) => {

    if (!e.target.classList.contains("guest-name")) return;

    e.target.classList.remove("input-error");

    const error =
        e.target.parentElement.querySelector(".error-message");

    if (error) {

        error.textContent = "";

    }

});

// ======================================================
// VALIDATE FORM
// ======================================================

function validateForm() {

    let valid = true;

    const guestItems = document.querySelectorAll(".guest-item");

    guestItems.forEach(item => {

        const input = item.querySelector(".guest-name");
        const error = item.querySelector(".error-message");

        // Reset Error
        input.classList.remove("input-error");
        error.textContent = "";

        // Validasi kosong
        if (input.value.trim() === "") {

            input.classList.add("input-error");

            error.textContent = "Nama wajib diisi";

            valid = false;

        }

    });

    return valid;

}

// ======================================================
// GET FORM DATA
// ======================================================

function getFormData() {

    const guestNames = document.querySelectorAll(".guest-name");

    const names = [];

    guestNames.forEach(input => {

        names.push(input.value.trim());

    });

    return {

        total: total,

        representative: representative.checked,

        names: names,

        message: message.value.trim()

    };

}

// ======================================================
// RESET FORM
// ======================================================

function resetForm() {

    total = 1;

    representative.checked = false;

    message.value = "";

    renderGuestFields();

}

// ======================================================
// SUBMIT FORM
// ======================================================

submitGuest.addEventListener("click", async () => {

    // Validasi form
    if (!validateForm()) return;

    // Ambil data
    const data = getFormData();

    // Ubah tombol menjadi loading
    submitGuest.disabled = true;
    submitGuest.classList.add("btn-loading");
    submitGuest.textContent = "Mengirim...";

try {

    const response = await fetch(WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {

        successScreen.style.display = "flex";
        return;

    } else {

        alert("❌ Gagal mengirim data.");

    }

} catch (error) {

    console.error(error);

    alert("❌ Terjadi kesalahan koneksi.");

}

// Kembalikan tombol
submitGuest.disabled = false;
submitGuest.classList.remove("btn-loading");
submitGuest.textContent = "Check In";

});   // <-- PENUTUP submitGuest.addEventListener()

// ==============================

nextGuest.addEventListener("click", () => {

    successScreen.style.display = "none";

    resetForm();

    submitGuest.disabled = false;

    submitGuest.classList.remove("btn-loading");

    submitGuest.innerHTML = "Check In";

});

window.addEventListener("load", () => {

    setTimeout(() => {

        splash.classList.add("hide");

    }, 2000);

});