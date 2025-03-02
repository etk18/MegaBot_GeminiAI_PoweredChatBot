let prompt = document.querySelector('#prompt');
let chatContainer = document.querySelector('.chat-container');
let submitbtn=document.querySelector("#submit");
let imagebtn=document.querySelector("#image");
let image=document.querySelector("#image img");
let imageinput=document.querySelector("#image input");


function createChatBox(html, classes) {
    let div = document.createElement('div');
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

const apikey= `${{secrets.API_KEY}}`;
console.log(apikey);
const Api_Url='https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDfNI7jxxARpwxd4Camu2IQiMFVwydBJxg';
let user={
    message:null,
    file:{
        mime_type:null,
        data: null
    }
}

async function generateResponse(aiChatBox) {
    let text=aiChatBox.querySelector(".ai-chat-area")
    let RequestOption={
        method:"POST",
        headers:{'Content-Type' : 'application/json'},
        body:JSON.stringify({
            "contents":[
                {"parts":[{text:user.message},(user.file.data?[{inline_data:user.file}]:[])

                ]
            }]
        })
    }
    try{
        let response= await fetch(Api_Url,RequestOption);
        let data=await response.json();
       let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
       text.innerHTML=apiResponse   ; 
    }
    catch(error){
        console.log(error);
        
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
        image.src=`img.svg`
        image.classList.remove("choose")
        user.file={}
        imagebtn.style.filter="drop-shadow(0 0 6px  rgba(35, 52, 5, 0.953))";
        submitbtn.style.filter="drop-shadow(0 0 6px  rgba(35, 52, 5, 0.953))";
    }
}

let handelchatResponse = (msg) =>{
    console.log(msg);
    user.message = msg;
    let html = `<img width="50" src="user.png" id="userImage" alt="">
            <div class="user-chat-area">
                ${msg}
                ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
            </div>`;
    prompt.value = '';
    chatContainer.appendChild(createChatBox(html, 'user-chat-box'));   
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
    setTimeout(()=>{
        let html =`<img width="13%" src="ai.png" id="aiImage" alt="">
            <div class="ai-chat-area">
                <img src="loading.webp" alt="" width="10%" id="loading" style="margin-top: 5px;">

            </div>`;
            let aiChatBox= createChatBox(html, 'ai-chat-box');
            chatContainer.appendChild(aiChatBox);
            generateResponse(aiChatBox);
    },589); 
}
prompt.addEventListener('keydown', (e) =>{
    if(e.key === 'Enter'){
        
        handelchatResponse(prompt.value);
        prompt.value = '';
    }
}); // This is an event listener that listens for a keydown event on the prompt element. When the event is triggered, the function inside the event listener will run.

submitbtn.addEventListener("click",()=>{
    handelchatResponse(prompt.value);
    submitbtn.style.filter="drop-shadow(0 0 6px  rgba(112, 2, 15, 0.95))";
})
imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return;
    let reader=new FileReader();
    reader.onload=(e)=>{
       let base64string=e.target.result.split(",")[1]
       user.file={
        mime_type:file.type,
        data: base64string
    }
    image.src=`data:${user.file.mime_type};base64,${user.file.data}`
    image.classList.add("choose")
    }
    imagebtn.style.filter="drop-shadow(0 0 10px  rgba(232, 42, 3, 0.871))";
    reader.readAsDataURL(file);
});
document.querySelector("#image").addEventListener("click",()=>{
    document.querySelector("#image").querySelector("input").click();
})
