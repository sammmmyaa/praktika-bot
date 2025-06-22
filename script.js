const chat=document.getElementById('chat-messages')
const input=document.getElementById('message-input')
const button=document.getElementById('send-button')

let state={
started:false,
name:'',
numbers:[]
}

input.addEventListener('input',function(){
button.disabled=!input.value.trim()
if(input.value.trim()){
button.classList.add('active')
}else{
button.classList.remove('active')
}
})

button.addEventListener('click',sendMessage)
input.addEventListener('keypress',function(e){
if(e.key==='Enter'&&input.value.trim())sendMessage()
})

function sendMessage(){
const text=input.value.trim()
if(!text)return

addMessage('user',text)
input.value=''
button.disabled=true
button.classList.remove('active')

showTyping(function(){
handleBotResponse(text)
})
}

function addMessage(sender,text){
const msg=document.createElement('div')
msg.className='message '+sender

const ava=document.createElement('img')
ava.className='avatar'
ava.src=sender+'_avatar.png'

const bubble=document.createElement('div')
bubble.className='bubble'
bubble.textContent=text

if(sender==='bot'){
msg.appendChild(ava)
msg.appendChild(bubble)
}else{
msg.appendChild(bubble)
msg.appendChild(ava)
}

chat.appendChild(msg) // Сообщения добавляются в конец
chat.scrollTop=chat.scrollHeight // Автопрокрутка к новому сообщению
}

function showTyping(callback){
const typing=document.createElement('div')
typing.className='message bot typing'

const ava=document.createElement('img')
ava.className='avatar'
ava.src='bot_avatar.png'

const dots=document.createElement('div')
dots.className='typing-dots'
dots.innerHTML='<span></span><span></span><span></span>'

typing.appendChild(ava)
typing.appendChild(document.createTextNode('Печатает'))
typing.appendChild(dots)

chat.appendChild(typing)
chat.scrollTop=chat.scrollHeight

setTimeout(function(){
typing.remove()
callback()
},1500)
}

function handleBotResponse(text){
if(text==='/start'){
state.started=true
addMessage('bot','Привет, меня зовут Чат-бот, а как зовут тебя?')
}
else if(!state.started){
addMessage('bot','Введите команду /start, для начала общения')
}
else if(text.startsWith('/name: ')){
state.name=text.split('/name: ')[1]
addMessage('bot','Привет '+state.name+', приятно познакомится. Я умею считать, введи числа которые надо посчитать')
}
else if(text.startsWith('/number: ')){
const nums=text.split('/number: ')[1].split(',').map(function(n){
return parseFloat(n.trim())
})
if(nums.length===2&&!nums.some(isNaN)){
state.numbers=nums
addMessage('bot','Выбери действие: +, -, *, /')
}else{
addMessage('bot','Неверный формат чисел. Пример: /number: 5, 7')
}
}
else if(['+','-','*','/'].includes(text)&&state.numbers.length===2){
const a=state.numbers[0]
const b=state.numbers[1]
let res
if(text==='+')res=a+b
else if(text==='-')res=a-b
else if(text==='*')res=a*b
else res=b!==0?a/b:'Ошибка: деление на 0'
addMessage('bot','Результат: '+res)
state.numbers=[]
}
else if(text==='/stop'){
addMessage('bot','Всего доброго, если хочешь поговорить пиши /start')
state={started:false,name:'',numbers:[]}
}
else{
addMessage('bot','Я не понимаю, введите другую команду!')
}
}