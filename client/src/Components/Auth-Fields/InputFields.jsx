import { useState } from 'react';
import './inputFields.css'

const InputFields = (props) => {
    const {label, onChange, name, type, handleBlur, error, id, inputProps} = props;

    return (
        <div className="form-group">
            <label>{label}</label>
            <input {...inputProps} type={type} name={name} onBlur={handleBlur} onChange={onChange}/>
            {<span>{error}</span>}
        </div>
    )
}

export default InputFields;
