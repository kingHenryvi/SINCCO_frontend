export default function MainApproverDashboard() {
  const username = sessionStorage.getItem("username");

  return (
    <>
      <div id="welcome">
        <div id="welcome-text-info">
          <div id="welcome-text">
            Welcome! {username}
          </div>
          <div id="welcome-info">
            SINCCO, stands for System Interface for Centralized Clearance Operation is a comprehensive and centralized system interface designed
            to facilitate the clearance operations for computer science students. This system interface serves as a digital platform or software that
            streamlines and manages the entire clearance process.
          </div>
        </div>
        <div id="welcome-image" />
      </div>
    </>
  );
}
