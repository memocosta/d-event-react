import React from "react";
import { Form, Icon, Image, Loader } from "semantic-ui-react";
import { useState } from "react";
import { useContext } from "react";
import StateContext from "../context/stateContext";
import { _uploadFile } from "../controllers/AxiosRequests";
import { useEffect } from "react";

const UploadShared = ({ title, id, banner, setBanner , type}) => {
  const { isLogged, setToastAlert } = useContext(StateContext);
  const [imgPreview, setImgPreview] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!isMounted || !banner || banner === "") return;
    setImgPreview(banner);
    return () => {
      isMounted = false;
    };
  }, [banner]);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
        if (fileReader.readyState === 2) {
          setImgPreview(fileReader.result)
        }
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleOnSelectedFile = async (e) => {
    console.log(e.target.files[0]);
    // let file = e.target.files[0]
    const file = e.target.files[0];
    // let file_size = e.target.files[0].size;
    // console.log(file_size); 
    // if(file_size > 1200000){
    //   setToastAlert({
    //     show: true,
    //     title: "Something went wrong!",
    //     message:
    //       "The Image Must Not Be Larger Than 1Mb !",
    //   });
    //   return;
    // }
    const base64 = await convertBase64(file);
    setDisabled(true);
    setError(false);
    // const reader = new FileReader()
    // reader.onload = () => {
    //   if (reader.readyState === 2) {
    //     setImgPreview(reader.result)
    //   }
    // }
    // reader.readAsDataURL(e.target.files[0])
    _uploadFile(base64, isLogged, type).then((res) => {
      if (res.error) {
        setToastAlert({
          show: true,
          title: "Something went wrong!",
          message:
            "Something went wrong while uploading the image, please try again!",
        });
        setError(true);
        setDisabled(false);
        return;
      }
      setDisabled(false);
      setError(false);
      setBanner(res);
    });
  };
  return (
    <Form.Field>
      {type !== "user" && <div>
        <p
          style={{
            color: "#5abdbf",
            marginBottom: "15px",
            fontWeight: "600",
          }}
        >
          {title + ' MAX SIZE (1MB)'}
        </p>
        <input
          type="file"
          id={`${id}-upload`}
          onChange={handleOnSelectedFile}
          accept="image/*"
        />
        <label
          id="labelForUpload"
          style={{ cursor: "pointer" }}
          htmlFor={`${id}-upload`}
        >
          Browse
        </label>
      </div>}
      {imgPreview !== "" && (
        <div className={`img-preview ${type=== "user" ? "user" : ""}`}>
          {disabled && !error && (
            <div className="loading-img">
              <Loader active inline="centered" size="large" />
            </div>
          )}{" "}
          {!disabled && !error && <Image src={imgPreview} alt="Image" />}
          {/* <Icon name="add circle" className="user-add-img"/> */}
          {type === "user" && (<><input
          type="file"
          id={`${id}-upload`}
          onChange={handleOnSelectedFile}
          accept="image/*"
        />
        <label
          id="labelForUploadUser"
          style={{ cursor: "pointer" }}
          htmlFor={`${id}-upload`}
        >
          +
        </label></>)}
        </div>
      )}
    </Form.Field>
  );
};

export default UploadShared;
