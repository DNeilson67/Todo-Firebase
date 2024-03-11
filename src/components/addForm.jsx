import React from 'react';
import { IoHomeOutline } from "react-icons/io5";

function addForm({ newItem, setNewItem, handleSubmit }) {
  return (
    <div className='flex flex-row items-center justify-between my-4'>
      <div className='flex flex-row gap-4 blue'>
      <label htmlFor="my-drawer-2" className= 'drawer-label'><IoHomeOutline className = "text-3xl"/></label>
      <h1 className="header text-3xl font-bold">Tasks</h1>
      </div>
      <form className="new-item-form">
        <div className="flex flex-row gap-4">
          <input
            className="input input-bordered w-full max-w-xs"
            type="text"
            id="item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSubmit}>
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default addForm;
