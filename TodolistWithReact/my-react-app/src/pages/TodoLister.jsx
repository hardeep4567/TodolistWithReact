import React, { useState, useEffect } from "react";
import {toast} from "react-toastify"

export default function TodoList2() {
  const [listdata, setListData] = useState([]); // Main task list
  const [inputText, setInputText] = useState(""); // Input text
  const [addtask, settask] = useState(true); // Add button visibility
  const [savetask, setsave] = useState(false); // Save button visibility
  const [editIndex, setEditIndex] = useState(null); // Edit task index

  
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("local")) || [];
    if (storedTasks.length > 0) {
      setListData(storedTasks);
    }
  }, []);


  useEffect(() => {
    if (listdata.length > 0) {
      localStorage.setItem("local", JSON.stringify(listdata));
    }
  }, [listdata]);

  
  const addtasking = (e) => {
    e.preventDefault();
    if (inputText.trim() === "") {
      toast.error("Task cannot be empty!")
      return;
    }
    const updatedTasks = [...listdata, inputText];
    setListData(updatedTasks);
    setInputText(""); 
  };

  // 🗑️ Delete Task
  const deleting = (index) => {
    const updatedTasks = listdata.filter((_, i) => i !== index);
    setListData(updatedTasks);
    reset(); 
  };

  const editing = (index) => {
    settask(false); // Hide "Add Task" button
    setInputText(listdata[index]); // Set task value in input
    setsave(true); // Show "Save" button
    setEditIndex(index); // Store index to modify later
  };


  const saving = () => {
    if (inputText.trim() === "") {
      alert("Task cannot be empty!");
      return;
    }
    const updatedTasks = listdata.map((task, i) =>
      i === editIndex ? inputText : task
    );
    setListData(updatedTasks);
    reset(); 
  };
  const reset = () => {
    settask(true);
    setsave(false);
    setInputText("");
    setEditIndex(null);
  };
  return (
    <>
      <h1 className="text-center text-light">TODO LIST</h1>
      <div className="justify-content-center d-flex mt-5 gap-2 text-light">
        <input
          type="text"
          className="me-2 rounded-1 border-0 px-5 fw-medium fs ms-2"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add a task..."
        />
        {addtask && (
          <button
            className="py-1 bg-success bg-opacity-25 border border-2 rounded-3 border-white fw-medium fst-italic text-white tasker"
            onClick={addtasking}
          >
            Add Task
          </button>
        )}

        {savetask && (
          <button
            className="py-1 bg-success bg-opacity-25 border border-2 rounded-3 border-white fw-medium fst-italic"
            onClick={saving}
          >
            Save
          </button>
        )}
      </div>

      {/* Task List */}
      <ol>
        {listdata.map((data, index) => (
          <div key={index} className="d-flex justify-content-center gap-2">
            <div className="d-flex fw-medium fst-italic mt-2 gap-2 w-25 rounded-3 list-div py-2 px-4 text-white">
              <li>{data}</li>
            </div>

            {/* Delete Button */}
            <button className="border-0" onClick={() => deleting(index)}>
              <i className="fa-solid fa-trash-can text-danger"></i>
            </button>

            {/* Edit Button */}
            <button className="border-0" onClick={() => editing(index)}>
              <i className="fa-solid fa-pen-to-square text-warning"></i>
            </button>
          </div>
        ))}
      </ol>
    </>
  );
}
