import React from "react";
import { Outlet, Link } from "react-router-dom";
function ApplicationApprovalComponent(props) {
  return (
    <div id="approver">
      <h1>
        {props.info.owner["lastname"]}, {props.info.owner["firstname"]}
      </h1>
      <h1>{props.info.status}</h1>
      <p>
        Github Link:<a href={`${props.info.student_submission.remark}`}>{props.info.student_submission.remark}</a>
      </p>
    </div>
  );
}

export default ApplicationApprovalComponent;
