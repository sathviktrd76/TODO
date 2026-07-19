const STORAGE_KEY = 'simple_todos_v1'

const el = id => document.getElementById(id)
const todoInput = el('todo-input')
const addBtn = el('add-btn')
const listEl = el('todo-list')
const remainingEl = el('remaining')
const clearCompletedBtn = el('clear-completed')
const filterBtns = Array.from(document.querySelectorAll('.filter-btn'))

let todos = []
let filter = 'all'

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function load(){
  const raw = localStorage.getItem(STORAGE_KEY)
  todos = raw ? JSON.parse(raw) : []
}

function createTodo(text){
  return {id: Date.now(), text: text.trim(), completed:false}
}

function addTodo(){
  const text = todoInput.value
  if(!text.trim()) return
  todos.unshift(createTodo(text))
  todoInput.value = ''
  save()
  render()
}

function toggleTodo(id){
  const t = todos.find(x=>x.id===id)
  if(t) t.completed = !t.completed
  save(); render()
}

function removeTodo(id){
  todos = todos.filter(x=>x.id!==id)
  save(); render()
}

function clearCompleted(){
  todos = todos.filter(t=>!t.completed)
  save(); render()
}

function setFilter(newFilter){
  filter = newFilter
  filterBtns.forEach(b=>b.classList.toggle('active', b.dataset.filter===filter))
  render()
}

function render(){
  listEl.innerHTML = ''
  const shown = todos.filter(t=>{
    if(filter==='active') return !t.completed
    if(filter==='completed') return t.completed
    return true
  })

  for(const t of shown){
    const li = document.createElement('li')
    li.className = 'todo-item'
    li.dataset.id = t.id

    const left = document.createElement('div'); left.className='left'
    const chk = document.createElement('input'); chk.type='checkbox'; chk.checked = t.completed
    chk.addEventListener('change', ()=> toggleTodo(t.id))
    const span = document.createElement('span'); span.className = 'todo-text' + (t.completed? ' completed':'')
    span.textContent = t.text
    left.appendChild(chk); left.appendChild(span)

    const actions = document.createElement('div'); actions.className='actions'
    const del = document.createElement('button'); del.className='btn-icon'; del.textContent='✕'
    del.title = 'Delete'; del.addEventListener('click', ()=> removeTodo(t.id))
    actions.appendChild(del)

    li.appendChild(left); li.appendChild(actions)
    listEl.appendChild(li)
  }

  const remaining = todos.filter(t=>!t.completed).length
  remainingEl.textContent = remaining
}

// Events
addBtn.addEventListener('click', addTodo)
todoInput.addEventListener('keydown', e=>{ if(e.key==='Enter') addTodo() })
clearCompletedBtn.addEventListener('click', clearCompleted)
filterBtns.forEach(b=>b.addEventListener('click', ()=> setFilter(b.dataset.filter)))

// init
load(); render()