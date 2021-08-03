import React from "react";
import MainContent from "../../shared/mainContent";
import { Form, Button, Message } from "semantic-ui-react";
import { useContext } from "react";
import StateContext from "../../context/stateContext";
import { useEffect } from "react";
import {
  _getUserData,
  _editUser,
  _getUser,
} from "../../controllers/AxiosRequests";
import { useState } from "react";
import { _isExist } from "../../controllers/functions";
import UploadShared from "../../shared/uploadShared";
import { keys } from "../../config/keys";

const countryOptions = [
  { key: "at", text: "Austria", flag: "at", value: "Austria" },
  { key: "be", text: "Belgium", flag: "be", value: "Belgium" },
  { key: "bg", text: "Bulgaria", flag: "bg", value: "Bulgaria" },
  { key: "hr", text: "Croatia", flag: "hr", value: "Croatia" },
  { key: "cz", text: "Czech Republic", flag: "cz", value: "Czech Republic" },
  { key: "dk", text: "Denmark", flag: "dk", value: "Denmark" },
  { key: "ee", text: "Estonia", flag: "ee", value: "Estonia" },
  { key: "fi", text: "Finland", flag: "fi", value: "Finland" },
  { key: "fr", text: "France", flag: "fr", value: "France" },
  { key: "de", text: "Germany", flag: "de", value: "Germany" },
  { key: "gr", text: "Greece", flag: "gr", value: "Greece" },
  { key: "hu", text: "Hungary", flag: "hu", value: "Hungary" },
  { key: "ie", text: "Ireland", flag: "ie", value: "Ireland" },
  { key: "it", text: "Italy", flag: "it", value: "Italy" },
  { key: "lv", text: "Latvia", flag: "lv", value: "Latvia" },
  { key: "lt", text: "Lithuania", flag: "lt", value: "Lithuania" },
  { key: "lu", text: "Luxembourg", flag: "lu", value: "Luxembourg" },
  { key: "mt", text: "Malta", flag: "mt", value: "Malta" },
  { key: "nl", text: "Netherlands", flag: "nl", value: "Netherlands" },
  { key: "pl", text: "Poland", flag: "pl", value: "Poland" },
  { key: "pt", text: "Portugal", flag: "pt", value: "Portugal" },
  { key: "ro", text: "Romania", flag: "ro", value: "Romania" },
  { key: "sk", text: "Slovakia", flag: "sk", value: "Slovakia" },
  { key: "si", text: "Slovenia", flag: "si", value: "Slovenia" },
  { key: "es", text: "Spain", flag: "es", value: "Spain" },
  { key: "se", text: "Sweden", flag: "se", value: "Sweden" },
  { key: "gb", text: "United Kingdom", flag: "gb", value: "United Kingdom" },
];

const AccountSettings = () => {
  const { selectedProject, setShowModal } = useContext(StateContext);
  const [state, setState] = useState({
    id: "",
    name: "",
    businessArea: "",
    VAT: "",
    city: "",
    country: "",
    address: "",
    number: "",
    street: "",
    zip: "",
    bankAccount: "",
    email: "",
    phone: "",
    registration_number: "",
    description: "",
    iban: "",
    bic: "",
    image_id: "",
    image: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      let tagArr = document.getElementsByTagName("input");
      for (let i = 0; i < tagArr.length; i++) {
        tagArr[i].autoComplete = 'nope';
      }
      _isExist().then((user) => {
        if (user) {
          _getUser(user.token).then((data) => {
            if (data.status === "success") {
              setState({
                id: user.token,
                name: data.data.name,
                businessArea:
                  data.data.businessArea != null ? data.data.businessArea : "",
                email: data.data.email,
                VAT: data.data.VAT,
                city:
                  data.data.address != null && data.data.address.city
                    ? data.data.address.city
                    : "",
                street:
                  data.data.address != null && data.data.address.street
                    ? data.data.address.street
                    : "",
                country:
                  data.data.address != null && data.data.address.country
                    ? data.data.address.country
                    : "",
                number:
                  data.data.address != null && data.data.address.number
                    ? data.data.address.number
                    : "",
                zip:
                  data.data.address != null && data.data.address.zip
                    ? data.data.address.zip
                    : "",
                address:
                  data.data.address != null &&
                  data.data.address.formattedAddress
                    ? data.data.address.formattedAddress
                    : "",
                phone: data.data.phone != null ? data.data.phone : "",
                registration_number:data.data.registration_number != null ? data.data.registration_number : "",
                description:data.data.description != null ? data.data.description : "",
                iban:
                  data.data.bankAccount != null && data.data.bankAccount.IBAN
                    ? data.data.bankAccount.IBAN
                    : "",
                bic:
                  data.data.bankAccount != null && data.data.bankAccount.BIC
                    ? data.data.bankAccount.BIC
                    : "",
                image_id: data.data.image_id?data.data.image_id:"",
                image: data.data.image ? `${keys.SERVER_IP}/images/${data.data.image.for}/${data.data.image.name}` : "",
              });
            }
          });
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, []);
  // useEffect(() => {
  //   let isMounted = true
  //   if (!isMounted || selectedProject.length === 0) return
  //   _getUserData(selectedProject[0].owner.id).then(res => {
  //     console.log(res);

  //     setState({
  //       id: res.id,
  //       name: res.name,
  //       businessArea: res.businessArea,
  //       email: res.email,
  //       VAT: res.VAT,
  //       city: res.address.city,
  //       country: res.address.country,
  //       street: res.address.street,
  //       number: res.address.number,
  //       zip: res.address.zip,
  //       bankAccount: res.bankAccount,
  //       phone: '',
  //       address: res.address.formattedAddress
  //     })
  //   })
  //   return () => {
  //     isMounted = false
  //   }
  // }, [selectedProject])

  const handleOnClick = () => {
    let formData = {
      name: state.name,
      email: state.email,
      phone: state.phone,
      registration_number: state.registration_number,
    description: state.description,
      address: {
        number: state.number,
        street: state.street,
        zip: state.zip,
        city: state.city,
        country: state.country,
        formattedAddress: state.address,
        loc: {
          type: "Test",
          coordinates: [4.9886],
        },
      },
      businessArea: state.businessArea,
      VAT: state.VAT,
      bankAccount: {
        IBAN: state.iban,
        BIC: state.bic,
      },
    };
    if(state.image_id != ""){
      formData.Image_id = state.image_id;
    }
    _editUser(formData, state.id).then((res) => {
      console.log(res);
      if (res.status === "error") {
        setError(res.message);
      }
      setShowModal("updateAccountSuccess");
    });
  };
  return (
    <MainContent id="accountSetting" subClass="small-sub-content">
      <h2 style={{ color: "#5abdbf" }}>Account Settings</h2>
      {state.iban === "" || state.bic === "" ? <Message color="green">
        Make sure you get paid out by <b>completing your banking details.</b>{" "}
      </Message> : ""}
      <div style={{ marginTop: "20px" }}>
        <UploadShared
          title={""}
          type="user"
          id="itemImg"
          setBanner={(value) => setState({ ...state, image_id: value })}
          banner={state.image !== "" ? state.image : "/images/Male-Avatar.png"}
        />
        <Form>
          <p style={{ color: "#8487b9", marginBottom: "10px" }}>
            Company Details
          </p>
          <Form.Group widths="equal">
            <Form.Field>
              <Form.Input
                type="text"
                placeholder="Company Name"
                value={state.name}
                onChange={(e, { value }) => setState({ ...state, name: value })}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                type="text"
                placeholder="VAT Number"
                value={state.VAT}
                onChange={(e, { value }) => setState({ ...state, VAT: value })}
              />
            </Form.Field>
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Field>
              <Form.Input
                type="text"
                placeholder="Company Email"
                value={state.email}
                onChange={(e, { value }) =>
                  setState({ ...state, email: value })
                }
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                type="text"
                placeholder="Phone Number"
                value={state.phone}
                onChange={(e, { value }) =>
                  setState({ ...state, phone: value })
                }
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field>
              <Form.Input
                type="text"
                placeholder="Description"
                value={state.description}
                onChange={(e, { value }) => setState({ ...state, description: value })}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                type="text"
                placeholder="Registration number"
                value={state.registration_number}
                onChange={(e, { value }) => setState({ ...state, registration_number: value })}
              />
            </Form.Field>
          </Form.Group>
          <p
            style={{
              color: "#8487b9",
              marginBottom: "10px",
              marginTop: "50px",
            }}
          >
            Company Address
          </p>
          <Form.Group widths="equal">
            <Form.Field>
              <Form.Input
                type="text"
                placeholder="Street"
                value={state.street}
                onChange={(e, { value }) =>
                  setState({ ...state, street: value })
                }
                autoComplete="nope"
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                type="text"
                placeholder="Street Number"
                value={state.number}
                onChange={(e, { value }) =>
                  setState({ ...state, number: value })
                }
                autoComplete="nope"
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                type="text"
                placeholder="Postal Code"
                value={state.zip}
                onChange={(e, { value }) => setState({ ...state, zip: value })}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width="8">
              <Form.Select
                id="countrySelect"
                placeholder="Country"
                className="ticketType"
                autoComplete="nope"
                value={state.country}
                onChange={(e, { value }) =>
                  setState({ ...state, country: value })
                }
                options={countryOptions}
                required
              />
            </Form.Field>
          </Form.Group>
          <p
            style={{
              color: "#8487b9",
              marginBottom: "10px",
              marginTop: "50px",
            }}
          >
            Business Area
          </p>
          <Form.Group>
            <Form.Field width="8">
              <Form.Select
                id="countrySelect"
                placeholder="Business Area"
                className="ticketType"
                search
                value={state.businessArea}
                onChange={(e, { value }) =>
                  setState({ ...state, businessArea: value })
                }
                options={countryOptions}
                required
              />
            </Form.Field>
          </Form.Group>
          <p
            style={{
              color: "#8487b9",
              marginBottom: "10px",
              marginTop: "50px",
            }}
          >
            Banking Details
          </p>
          <Form.Group widths="equal">
            <Form.Field>
              <Form.Input
                type="text"
                placeholder="IBAN"
                value={state.iban}
                onChange={(e, { value }) => setState({ ...state, iban: value })}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                type="text"
                placeholder="BIC"
                value={state.bic}
                onChange={(e, { value }) => setState({ ...state, bic: value })}
              />
            </Form.Field>
          </Form.Group>
          {error !== "" && (
            <div style={{ color: "red", textAlign: "center", padding: "10px" }}>
              {error}
            </div>
          )}
          <div style={{ marginTop: "40px", textAlign: "right" }}>
            <Button content="Confirm" onClick={handleOnClick} />
          </div>
        </Form>
      </div>
    </MainContent>
  );
};

export default AccountSettings;
