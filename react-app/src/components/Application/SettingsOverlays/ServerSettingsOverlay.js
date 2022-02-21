import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editServer } from "../../../store/servers";
import { hashSvg, xSvg } from "../../utils";
import DeleteServerPrompt from "../Prompts/DeleteServerPrompt";
import "./overlay.css";
function ServerSettingsOverlay({ server, setOverlay }) {
  const [serverName, setServerName] = useState("|||||||||||||||||");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [deleteOverlay, setDeleteOverlay] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setServerName(server.name);
  }, [server]);

  useEffect(() => {
    if (!server) setOverlay(false);
  }, [deleteOverlay]);
  useEffect(() => {
    if (server.name != serverName) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  }, [server, serverName]);
  const onSave = (e) => {
    e.preventDefault();
    const newServer = { ...server, name: serverName };
    dispatch(editServer(newServer));
  };
  const onClickDelete = (e) => {
    e.preventDefault();
    setDeleteOverlay(true);
  };
  return (
    <div className="full-overlay-container">
      {deleteOverlay ? (
        <DeleteServerPrompt server={server} setOverlay={setDeleteOverlay} />
      ) : (
        <></>
      )}
      {unsavedChanges ? (
        <div className="bottom-popup-wrapper">
          <div className="save-changes-popup">
            <span className="bottom-message">
              Careful — you have unsaved changes!
            </span>
            <div>
              <button
                onClick={() => setServerName(server.name)}
                className="reset-button pointer"
              >
                Reset
              </button>
              <button onClick={onSave} className="save-button pointer">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="left-container">
        <div className="settings-options">
          <div className="options-header">
            {
              <div style={{ padding: "0 .5em" }}>
                {serverName.toUpperCase()}
              </div>
            }
          </div>
          <div className="option selected">Overview</div>
          <div className="separator" />
          <div onClick={onClickDelete} className="option danger-action">
            Delete Server
          </div>
        </div>
      </div>
      <div className="right-container">
        <div style={{ color: "white", marginBottom: "20px" }}>OVERVIEW</div>
        <div className="single-option-header">SERVER NAME</div>
        <input
          className="option-input"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
        />
      </div>
      <div className="close-button" onClick={() => setOverlay(false)}>
        {xSvg()}
      </div>
    </div>
  );
}

export default ServerSettingsOverlay;
