const InputFields = (props) => {
    const { fields } = props;
    return fields.map((field) => {
        return <div>
            <input key={field.id} placeholder={field.placeholder} name={field.name} type={field.type} />
            <label htmlFor={field.label}>{field.label}</label>
        </div>
    })
}

export default InputFields;
