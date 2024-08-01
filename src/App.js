import React,{useState,useEffect, useRef} from 'react';
import './App.css';
import {AiOutlineDelete} from 'react-icons/ai';
import {BsCheckLg} from 'react-icons/bs';

function App() {
  const [isCompleteScreen,setIsCompleteScreen] = useState(false);
  const [allTodos,setTodos] = useState([]);
  const [newTitle,setNewTitle] = useState("");
  const [newDescription,setNewDescription] = useState("");
  const [completedTodos,setCompletedTodos] = useState([]);
  const descriptionRef = useRef(null);
  const addRef = useRef(null);
  
  const handleAddTodo = ()=>{
    if (!newTitle && !newDescription) {
      alert('Please enter title and description');
      return;
    }

    let newTodoItem = {
      title:newTitle,
      description:newDescription
    }; // deklarasi variabel to do list yang baru

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem); //append new to do to array
    localStorage.setItem('todolist',JSON.stringify(updatedTodoArr)); // store array as a strings to storage using JSON.stringify keyword
    setTodos(updatedTodoArr); 

    setNewTitle('');
    setNewDescription('');
    
  };

  const handleDeleteTodo = (index)=>{
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index,1); //remove the item in the specific index
    localStorage.setItem('todolist',JSON.stringify(reducedTodo)); //remove array item in the specific item in the storage
    setTodos(reducedTodo);
  };

  const handleCompleted = (index)=>{
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = dd + '-' + mm + '-' + yyyy + 'at' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...allTodos[index],
      completedOn:completedOn
    }

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index); // because it's done, the items (to do) will be removed from array too
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr)); // save array of completed to do to local storage
  }

  const handleDeleteCompletedTodo = (index)=>{
    let delcompletedTodo = [...completedTodos];
    delcompletedTodo.splice(index,1);
    localStorage.setItem('completedTodos',JSON.stringify(delcompletedTodo)); //remove array item in the specific item in the storage
    setCompletedTodos(delcompletedTodo);
  }

  const handleKeyDown = (event, nextRef)=> {
    if (event.key === 'Enter') {
      event.preventDefault();
      nextRef.current.focus();
    }
  };

  useEffect(()=>{
    let savedTodo = JSON.parse(localStorage.getItem('todolist')); //JSON.parse convert the local storage data into an array
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if(savedTodo){
      setTodos(savedTodo);
    }

    if(savedCompletedTodo){
      setCompletedTodos(savedCompletedTodo);
    }
  },[])
  return (
    <div className="App">
      <div className="header-container">
        <h1 className="logo">To Do List</h1>
        <div class="hamburger">&#9776;</div>
      </div>
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input type="text" value={newTitle} onChange={(event)=>setNewTitle(event.target.value)} placeholder="What's the task title?" onKeyDown={(event) => handleKeyDown(event, descriptionRef)}/>
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input type="text" value={newDescription} onChange={(event)=>setNewDescription(event.target.value)} placeholder="What's the task description?" ref={descriptionRef} onKeyDown={(event) => handleKeyDown(event, addRef)}/>
          </div>
          <div className="todo-input-item">
            <button type="button" onClick={handleAddTodo} className="primaryBtn" ref={addRef}>Add</button>
          </div>
        </div>

        <div className="btn-area">
          <button className={`secondaryBtn ${isCompleteScreen===false && 'active'}`} onClick={()=>setIsCompleteScreen(false)}>Todo</button>
          <button className={`secondaryBtn ${isCompleteScreen===true && 'active'}`} onClick={()=>setIsCompleteScreen(true)}>Completed</button>
        </div>

        <div className="todo-list">

          {isCompleteScreen===false && allTodos.map((item,index)=>{
            return(
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <div>
                  <AiOutlineDelete className='icon' onClick={()=>handleDeleteTodo(index)} title="Delete?"/>
                  <BsCheckLg className='check-icon' onClick={()=>handleCompleted(index)} title="Complete?"/>
                </div>
              </div>
            );
          })}

          {isCompleteScreen===true && completedTodos.map((item, index)=>{
            return(
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p><small>Completed on: {item.completedOn}</small></p>
                </div>
                <div>
                  <AiOutlineDelete className='icon' onClick={()=>handleDeleteCompletedTodo(index)} title="Delete?"/>
                </div>
              </div>
            )
          })}

        </div>
      </div>
    </div>
  );
}

export default App;