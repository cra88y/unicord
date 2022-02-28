import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createServer, editServer } from "../../../store/servers";
import { hashSvg, xSvg } from "../../utils";
import DeleteServerPrompt from "../Prompts/DeleteServerPrompt";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./overlay.css";
import { storage } from "../../../firebase";
function ServerSettingsOverlay({ server, setOverlay }) {
  const user = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState([]);
  const [imageFile, setImageFile] = useState("");
  const [progress, setProgress] = useState(0);
  const [localImage, setLocalImage] = useState("");
  const [localUrl, setLocalUrl] = useState(false);
  const [preview, setPreview] = useState(null);
  const [serverName, setServerName] = useState("|||||||||||||||||");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [deleteOverlay, setDeleteOverlay] = useState(false);
  const file = useRef();
  const dispatch = useDispatch();
  const acronym = server?.name
    .split(/\s/)
    .reduce((response, word) => (response += word.slice(0, 1)), "");
  useEffect(() => {
    setServerName(server.name);
    setPreview(server.imgUrl);
  }, [server]);

  useEffect(() => {
    if (!server) setOverlay(false);
  }, [deleteOverlay]);
  useEffect(() => {
    if (server.name != serverName || preview != server.imgUrl) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  }, [serverName, preview]);
  const uploadImg = (imageFile) => {
    if (!imageFile) return;
    const storageRef = ref(
      storage,
      `/images/${user.id}/${user.username}-${Date.now()}`
    );
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          dispatch(editServer(server.id, url, serverName));
        });
      }
    );
  };
  useEffect(() => {
    if (localUrl) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(localUrl);
    } else {
      setPreview(server.imgUrl);
    }
  }, [localUrl]);

  const imagePreview = (e) => {
    e.preventDefault();
    setImageFile(e.target.value);
    const imageToUpload = e.target.files[0];
    setLocalImage(imageToUpload);
    if (file) {
      setLocalUrl(imageToUpload);
    } else {
      setLocalUrl(false);
    }
  };
  const onSave = (e) => {
    e.preventDefault();
    if (preview != server.imgUrl && preview != null) {
      uploadImg(localImage);
    } else if (preview == null)
      dispatch(editServer(server.id, null, serverName));
    else {
      dispatch(editServer(server.id, server.imgUrl, serverName));
    }
    setUnsavedChanges(false);
  };
  const onClickDelete = (e) => {
    e.preventDefault();
    setDeleteOverlay(true);
  };
  const onClickRemove = (e) => {
    setImageFile("");
    setPreview(null);
    setLocalUrl(false);
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
                onClick={() => {
                  setServerName(server.name);
                  setPreview(server.imgUrl);
                  setImageFile("");
                  setLocalUrl(false);
                }}
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
        <div
          style={{
            color: "white",
            marginBottom: "20px",
            fontSize: "16px",
            fontFamily: "var(--font-display)",
            fontWeight: "600",
          }}
        >
          Server Overview
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {preview ? (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url(${preview})`,
                }}
              ></div>
            ) : (
              <>
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    backgroundColor: "rgb(88, 101, 242)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  {acronym}
                </div>
              </>
            )}
            <label htmlFor="upload" className="upload-btn pointer">
              Upload Image
            </label>
            <input
              hidden={true}
              id={"upload"}
              type="file"
              accept=".gif,.jpg,.jpeg,.png"
              value={imageFile}
              onChange={imagePreview}
            ></input>
            {server.imgUrl || imageFile ? (
              <span
                className="reset-button pointer"
                style={{ marginTop: "8px" }}
                onClick={onClickRemove}
              >
                Remove
              </span>
            ) : (
              <></>
            )}
          </div>
          <div style={{ width: "320px", paddingLeft: "16px" }}>
            <div className="single-option-header">SERVER NAME</div>
            <input
              className="option-input"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="close-button" onClick={() => setOverlay(false)}>
        {xSvg()}
      </div>
    </div>
  );
}

export default ServerSettingsOverlay;
