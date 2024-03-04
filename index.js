import React from "react";
import ReactDOM from "react-dom";

function Block ({ children }) {
  if ( !children ) {
    console.warn("block must have a children");
  } else {
    const data = {
      fields: {},
      action: null,
      actionData: {}
    };

    const onClick = () => {
      console.log('onClick');
      if ( data.action ) {
        Object.entries(data.fields).forEach(([name, component]) => {
          data.actionData[name] = component.value;
        });
      } else {
        // warning
      }

      data.action(data.actionData);
    };    
    const onChange = ({ name, type, value } ) => {
      if ( type === 'number' ) {
        value = Number(value);
      }

      data.actionData[name] = value;
    };     

    children = children.map(child => {
      switch ( child.type ) {
        case Button:
          data.action = child.props.action;
          child = React.cloneElement(child, {onClick});
          return child;

        case Field:          
          child = React.cloneElement(child, {onChange});
          return child;

        default: 
          console.error('unknown Field type');
          return child;
      }
    });
  }

  return <div className="block">{children}</div>;
}

function Field({ type, name, label, onChange }) {
  const onCheckboxChange = event => {
    onChange({name, type: 'boolean', value: event.target.checked})
  };
  const onNumberChange = event => {
    onChange({name, type: 'number', value: event.target.value})
  };

  switch ( type ) {
    case 'boolean':
      return (
        <div className="field">
          <label>{label}</label>
          <input onInput={onCheckboxChange} type="checkbox" name={name} />
        </div>
      );

    default:
      return (
        <div className="field">
          <label>{label}</label>
          <input onInput={onNumberChange} type="number" name={name} />
        </div>
      );
  }
}

function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

const action = data => {
  console.log("ACTION!", data);
};

function App( props ) {
  return (
    <div className="App">
      <Block asd="1">
        <Field type="boolean" label="Enable/disable flag" name="flag"></Field>
        <Field type="number" label="Input number value" name="numberValue"></Field>
        <Button action={action}>Click to act</Button>
      </Block>
    </div>
  );
}

// Log to console
console.clear('');

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
