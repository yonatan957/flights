const AGENT:string = "bilbo bagins"
const baseUrl:string = "https://66ead67455ad32cda47aa15d.mockapi.io/api/"
const postButton:HTMLButtonElement = document.getElementById("post") as HTMLButtonElement
const IsMaleInput:HTMLInputElement = document.getElementById("male") as HTMLInputElement
const passengersDiv:HTMLDivElement = document.querySelector("#passengers") as HTMLDivElement

const get = async <T>(arg1:string):Promise<T> =>{
    try{
        const res = await fetch(baseUrl + arg1)
        if (!res.ok) throw new Error(res.statusText)
        const obj:T = await res.json()        
        return obj
    }
    catch(err){
        throw err
    }
}
const postOrPut = async <T>(arg0:string,arg1:string, arg2:T):Promise<T> =>{
    try{
        const res = await fetch(baseUrl + arg1, {
            method: arg0,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(arg2)          
        })
        const obj:T = await res.json() 
        return obj
    }
    catch(err){
        console.log(err)
        throw err
    }
}
const deleteReq = async <T>(arg1:string):Promise<T> =>{
    try{
        const res = await fetch(baseUrl + arg1, {
            method: "DELETE"
        })
        const obj:T = await res.json() 
        return obj
    }
    catch(err){
        throw err
    }
}
const createEdit = (id_passenger: string, div: HTMLDivElement):void => { 
    div.innerHTML =""
    div.style.flexDirection = "column"
    div.style.gap = "20px"
    const select = (document.querySelector("#flights") as HTMLSelectElement).cloneNode(true) as HTMLSelectElement
    select.id = "flightsEdit"
    const gender = (document.querySelector("#genderDiv") as HTMLDivElement).cloneNode(true) as HTMLDivElement
    gender.id = "genderDivEdit";
    const IsMaleInput2:HTMLInputElement = gender.querySelector("#male") as HTMLInputElement
    IsMaleInput2.name = "gender2";
    (gender.querySelector("#female") as HTMLInputElement).name = "gender2";
    const name = (document.querySelector("#nameInput") as HTMLInputElement).cloneNode(true) as HTMLInputElement
    name.id = "nameInputEdit"
    const button:HTMLButtonElement = document.createElement("button")
    button.innerText = "edit"
    button.style.backgroundColor = "green"
    button.addEventListener("click", ()=>{
        const passenger: Pasenger ={
            createdAt: new Date().toISOString(),
            name: name.value,
            gender: IsMaleInput2.checked ? "male" : "female",
            flight_id: select.value,
            agent: AGENT,
            id: id_passenger
        }
        postOrPut("PUT", `pasangers/${id_passenger}`, passenger).then((res)=>{
            passengersDiv.innerHTML =""
            fillPassengers()
        })
        })
    const cancelButton:HTMLButtonElement = document.createElement("button")
    cancelButton.innerText = "cancel"
    cancelButton.style.backgroundColor = "red"
    cancelButton.addEventListener("click", ()=>{
        passengersDiv.innerHTML =""
        fillPassengers()
    })
    div.append(name, gender, select,button,cancelButton)
}
const fillPassengers = async () => {
    const passengers = await get<Pasenger[]>("pasangers?agent=bilbo%20bagins")
    for(let passenger of passengers){
        const div:HTMLDivElement = document.createElement("div")
        const flight:Flight = await get(`flights/${passenger.flight_id}`)
        div.className = "passenger"
        div.dataset.id = passenger.id
        div.dataset.flight_id = passenger.flight_id
        
        const p:HTMLParagraphElement = document.createElement("p")
        p.textContent = `${passenger.name} - ${flight.from} 🛬 ${flight.to}  .`

        const button:HTMLButtonElement = document.createElement("button")
        button.textContent = "🗑️"
        button.addEventListener("click", (e)=>{
            // const id = (e.target as HTMLButtonElement).parentElement?.dataset.id
            deleteReq<Pasenger>(`pasangers/${passenger.id}`);
            div.remove()
        })
        const editButton:HTMLButtonElement = document.createElement("button")
        editButton.textContent = "✏️"
        editButton.addEventListener("click", (e)=>{
            createEdit(passenger.id, div)
        })
        div.append(p,button,editButton)
        passengersDiv.append(div)
    }
}
async function fillFlights(){
    const select:HTMLSelectElement = document.getElementById("flights") as HTMLSelectElement
    const flights = await get<Flight[]>("flights")
    flights.forEach(flight => {
        const option = document.createElement("option")
        option.value = flight.id
        option.textContent = flight.from + " 🛬 " + flight.to
        select.appendChild(option)
    })
}

postButton.addEventListener("click", ()=>{
    const nameInput:HTMLInputElement = document.getElementById("nameInput") as HTMLInputElement
    const name = nameInput.value
    if(!name){alert("fill your name please"); return}
    const gender = IsMaleInput.checked ? "male" : "female"
    const flight = document.getElementById("flights") as HTMLSelectElement
    const flight_id = flight.value
    const Pasenger:Pasenger = {
        createdAt: new Date().toISOString(),
        name: name,
        gender: gender,
        flight_id: flight_id,
        agent: AGENT,
        id:""
    }
    console.log(Pasenger);
    postOrPut<Pasenger>("POST","pasangers",Pasenger).then((res)=>{
        passengersDiv.innerHTML =""
        fillPassengers()
        nameInput.value = ""
    })
    
})
fillFlights()
fillPassengers()


interface Pasenger {
    createdAt: string
    name: string
    gender: string
    flight_id: string
    agent: string
    id: string   
}
interface Flight {
    date: string
    from:string
    to:string
    id:string
}


