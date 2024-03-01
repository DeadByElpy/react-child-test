import React from "react";
import ReactDOM from "react-dom";
import {useState} from 'react';

function Block({ children }) {
  if (!children) {
    console.warn("block must have a children");
  } else {
    const data = {
      fields: {},
      action: null,
      states: {},
      actionData: {}
    };




    const onClick = () => {
      console.log('onClick');
      if ( data.action ) {
        Object.entries(data.fields).forEach(([name, component]) => {
          console.log(component.value);
          data.actionData[name] = component.value;
        });
      } else {
        // warning
      }

      console.log(data.actionData);
      data.action(data.actionData);
    };

    children = children.map((child) => {
      switch ( child.type ) {
        case Button:
          if ( React.isValidElement(child) ) {
            data.action = child.props.action;
            child = React.cloneElement(child, {onClick});
            return child;
          }
          break;

        case Field:
          data.states[child.props.name] = useState(0);
          data.fields[child.props.name] = child;
          return child;

        default: 
          console.error('unknown Field type');
          return child;
      }
    });
  }

  return <div className="block">{children}</div>;
}

function Field({ type, name, label }) {
  switch (type) {
    case "boolean":
      return (
        <div className="field">
          <label>{label}</label>
          <input type="checkbox" name={name} />
        </div>
      );

    default:
      return (
        <div className="field">
          <label>{label}</label>
          <input type="number" name={name} />
        </div>
      );
  }
}

function Button({ children, action, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

const action = () => {
  console.log("ACTION!");
};

function App(props) {
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
