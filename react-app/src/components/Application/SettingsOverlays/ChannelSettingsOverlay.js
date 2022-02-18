import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editChannel } from "../../../store/servers";
import { hashSvg, xSvg } from "../../utils";
import DeleteChannelPrompt from "../Prompts/DeleteChannelPrompt";
import "./overlay.css";
function ChannelSettingsOverlay({ channel, setOverlay, overlayed }) {
  const [channelName, setChannelName] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [deleteOverlay, setDeleteOverlay] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setChannelName(channel.name);
  }, [channel]);

  useEffect(() => {
    if (!channel) setOverlay(false);
  }, [deleteOverlay]);
  useEffect(() => {
    if (channel.name != channelName) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  }, [channel, channelName]);
  const onSave = (e) => {
    e.preventDefault();
    const newChannel = { ...channel, name: channelName };
    dispatch(editChannel(newChannel));
  };
  const onClickDelete = (e) => {
    e.preventDefault();
    setDeleteOverlay(true);
  };
  return (
    <div className="full-overlay-container">
      {deleteOverlay ? (
        <DeleteChannelPrompt channel={channel} setOverlay={setDeleteOverlay} />
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
                onClick={() => setChannelName(channel.name)}
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
            {hashSvg()}
            {
              <div style={{ padding: "0 .5em" }}>
                {channelName.toUpperCase()}
              </div>
            }
            {"TEXT CHANNELS"}
          </div>
          <div className="option selected">Overview</div>
          <div className="separator" />
          <div onClick={onClickDelete} className="option danger-action">
            Delete Channel
          </div>
        </div>
      </div>
      <div className="right-container">
        <div style={{ color: "white", marginBottom: "20px" }}>OVERVIEW</div>
        <div className="single-option-header">CHANNEL NAME</div>
        <input
          className="option-input"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
      </div>
      <div className="close-button" onClick={() => setOverlay(false)}>
        {xSvg()}
      </div>
    </div>
  );
}

export default ChannelSettingsOverlay;
