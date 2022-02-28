import { Avatar } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hashSvg, xSvg } from "../../utils";
import ChangeUsernamePrompt from "../Prompts/ChangeUsernamePrompt";
import LogoutPrompt from "../Prompts/LogoutPrompt";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./overlay.css";
import "./user-settings.css";
import { storage } from "../../../firebase";
import { updateUserAvatar } from "../../../store/session";
function UserSettingsOverlay({ setOverlay }) {
  const user = useSelector((state) => state.session.user);
  // const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [logoutPrompt, setLogoutPrompt] = useState(false);
  const [usernamePrompt, setUsernamePrompt] = useState(false);
  const [errors, setErrors] = useState([]);
  const [imageFile, setImageFile] = useState("");
  const [progress, setProgress] = useState(0);
  const [localImage, setLocalImage] = useState("");
  const [localUrl, setLocalUrl] = useState(false);
  const [preview, setPreview] = useState(null);
  const [updateAvatar, setUpdateAvatar] = useState(false);

  const file = useRef();

  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) setOverlay(false);
  }, [user]);
  const onClickLogout = (e) => {
    e.preventDefault();
    setLogoutPrompt(true);
  };
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
          dispatch(updateUserAvatar(url));
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
      setPreview(user.imgUrl);
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
    setUpdateAvatar(true);
  };
  useEffect(() => {
    if (!updateAvatar) return;
    if (preview != user.imgUrl && preview != null) {
      uploadImg(localImage);
    } else if (preview == null) {
      dispatch(updateUserAvatar(null));
    }
  }, [preview]);

  const onClickRemove = (e) => {
    setImageFile("");
    setLocalUrl(false);
    setUpdateAvatar(true);
    setPreview(null);
  };
  return (
    <div className="full-overlay-container">
      {usernamePrompt ? (
        <ChangeUsernamePrompt setOverlay={setUsernamePrompt} />
      ) : (
        <></>
      )}
      {logoutPrompt ? <LogoutPrompt setOverlay={setLogoutPrompt} /> : <></>}
      <div className="left-container">
        <div className="settings-options">
          <div className="options-header">
            {
              <div
                style={{
                  padding: "0 .5em",
                  color: "var(--text-muted)",
                  fontWeight: "600",
                }}
              >
                {"USER SETTINGS"}
              </div>
            }
          </div>
          <div className="option selected">My Account</div>
          <div className="separator" />
          <div onClick={onClickLogout} className="option danger-action">
            Log Out
          </div>
        </div>
      </div>
      <div className="right-container">
        <div
          style={{
            color: "white",
            marginBottom: "20px",
            fontSize: "24px",
            fontFamily: "var(--font-display)",
            fontWeight: "600",
          }}
        >
          My Account
        </div>
        <div className="user-card">
          <div className="user-card-banner"></div>
          <div className="user-card-bottom">
            <div className="user-avatar-bar">
              <div className="user-avatar">
                <Avatar
                  src={preview}
                  style={{ width: "80px", height: "80px" }}
                />
              </div>

              <div
                style={{
                  color: "white",
                  marginBottom: "20px",
                  fontSize: "20px",
                  fontFamily: "var(--font-display)",
                  fontWeight: "600",
                }}
              >
                {user.username}
              </div>
            </div>
            <div
              style={{
                paddingLeft: "16px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <label
                htmlFor="upload"
                className="upload-btn pointer"
                style={{ width: "128px" }}
              >
                Upload Avatar
              </label>
              <input
                hidden={true}
                id={"upload"}
                type="file"
                accept=".gif,.jpg,.jpeg,.png"
                value={imageFile}
                onChange={imagePreview}
              ></input>
              {user.imgUrl || imageFile ? (
                <span
                  className="reset-button pointer"
                  style={{ marginTop: "16px" }}
                  onClick={onClickRemove}
                >
                  Remove
                </span>
              ) : (
                <></>
              )}
            </div>
            <div className="user-card-options">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="option-header">USERNAME</div>
                  <div style={{ color: "var(--header-primary)" }}>
                    {user.username}
                  </div>
                </div>
                <button
                  className="edit-button"
                  onClick={() => setUsernamePrompt(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="close-button" onClick={() => setOverlay(false)}>
        {xSvg()}
      </div>
    </div>
  );
}

export default UserSettingsOverlay;
