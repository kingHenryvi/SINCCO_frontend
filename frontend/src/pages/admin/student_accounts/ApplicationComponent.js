import React from "react";

function ApplicationComponent(props) {
  return (
    <div id="application">
      <h1>
        {props.info.lastname}, {props.info.firstname}
      </h1>
      <h1>{props.info.stdnum}</h1>
      <h1>{props.status}</h1>
      <h3>{props.date}</h3>
    </div>
  );
}

export default ApplicationComponent;
