import React, {useState} from "react";
import ReactDOM from "react-dom";

function Block ({ children }) {
  const [fieldsStates, setFieldsStates] = useState({
    flag: true,
    numberValue: 123
  });

  if ( !children ) {
    console.warn("block must have a children");
  } else {
    const data = {
      fields: {},
      action: null,
      actionData: {},
    };

    const onClick = async () => {
      console.log('onClick');

      if ( data.action ) {
        Object.entries(data.fields).forEach(([name, component]) => {
          data.actionData[name] = component.value;
        });
      } else {
        // warning
      }

      const result = await data.action(fieldsStates);

      console.log('set response', result);

      setFieldsStates(result);
    };

    children = children.map(child  => {
      switch ( child.type ) {
        case Button:
          data.action = child.props.action;
          child = React.cloneElement(child, {onClick, fieldsStates, setFieldsStates});
          return child;

        case Field:     
          child = React.cloneElement(child, {fieldsStates, setFieldsStates});
          return child;

        default:
          console.error('unknown Field type');
          return child;
      }
    });
  }

  return <div className="block">{children}</div>;
}

function Field({ type, name, label, fieldsStates, setFieldsStates }) {
  const onCheckboxChange = event => {
    event.persist();
    console.log(event.target.value);

    setFieldsStates(prev => {
      return {
        ...prev,
        [name]: event.target.checked
      };
    });
  };
  const onNumberChange = event => {
    console.log(event.target);
    // onChange({name, type: 'number', value: event.target.value})
    setFieldsStates(prev => {
      return {
        ...prev,
        [name]: event.target.value
      };
    });
  };

  switch ( type ) {
    case 'boolean':
      return (
        <div className="field">
          <label>{label}</label>
          <input onChange={onCheckboxChange} checked={fieldsStates[name]} type="checkbox" name={name} />
        </div>
      );

    default:
      return (
        <div className="field">
          <label>{label}</label>
          <input onChange={onNumberChange} value={fieldsStates[name]} type="number" name={name} />
        </div>
      );
  }
}

function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

const action = async data => {
  console.log('Action', data);
  data = {...data};
  data.flag = !data.flag;
  data.numberValue = data.numberValue * data.numberValue;

  return data;
};

function App( props ) {
  return (
    <div className="App">
      <Block>
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
ReactDOM.render(<App/>, rootElement);
