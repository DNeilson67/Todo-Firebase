function Button({ value, email, password, handleSubmit}) {
  return (
    <button
      className="btn btn-primary w-full" onClick = {handleSubmit}>
      {value}
    </button>
  );
}

export default Button;