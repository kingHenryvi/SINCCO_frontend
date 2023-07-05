import { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function ApplicationProcess() {
  const userID = sessionStorage.getItem("userID");
  const [user, setUser] = useState("init_user");
  const [applications, setApplications] = useState([]);
  const [currentScreen, setCurrentScreen] = useState("None");
  const [appInProcess, setAppInProcess] = useState("init_app");
  const [appviewed, setAppViewed] = useState(false);
  const [appViewing, setAppViewing] = useState("None");
  const [viewedApplication, setViewedApplication] = useState("None")
  const [link, setLink] = useState("");
  const [remark, setRemark] = useState("");
  const [adviserName, setAdviserName] = useState("Adviser");
  const [clearanceOfficerName, setClearanceOfficerName] = useState("Clearance Officer");

  useEffect(() => {
    fetch("http://localhost:3001/get-student-by-user-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectID: userID }),
    })
      .then((response) => response.json())
      .then((body) => {
        setUser(body);
        fetch("http://localhost:3001/get-approver-by-id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adviserID: body.adviser }),
        })
          .then((response) => response.json())
          .then((body) => {
            setAdviserName(`${body.firstname} ${body.middlename} ${body.lastname}`);
          });
        fetch("http://localhost:3001/get-admin-name")
          .then((response) => response.json())
          .then((body) => {
            setClearanceOfficerName(`${body.firstname} ${body.middlename} ${body.lastname}`);
          });

      });

    fetch("http://localhost:3001/get-all-applications-of-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectID: userID }),
    })
      .then((response) => response.json())
      .then((body) => {
        setApplications(body);
        setCurrentScreen("Closed");
        body.map((application) => {
          if (application.status === "Pending") {
            setCurrentScreen("Pending");
            setAppInProcess(application);
          } else if (application.status === "Open") {
            setCurrentScreen("Open");
            setAppInProcess(application);
          }
        });
      });
  }, []);

  function viewApplication(i, application) {
    if (document.getElementById("submission-link") != undefined || document.getElementById("submission-link") != null) {
      setLink(document.getElementById("submission-link").value);
    } else {
      setLink("");
    }
    if (document.getElementById("remark") != undefined || document.getElementById("remark") != undefined) {
      setRemark(document.getElementById("remark").value);
    } else {
      setRemark("");
    }
    if (appViewing !== i) {
      setAppViewing(i);
      setAppViewed(true);
      setViewedApplication(application);
      console.log("Viewing An Application");
    } else {
      setAppViewing("None");
      setAppViewed(false);
      setViewedApplication("None")
      console.log("Viewing An Application Closed");
    }
    console.log(link);
  }

  function ShowList() {
    const copy = applications.map(item => item).reverse();
    if (currentScreen != "None") {
      if (copy.length !== 0)
        return (
          <div id="sap-app-list-items-cell">
            {copy.map((application, i) => {
              let stepequivalent;
              if (copy.step == 1) stepequivalent = "On Approver";
              else if (copy.step == 2) stepequivalent = "On Clearance Officer";
              else {
                stepequivalent = "Already Cleared";
              }

              if (appViewing != i) {
                return (
                  <div
                    key={i}
                    id={`app-list-item-${i}`}
                    className="sap-app-list-items-row"
                    style={{ alignItems: "center" }}
                    onClick={() => {
                      viewApplication(i, application);
                    }}
                  >
                    <CircleStatus data={application.status} />
                    <button className="sap-app-list-items-row-id" style={{ textAlign: "left", paddingLeft: "7px" }}>
                      {application._id}
                    </button>
                  </div>
                );
              } else {
                return (
                  <div
                    key={i}
                    id={`app-list-item-${i}`}
                    className="sap-app-list-items-row"
                    style={{ color: "white", alignItems: "center" }}
                    onClick={() => {
                      viewApplication(i);
                    }}
                  >
                    <CircleStatus data={application.status} />
                    <button className="sap-app-list-items-row-id" style={{ textAlign: "left", paddingLeft: "7px" }}>
                      {application._id}
                    </button>
                  </div>
                );
              }
            })}
          </div>
        );
      else
        return (
          <>
            <div style={{ display: "flex", justifyContent: "center", padding: "20px", width: "88%" }}>
              No Application Yet
            </div>
          </>
        );
    }
  }

  function CircleStatus(props) {
    console.log(props.data);
    if (props.data === "Open") {
      return <div style={{ backgroundColor: "green", height: "7px", width: "7px", borderRadius: "30px" }} />
    }
    if (props.data === "Pending") {
      return <div style={{ backgroundColor: "orange", height: "7px", width: "7px", borderRadius: "30px" }} />
    }
    if (props.data === "Closed") {
      return <div style={{ backgroundColor: "red", height: "7px", width: "7px", borderRadius: "30px" }} />
    }
    if (props.data === "Cleared") {
      return <div style={{ backgroundColor: "purple", height: "7px", width: "7px", borderRadius: "30px" }} />
    }
  }

  function closeApplication() {
    fetch("http://localhost:3001/edit-application-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectID: appInProcess._id, status: "Closed" }),
    })
      .then(() => {
        setAppInProcess("init_app")
        setCurrentScreen("Closed");
        setLink("");
        setRemark("");
        fetch("http://localhost:3001/get-all-applications-of-student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ objectID: userID }),
        })
          .then((response) => response.json())
          .then((body) => {
            setApplications(body);
            body.map((application, i) => {
              if (application.status === "Pending") {
                setCurrentScreen("Pending");
                setAppInProcess(application);
              } else if (application.status === "Open") {
                setCurrentScreen("Open");
                setAppInProcess(application);
              }
              if (i === body.length - 1 && appViewing === 0) {
                setAppViewing(0);
                setViewedApplication(application)
              }
            });
          });
      });
  }

  function AppProcessMainHeader() {
    console.log(appInProcess);
    if (appInProcess !== "init_app") {
      let stepequivalent;
      if (appInProcess.step == 1) stepequivalent = "On Approver";
      else if (appInProcess.step == 2) stepequivalent = "On Clearance Officer";
      else {
        stepequivalent = "Already Cleared";
      }
      return (
        <div id="sap-app-process-inner-div-process-header">
          <div id="sap-app-process-inner-div-process-title">
            <div id="sap-app-process-inner-div-process-title-bottom">
              <div id="sap-app-process-inner-div-process-title-info-circlestat">
                {appInProcess._id}
                <CircleStatus data={appInProcess.status} />
              </div>
              <div className="sap-app-process-inner-div-process-title-info">{stepequivalent}</div>
            </div>
            <button
              className="sap-app-process-inner-div-process-application-button"
              onClick={
                closeApplication
              }
            >
              Close
            </button>
          </div>
        </div>
      );
    }
    else {
      return (
        <div id="sap-app-process-inner-div-process-header">
          <div id="sap-app-process-inner-div-process-title">
            <div id="sap-app-process-inner-div-process-title-bottom">
              <div id="sap-app-process-inner-div-process-title-info-circlestat">
                New Application
                <CircleStatus data={"Open"} />
              </div>
              <div className="sap-app-process-inner-div-process-title-info">On Approver</div>
            </div>
            <button
              className="sap-app-process-inner-div-process-application-button"
              onClick={
                () => {
                  setCurrentScreen("Closed");
                  setLink("");
                  setRemark("");
                }
              }
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }
  }

  function input() {
    if (document.getElementById("submission-link") === null) return null;
    else {
      return document.getElementById("submission-link").value;
    }
  }

  // studentID, ssRemark, ssLink, ssDate, firstname, middlename, lastname
  function submitApplication() {
    if (document.getElementById("submission-link") !== undefined && (appInProcess === "init_app" || appInProcess.step === 1) && document.getElementById("submission-link").value === "") {
      alert("Please enter your GitHub link.")
      console.log("invalid");
    }
    else if (appInProcess === "init_app") {
      fetch("http://localhost:3001/add-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stdnum: user.stdnum,
          ssLink: document.getElementById("submission-link").value,
          ssRemark: document.getElementById("remark").value,
          ownerID: user._id,
          adviserID: user.adviser,
          ssDate: new Date(),
          firstname: user.firstname,
          middlename: user.middlename,
          lastname: user.lastname,
        }),
      })
        .then((response) => response.json())
        .then((body) => {
          // setUser(body);
          // console.log(body);
          fetch("http://localhost:3001/get-all-applications-of-student", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ objectID: userID }),
          })
            .then((response) => response.json())
            .then((body) => {
              setApplications(body);
              setCurrentScreen("Closed");
              body.map((application) => {
                if (application.status === "Pending") {
                  setCurrentScreen("Pending");
                  setAppInProcess(application);
                } else if (application.status === "Open") {
                  setCurrentScreen("Open");
                  setAppInProcess(application);
                }
                if (appViewing !== "None") {
                  setAppViewing(appViewing + 1);
                }
              });
            });
        });
    } else {
      console.log("resubmitting");
      fetch("http://localhost:3001/resubmit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appID: appInProcess._id,
          ssLink: input(),
          ssRemark: document.getElementById("remark").value,
          ssDate: new Date(),
          ssStepgiven: appInProcess.step
        }),
      })
        .then((response) => response.json())
        .then((body) => {
          // setUser(body);
          // console.log(body);
          fetch("http://localhost:3001/get-all-applications-of-student", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ objectID: userID }),
          })
            .then((response) => response.json())
            .then((body) => {
              setApplications(body);
              setCurrentScreen("Closed");
              body.map((application) => {
                if (application.status === "Pending") {
                  setCurrentScreen("Pending");
                  setAppInProcess(application);
                } else if (application.status === "Open") {
                  setCurrentScreen("Open");
                  setAppInProcess(application);
                }
              });
            });
        });
    }
    console.log("Submitted!");
  }

  function AppProcessMainContent() {
    if (currentScreen === "Open") {
      if (appInProcess.step === 1 || appInProcess === "init_app") {
        return (
          <div id="sap-app-process-inner-div-process-content">
            <div className="sap-app-process-inner-div-process-content-input">
              <div style={{ paddingBottom: "10px" }}>Submission Link:</div>
              <textarea defaultValue={link} placeholder="Enter Submission Link" id="submission-link" className="sap-app-process-inner-div-process-content-input-textarea" />
            </div>
            <div className="sap-app-process-inner-div-process-content-input">
              <div style={{ paddingBottom: "10px" }}>Remark:</div>
              <textarea defaultValue={remark} placeholder="Enter Remark" id="remark" className="sap-app-process-inner-div-process-content-input-textarea" />
            </div>
            <div id="sap-app-process-inner-div-process-application-button-div">
              <button className="sap-app-process-inner-div-process-application-button" onClick={submitApplication}>
                Submit
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div id="sap-app-process-inner-div-process-content">
            <div className="sap-app-process-inner-div-process-content-input">
              <div style={{ paddingBottom: "10px" }}>Remark:</div>
              <textarea defaultValue={remark} id="remark" className="sap-app-process-inner-div-process-content-input-textarea" style={{ height: "40vh" }} />
            </div>
            <div id="sap-app-process-inner-div-process-application-button-div">
              <button className="sap-app-process-inner-div-process-application-button" onClick={submitApplication}>
                Submit
              </button>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div id="sap-app-process-inner-div-process-content" style={{ justifyContent: "center", alignItems: "center" }}>
          Waiting for approval
          <button className="sap-app-process-inner-div-process-application-button" style={{ marginTop: "10px", width: "135px" }} onClick={() => {
            setAppViewed(true);
            setAppViewing(0);
            setViewedApplication(appInProcess)
          }}>
            View Application
          </button>
        </div>);
    }
  }

  function AppProcessMain() {
    if (currentScreen === "Pending" || currentScreen === "Open") {
      return (
        <div id="sap-app-process-inner-div-process" >
          <AppProcessMainHeader />
          <AppProcessMainContent />
        </div>
      );
    } else {
      return (
        <div id="sap-app-process-inner-div-open">
          <button
            style={{ height: "30px", width: "160px" }}
            className="sap-app-process-inner-div-process-application-button "
            onClick={() => {
              setCurrentScreen("Open");
            }}
          >
            Open Application
          </button>
        </div>
      );
    }
  }

  function RemarkByOfficer(props) {
    var index = props.index;

    if (viewedApplication.status === "Cleared" && viewedApplication.student_submission[index + 1] === undefined) {
      return (
        <div style={{ paddingTop: "30px" }}>
          <div style={{ maxWidth: "100%", wordWrap: "break-word", fontWeight: "bold" }}>
            Approved By Clearance Officer on {new Date(viewedApplication.remarks[index].date).toLocaleDateString()}
          </div>
          <div style={{ maxWidth: "100%", paddingLeft: "15px", paddingTop: "7px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ minWidth: "85px" }}>
                Remark:
              </div >
              <div style={{ maxWidth: "18vw", wordWrap: "break-word" }}>
                {viewedApplication.remarks[index + 1].remark}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ minWidth: "85px" }}>
                Commenter:
              </div >
              <div style={{ maxWidth: "18vw", wordWrap: "break-word" }}>
                {clearanceOfficerName}
              </div>
            </div>
          </div>
        </div>
      );
    }
    else if (viewedApplication.remarks[index + 1] !== undefined && viewedApplication.remarks[index + 1].stepgiven === 2) {
      return (
        <div style={{ paddingTop: "30px" }}>
          <div style={{ maxWidth: "100%", wordWrap: "break-word", fontWeight: "bold" }}>
            Returned By Clearance Officer on {new Date(viewedApplication.remarks[index].date).toLocaleDateString()}
          </div>
          <div style={{ maxWidth: "100%", paddingLeft: "15px", paddingTop: "7px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ minWidth: "85px" }}>
                Remark:
              </div >
              <div style={{ maxWidth: "18vw", wordWrap: "break-word" }}>
                {viewedApplication.remarks[index + 1].remark}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ minWidth: "85px" }}>
                Commenter:
              </div >
              <div style={{ maxWidth: "18vw", wordWrap: "break-word" }}>
                {clearanceOfficerName}
              </div>
            </div>
          </div>
        </div>
      );
    }
    else if (viewedApplication.status !== "Closed" && viewedApplication.step === 2 && viewedApplication.student_submission.length === viewedApplication.remarks.length) {
      return (
        <div style={{ paddingTop: "30px" }}>
          <div style={{ maxWidth: "100%", wordWrap: "break-word", fontWeight: "bold" }}>
            Waiting For Approval
          </div>
        </div>
      );
    }
    else if (viewedApplication.status === "Closed" && viewedApplication.step === 2 && viewedApplication.remarks[index + 1] === undefined) {
      return (
        <div style={{ paddingTop: "30px" }}>
          <div style={{ maxWidth: "100%", wordWrap: "break-word", fontWeight: "bold" }}>
            Application Closed
          </div>
        </div>
      );
    }
    // else if ((viewedApplication.student_submission.length < viewedApplication.remarks.length && viewedApplication.status === "Cleared" && viewedApplication.student_submission[index + 1] === undefined)) {

    // } else {

    // }
  }

  function RemarkByApprover(props) {
    var index = props.index;

    if (viewedApplication.remarks[index] !== undefined && viewedApplication.remarks[index].stepgiven === 1) {
      let stepequivalent;
      if (viewedApplication.step !== 1 && (viewedApplication.remarks[index + 1] === undefined || (viewedApplication.remarks[index + 1].stepgiven !== 1))) stepequivalent = "Approved By Approver";
      else stepequivalent = "Returned By Approver";

      return (
        <div style={{ paddingTop: "30px" }}>
          <div style={{ maxWidth: "100%", wordWrap: "break-word", fontWeight: "bold" }}>
            {stepequivalent} on {new Date(viewedApplication.remarks[index].date).toLocaleDateString()}
          </div>
          <div style={{ maxWidth: "100%", paddingLeft: "15px", paddingTop: "7px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ minWidth: "85px" }}>
                Remark:
              </div >
              <div style={{ maxWidth: "18vw", wordWrap: "break-word" }}>
                {viewedApplication.remarks[index].remark}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ minWidth: "85px" }}>
                Commenter:
              </div >
              <div style={{ maxWidth: "18vw", wordWrap: "break-word" }}>
                {adviserName}
              </div>
            </div>
          </div>
        </div>
      );
    }
    else if (viewedApplication.step === 1 && viewedApplication.remarks[index] === undefined && viewedApplication.status !== "Closed") {
      return (
        <div style={{ paddingTop: "30px" }}>
          <div style={{ maxWidth: "100%", wordWrap: "break-word", fontWeight: "bold" }}>
            Waiting For Approval
          </div>
        </div>
      );
    }
    else if (viewedApplication.status === "Closed" && viewedApplication.student_submission[index].stepgiven === 1) {
      return (
        <div style={{ paddingTop: "30px" }}>
          <div style={{ maxWidth: "100%", wordWrap: "break-word", fontWeight: "bold" }}>
            Application Closed
          </div>
        </div>
      );
    }
  }

  function SubmissionLink(props) {
    if (props.stepequivalent === "Approver") {
      return (
        <div style={{ display: "flex", maxWidth: "100%" }}>
          <div style={{ minWidth: "85px", maxWidth: "85px", wordWrap: "break-word" }}>
            Link:
          </div >
          <a href={props.github} style={{ color: "#fec030", maxWidth: "18vw", wordWrap: "break-word" }}>
            {props.github}
          </a>
        </div>
      );
    }
  }

  function SubmissionAppClosed() {
    if (viewedApplication.status === "Cleared") {
      return (
        <>
          <div style={{ marginTop: "9px", backgroundColor: "rgb(57, 54, 70)", minHeight: "1px", width: "94%" }} />
          <div style={{ maxWidth: "100%", wordWrap: "break-word", fontWeight: "bold", paddingTop: "10px" }}>
            Application Cleared
          </div>
        </>
      );
    }
    else if (viewedApplication.status === "Closed"
      && (((viewedApplication.student_submission.length === viewedApplication.remarks.length) && viewedApplication.step === 1)
        || (viewedApplication.student_submission.length < viewedApplication.remarks.length && viewedApplication.step === 2))) {
      return (
        <>
          <div style={{ marginTop: "9px", backgroundColor: "rgb(57, 54, 70)", minHeight: "1px", width: "94%" }} />
          <div style={{ maxWidth: "100%", wordWrap: "break-word", fontWeight: "bold", paddingTop: "10px" }}>
            Application Closed
          </div>
        </>
      );
    }
  }

  function Submission(props) {
    const entry = props.entry;
    const stepequivalent = props.stepequivalent;

    return (
      <div style={{ paddingTop: "10px" }}>
        <div style={{ maxWidth: "100%", wordWrap: "break-word", fontWeight: "bold" }}>
          Submitted to {stepequivalent} on {new Date(entry.date).toLocaleDateString()}
        </div>
        <div style={{ maxWidth: "100%", paddingLeft: "15px", paddingTop: "7px" }}>
          <SubmissionLink stepequivalent={stepequivalent} github={entry.github} />
          <div style={{ display: "flex" }}>
            <div style={{ minWidth: "85px" }}>
              Remark:
            </div >
            <div style={{ maxWidth: "18vw", wordWrap: "break-word" }}>
              {entry.remark}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function RemarkSystem(props) {
    const stepequivalent = props.stepequivalent;
    const entry = props.entry;
    const index = props.index;

    if (entry.stepgiven === 1 && viewedApplication.step !== 1 && (viewedApplication.remarks[index + 1] === undefined || viewedApplication.remarks[index + 1].stepgiven !== 1)) {
      return (
        <>
          <div style={{ marginTop: "10px", backgroundColor: "rgb(57, 54, 70)", minHeight: "1px", width: "94%" }} />
          <Submission stepequivalent={stepequivalent} entry={entry} />
          <RemarkByApprover index={index} />
          <div style={{ marginTop: "10px", backgroundColor: "rgb(57, 54, 70)", minHeight: "1px", width: "94%" }} />
          <div style={{ maxWidth: "100%", wordWrap: "break-word", fontWeight: "bold", marginTop: "10px" }}>
            Sent To Clearance Officer
          </div>
          <RemarkByOfficer index={index} />
        </>
      );
    } else {
      return (
        <>
          <div style={{ marginTop: "10px", backgroundColor: "rgb(57, 54, 70)", minHeight: "1px", width: "94%" }} />
          <Submission stepequivalent={stepequivalent} entry={entry} />
          <RemarkByApprover index={index} />
          <RemarkByOfficer index={index} />
        </>
      );
    }
  }

  function SubmissionRemark() {
    if (viewedApplication.status === "Cleared") {
      return (
        <div className="sap-app-list-view-info" style={{ marginTop: "10px", width: "100%", height: "46%", overflowY: "auto", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", paddingLeft: "15px" }}>
          <div style={{ fontWeight: "bold", paddingTop: "10px", fontSize: "14px" }}>
            SUBMISSIONS AND REMARKS
          </div>
          {
            viewedApplication.student_submission.map((entry, i) => {
              let stepequivalent;
              if (entry.stepgiven == 1) stepequivalent = "Approver";
              else if (entry.stepgiven == 2) stepequivalent = "Clearance Officer";
              return (
                <RemarkSystem key={i} stepequivalent={stepequivalent} entry={entry} index={i} />
              );
            })
          }
          <SubmissionAppClosed />
        </div >
      );
    } else {
      return (
        <div className="sap-app-list-view-info" style={{ marginTop: "10px", width: "100%", height: "65%", overflowY: "auto", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", paddingLeft: "15px" }}>
          <div style={{ fontWeight: "bold", paddingTop: "10px", fontSize: "14px" }}>
            SUBMISSION AND REMARKS
          </div>
          {
            viewedApplication.student_submission.map((entry, i) => {
              let stepequivalent;
              if (entry.stepgiven == 1) stepequivalent = "Approver";
              else if (entry.stepgiven == 2) stepequivalent = "Clearance Officer";
              return (
                <RemarkSystem key={i} stepequivalent={stepequivalent} entry={entry} index={i} />
              );
            })
          }
          <SubmissionAppClosed />
        </div >
      )
    }
  }

  function downloadPdf() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const topMargin = 20; // Top margin in mm
    const leftMargin = 20; // Left margin in mm
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Set font style and size
    doc.setFont('Times New Roman', 'normal');
    doc.setFontSize(20);

    const line1 = 'University of the Philippines Los Baños';
    const line2 = 'College of Arts and Sciences';
    const line3 = 'Institute of Computer Science';
    const line4 = '________________________________________________';

    const lines = [line1, line2, line3, line4];

    let y = topMargin;

    doc.setFontSize(20);
    const lineHeight = 10; // Adjust this value to change the spacing between lines
    const maxLineWidth = lines.reduce((maxWidth, line) => {
      const lineWidth = doc.getTextWidth(line);
      return Math.max(maxWidth, lineWidth);
    }, 0);

    const centerPosX = (pageWidth - maxLineWidth) / 2;

    lines.forEach(line => {
      const lineWidth = doc.getTextWidth(line);
      const linePosX = centerPosX + (maxLineWidth - lineWidth) / 2;
      doc.text(line, linePosX, y);
      y += lineHeight;
    });

    y += lineHeight;

    // Add current date
    const currentDate = new Date().toLocaleDateString();
    const dateTextOptions = { align: 'left' };
    doc.setFontSize(12);
    doc.text(leftMargin, y, currentDate, dateTextOptions);

    y += lineHeight * 1.5;
    const clearanceTextOptions = { align: 'justify', maxWidth: pageWidth - 2 * leftMargin };
    doc.setFontSize(14);
    doc.text(leftMargin, y, `This document certifies that ${user.firstname} ${user.middlename} ${user.lastname}, ${user.stdnum} has satisfied the clearance requirements of the institute.`, clearanceTextOptions);

    y += lineHeight * 4;
    doc.text(leftMargin, y, "Verified: ", dateTextOptions)

    y += lineHeight * 2;
    doc.text(leftMargin, y, `Academic Adviser: ${adviserName}`, dateTextOptions)

    y += lineHeight;
    doc.text(leftMargin, y, `Clearance Officer: ${clearanceOfficerName}`, dateTextOptions)

    doc.save('certificate.pdf');
  }

  function RemarksAndPDF() {
    if (viewedApplication.status === "Cleared") {
      return (
        <>
          <SubmissionRemark />
          <div id="sap-app-process-inner-div-process-application-button-div">
            <button className="sap-app-process-inner-div-process-application-button" onClick={downloadPdf}>
              Download
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <SubmissionRemark />
        </>
      );
    }
  }

  function AppProcess() {
    if (currentScreen != "None") {
      if (appviewed) {
        let stepequivalent;
        if (viewedApplication.step == 1) stepequivalent = "On Approver";
        else if (viewedApplication.step == 2) stepequivalent = "On Clearance Officer";
        else {
          stepequivalent = "Already Cleared";
        }
        return (
          <div style={{ overflowY: "auto", display: "flex", height: "calc(100vh - 150px)" }}>
            <div id="sap-app-list-view" style={{ minWidth: "298px" }}>
              <div id="sap-app-list-view-inner-div" style={{ fontSize: "13px" }}>
                <div className="sap-app-list-view-info" style={{ paddingLeft: "15px" }}>
                  <div style={{ fontWeight: "bold", paddingTop: "10px", fontSize: "14px" }}>
                    APPLICATION ID
                  </div>
                  {viewedApplication._id}
                  <div style={{ fontWeight: "bold", paddingTop: "10px", fontSize: "14px" }}>
                    STATUS
                  </div>
                  {viewedApplication.status}
                  <div style={{ fontWeight: "bold", paddingTop: "10px", fontSize: "14px" }}>
                    STEP
                  </div>
                  {stepequivalent}
                </div>
                <RemarksAndPDF />
              </div>
            </div>
            <div id="sap-app-process" style={{ overflow: "none" }}>
              <AppProcessMain />
            </div>
          </div >
        );
      } else {
        return (
          <>
            <div id="sap-app-process" style={{ width: "85vw", paddingLeft: "10px", overflowY: "auto" }}>
              <AppProcessMain />
            </div>
          </>
        );
      }
    }
  }

  return (
    <div id="sap-body">
      <div style={{ backgroundColor: "#ffd87e" }}>
        <div id="sap-app-list">
          <div id="sap-app-list-title">Application List</div>

          <div id="sap-app-list-items">
            <div style={{ backgroundColor: "rgb(57, 54, 70)", minHeight: "1px", width: "94%" }} />
            {/* <div className="sap-app-list-items-row-id" style={{ fontWeight: "600", borderTop: "none" }}>
                            Application Id
                        </div> */}
            {/* <div className="sap-app-list-items-row-step" style={{ fontWeight: "600" }}>
                            Status
                        </div>
                        <div className="sap-app-list-items-row-status" style={{ fontWeight: "600" }}>
                            Step
                        </div> 
                    <div className="sap-app-list-items-row-buffer" /> */}
            <ShowList />
          </div>
        </div>
      </div>
      <AppProcess />
    </div>
  );
}
