import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createServer } from "../../../store/servers";
import { uploadSvg, xDDSvg } from "../../utils";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "../Prompts/prompt.css";
import "../SettingsOverlays/overlay.css";
import { storage } from "../../../firebase";
function CreateServer({ setOverlay, setOverlayType }) {
  const user = useSelector((state) => state.session.user);
  const [errors, setErrors] = useState([]);
  const [imageFile, setImageFile] = useState("");
  const [name, setName] = useState(`${user.username}'s server`);
  const [progress, setProgress] = useState(0);
  const [localImage, setLocalImage] = useState("");
  const [localUrl, setLocalUrl] = useState(false);
  const [preview, setPreview] = useState("");
  const dispatch = useDispatch();
  const file = useRef();
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
        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          dispatch(createServer(name, url)).then((res) => {
            if (res) {
              setErrors(res);
            } else {
              setOverlay(false);
            }
          });
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
      setPreview("");
    }
  }, [localUrl]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (localImage) uploadImg(localImage);
    else
      dispatch(createServer(name, null)).then((res) => {
        if (res) {
          setErrors(res);
        } else {
          setOverlay(false);
        }
      });
  };
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
  return (
    <div style={{ width: "100%" }}>
      <div
        className="pointer overlay-close"
        onMouseDown={() => setOverlay(false)}
      >
        {xDDSvg()}
      </div>
      <div className="overlay-header">Create your server!</div>
      <div className="prompt-top-create-server" style={{ paddingTop: "24px" }}>
        {preview ? (
          <label
            htmlFor="pic"
            className="pointer"
            style={{
              color: "var(--text-muted)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: `url(${preview})`,
              }}
            ></div>
          </label>
        ) : (
          <label
            htmlFor="pic"
            className="pointer"
            style={{
              color: "var(--text-muted)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {uploadSvg()}
          </label>
        )}

        <input
          style={{ display: "none" }}
          id="pic"
          type="file"
          value={imageFile}
          onChange={imagePreview}
        />

        <div className="option-header" style={{ color: "#4f5660" }}>
          SERVER NAME
        </div>
        <input
          spellCheck={false}
          className="option-input-light"
          style={{ width: "100%" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="back-button pointer"
          onClick={() => setOverlayType(0)}
        >
          Back
        </button>
        <button className="done-button pointer" onClick={onSubmit}>
          Create
        </button>
      </div>
    </div>
  );
}

export default CreateServer;
