// App.js
import { useEffect, useState } from 'react';
import { CiLogout } from "react-icons/ci";
import { IoSettings } from 'react-icons/io5';
import './App.css';
import AddForm from '../components/addForm';
import Profile from '../components/profile';
import { db, auth } from '../firebase';
import { collection, addDoc, setDoc, getCountFromServer, doc, onSnapshot, query, deleteDoc, getDoc, where, getDocs } from 'firebase/firestore';
import Modal from '../components/modal';
import { Link } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import ProfileDropDown from '../components/profileDropDown';
import profileDropDown from '../components/profileDropDown';
import { settings } from 'firebase/analytics';


function App() {
  const [todos, setTodos] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [userDocID, setUserDocID] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getUserDocID() {
    const user = auth.currentUser;
    if (!user) {
      console.log("User not authenticated.");
      return null;
    }

    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size === 0) {
      console.log("No matching documents found.");
      return null;
    }

    return querySnapshot.docs[0].id;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        document.getElementById('not_signed_in').showModal();
        setLoading(true); // Set loading to false when user is not authenticated
      } else {
        getUserDocID().then((id) => {
          setUserDocID(id);
        });
        setLoading(false); // Set loading to false when user is authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userDocID) {
      try {
        const q = query(collection(db, 'users', userDocID, 'todoTasks'));
        onSnapshot(q, (querySnapShot) => {
          setTodos(querySnapShot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })))
        });
      } catch (err) {
        alert(err);
      }
    }
  }, [userDocID]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (newItem === '') {
      document.getElementById('my_modal_1').showModal();
    } else {
      var UUID = crypto.randomUUID();
      try {
        await setDoc(doc(db, 'users', userDocID, 'todoTasks', UUID), {
          title: newItem,
          completed: false
        });
      } catch (err) {
        alert(err)
      }
      setNewItem('');
    }
  }

  async function deleteTodo(id) {
    try {
      await deleteDoc(doc(db, 'users', userDocID, 'todoTasks', id));
      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== id)
      );
    } catch (err) {
      alert(err);
    }
  }

  function filterTodoCompleted(bool) {
    setShowCompleted(bool);
  }

  async function toggleTodo(id, title, completed) {
    try {
      await setDoc(doc(db, 'users', userDocID, 'todoTasks', id), {
        title: title,
        completed: completed
      });
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? { ...todo, completed } : todo
        )
      );
    } catch (err) {
      alert(err);
    }
  }

  function handleEdit(id) {
    const todoToEdit = todos.find((todo) => todo.id === id);
    setEditingTodo(todoToEdit);
  }

  async function handleEditSubmit() {
    try {
      await setDoc(doc(db, 'users', userDocID, 'todoTasks', editingTodo.id), {
        title: editingTodo.title,
        completed: editingTodo.completed
      });
      setEditingTodo(null);
    } catch (err) {
      alert(err);
    }
  }

  function cancelEdit() {
    setEditingTodo(null);
  }

  function logOut() {
    auth.signOut();
    window.location.href = "/";
  }

  function account(){
    window.location.href = "/account"
  }

  const filteredTodos = showCompleted ? todos.filter((todo) => todo.completed) : todos;
  console.log(auth.currentUser)
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col m-8">
          <AddForm newItem={newItem} setNewItem={setNewItem} handleSubmit={handleSubmit} />
          <div className='flex flex-row gap-4 justify-end m-4'>
            <input
              className='checkbox'
              type="checkbox"
              onChange={(e) => filterTodoCompleted(e.target.checked)}
              checked={showCompleted}
            />
            <span>Completed Tasks</span>
          </div>
          <ul className="flex-1 flex-row">
            <div className=''>
              {filteredTodos.map((todo, id) => (
                <li key={id} className='my-2'>
                  <div className='flex items-center justify-between p-4 bg-red-400 rounded-md task'>
                    <div className="flex items-center">
                      <input
                        className='checkbox mr-4'
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id, todo.title, !todo.completed)}
                      />
                      {/* Edit Input Field / Todo Title */}
                      {editingTodo && editingTodo.id === todo.id ? (
                        <input
                          className='input text-xl'
                          type="text"
                          value={editingTodo.title}
                          onChange={(e) => setEditingTodo({...editingTodo, title: e.target.value})}
                        />
                      ) : (
                        <label className="ml-2 text-xl">{todo.title}</label>
                      )}
                    </div>
                    <div className='justify-between'>
                      {/* Edit/View Mode Todo */}
                      {editingTodo && editingTodo.id === todo.id ? (
                        <>
                          <button className="btn btn-outline btn-warning mx-4" onClick={cancelEdit}>Cancel</button>
                          <button className="btn btn-primary" onClick={handleEditSubmit}>Save</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-outline btn-warning mx-4" onClick={() => handleEdit(todo.id)}>Edit</button>
                          <button className="btn btn-error" onClick={() => deleteTodo(todo.id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </ul>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu min-h-full drawer-color text-base-content justify-between">
            <li>
              {loading ? (<profileDropDown />):(<ProfileDropDown email = {auth.currentUser.email} username={auth.currentUser.displayName} profpic= {auth.currentUser.photoURL} logout = {logOut}/>)}
            </li>
              <li>
              <button className='flex justify-between h-16 text-3xl items-center lg:hidden' onClick={account}>
                  <IoSettings className=' ' />
                  <span className='font-bold text-2xl'>Settings</span>
              </button>
                <button className='flex justify-between h-16 text-3xl items-center lg:hidden'>
                  <CiLogout className='text-red-400' />
                  <span className='font-bold text-2xl' onClick={logOut}>Logout</span>
                </button>
              </li>
              <li className='p-0 m-0 sm:hidden lg:block'>
                <a className = "p-0" href = "https://www.youtube-nocookie.com/embed/_e9yMqmXWo0?playlist=_e9yMqmXWo0&autoplay=1&iv_load_policy=3&loop=1&start="><img className = {"w-72 p-0 rounded-md"}src = "https://media1.tenor.com/m/Jc9jT66AJRwAAAAd/chipi-chipi-chapa-chapa.gif"></img></a>
              </li>
          </ul>
        </div>
      </div>

      <Modal id = {"my_modal_1"} title = {"Warning"} desc = {"You didn't put anything in the add form."} />
      <Modal id = {"not_signed_in"} title = {"Error"} desc = {"You have not logged in yet."} onClick = {logOut} />
    </>
  );
}

export default App;
