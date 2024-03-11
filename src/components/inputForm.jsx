import React from 'react';

function InputForm({label, type, value, onChange}){
    return (<>
    <label className="text-gray-500 block">{label}
          <input
            required
            type={type}
            value ={value}
            className="input input-bordered w-full max-w-xs bg-white"
            onChange={onChange} />
    </label>
    </>);
}

export default InputForm;