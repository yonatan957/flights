"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const AGENT = "bilbo bagins";
const baseUrl = "https://66ead67455ad32cda47aa15d.mockapi.io/api/";
const postButton = document.getElementById("post");
const IsMaleInput = document.getElementById("male");
const passengersDiv = document.querySelector("#passengers");
const get = (arg1) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(baseUrl + arg1);
        if (!res.ok)
            throw new Error(res.statusText);
        const obj = yield res.json();
        return obj;
    }
    catch (err) {
        throw err;
    }
});
const postOrPut = (arg0, arg1, arg2) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(baseUrl + arg1, {
            method: arg0,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(arg2)
        });
        const obj = yield res.json();
        return obj;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
const deleteReq = (arg1) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(baseUrl + arg1, {
            method: "DELETE"
        });
        const obj = yield res.json();
        return obj;
    }
    catch (err) {
        throw err;
    }
});
const createEdit = (id_passenger, div) => {
    div.innerHTML = "";
    div.style.flexDirection = "column";
    div.style.gap = "20px";
    const select = document.querySelector("#flights").cloneNode(true);
    select.id = "flightsEdit";
    const gender = document.querySelector("#genderDiv").cloneNode(true);
    gender.id = "genderDivEdit";
    const IsMaleInput2 = gender.querySelector("#male");
    IsMaleInput2.name = "gender2";
    gender.querySelector("#female").name = "gender2";
    const name = document.querySelector("#nameInput").cloneNode(true);
    name.id = "nameInputEdit";
    const button = document.createElement("button");
    button.innerText = "edit";
    button.style.backgroundColor = "green";
    button.addEventListener("click", () => {
        const passenger = {
            createdAt: new Date().toISOString(),
            name: name.value,
            gender: IsMaleInput2.checked ? "male" : "female",
            flight_id: select.value,
            agent: AGENT,
            id: id_passenger
        };
        postOrPut("PUT", `pasangers/${id_passenger}`, passenger).then((res) => {
            passengersDiv.innerHTML = "";
            fillPassengers();
        });
    });
    const cancelButton = document.createElement("button");
    cancelButton.innerText = "cancel";
    cancelButton.style.backgroundColor = "red";
    cancelButton.addEventListener("click", () => {
        passengersDiv.innerHTML = "";
        fillPassengers();
    });
    div.append(name, gender, select, button, cancelButton);
};
const fillPassengers = () => __awaiter(void 0, void 0, void 0, function* () {
    const passengers = yield get("pasangers?agent=bilbo%20bagins");
    for (let passenger of passengers) {
        const div = document.createElement("div");
        const flight = yield get(`flights/${passenger.flight_id}`);
        div.className = "passenger";
        div.dataset.id = passenger.id;
        div.dataset.flight_id = passenger.flight_id;
        const p = document.createElement("p");
        p.textContent = `${passenger.name} - ${flight.from} 🛬 ${flight.to}  .`;
        const button = document.createElement("button");
        button.textContent = "🗑️";
        button.addEventListener("click", (e) => {
            // const id = (e.target as HTMLButtonElement).parentElement?.dataset.id
            deleteReq(`pasangers/${passenger.id}`);
            div.remove();
        });
        const editButton = document.createElement("button");
        editButton.textContent = "✏️";
        editButton.addEventListener("click", (e) => {
            createEdit(passenger.id, div);
        });
        div.append(p, button, editButton);
        passengersDiv.append(div);
    }
});
function fillFlights() {
    return __awaiter(this, void 0, void 0, function* () {
        const select = document.getElementById("flights");
        const flights = yield get("flights");
        flights.forEach(flight => {
            const option = document.createElement("option");
            option.value = flight.id;
            option.textContent = flight.from + " 🛬 " + flight.to;
            select.appendChild(option);
        });
    });
}
postButton.addEventListener("click", () => {
    const nameInput = document.getElementById("nameInput");
    const name = nameInput.value;
    if (!name) {
        alert("fill your name please");
        return;
    }
    const gender = IsMaleInput.checked ? "male" : "female";
    const flight = document.getElementById("flights");
    const flight_id = flight.value;
    const Pasenger = {
        createdAt: new Date().toISOString(),
        name: name,
        gender: gender,
        flight_id: flight_id,
        agent: AGENT,
        id: ""
    };
    console.log(Pasenger);
    postOrPut("POST", "pasangers", Pasenger).then((res) => {
        passengersDiv.innerHTML = "";
        fillPassengers();
        nameInput.value = "";
    });
});
fillFlights();
fillPassengers();
