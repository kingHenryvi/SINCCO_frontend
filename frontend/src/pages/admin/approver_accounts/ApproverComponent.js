import React from "react";

function ApproverComponent(props) {
  return (
    <div id="approver">
      <h1>
        {props.info.lastname}, {props.info.firstname}
      </h1>
      <h1>{props.info.userType}</h1>
      <h1>{props.info.email}</h1>
    </div>
  );
}

export default ApproverComponent;
