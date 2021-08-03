import React, { useContext, useState } from "react";

import { Button, Container, Form, Transition } from "semantic-ui-react";
import moment from "moment";
import MainContent from "../../shared/mainContent";
import StateContext from "../../context/stateContext";
import DateTimeShared from "../../shared/dateTimeShared";
import EditorShared from "../../shared/editorShared";
import UploadShared from "../../shared/uploadShared";
import { _createProject, _getCountries, _getProjectTypes, _getProjectCategories } from "../../controllers/AxiosRequests";
import { _validateForm } from "../../controllers/functions";
import { useEffect } from "react";

const CreateProject = () => {
  const [show, setShow] = useState({ id: "", show: false });
  const [tabs, setTabs] = useState("tab1");
  const [ProjectCountryOptions, setProjectCountryOptions] = useState([]);
  const [ProjectTicketTypeOptions, setProjectTicketTypeOptions] = useState([]);
  const [ProjectCategoryOptions, setProjectCategoryOptions] = useState([]);
  const {
    setLoading,
    setShowModal,
    isLogged,
    projects,
    setProjects,
    setToastAlert,
    setSelectedProject,
  } = useContext(StateContext);
  const [disabled, setDisabled] = useState(false);
  const [state, setState] = useState({
    name: "",
    coManagers: [],
    type: "",
    category: "",
    city: "",
    address: "",
    streetNumber: "",
    country: "",
    startDate: moment().format(),
    startTime: "",
    endDate: moment().format(),
    endTime: "",
    ongoing: false,
    desc: "",
    contactInfo: "",
    banner: "",
    layer: "",
  });

  useEffect(() => {
    // let isMounted = true;
    // if (!isMounted || selectedProject.length === 0) return;
    let tagArr = document.getElementsByTagName("input");
      for (let i = 0; i < tagArr.length; i++) {
        tagArr[i].autoComplete = 'nope';
      }
    
    setLoading(true);
    _getCountries().then((res) => {
      let countryOptions = [];

      res.data.map(function ({ key, text, flag, value }) {
        countryOptions.push({ key: key, text: text, flag: flag, value: value });
      });
      setProjectCountryOptions(countryOptions);
      console.log("ProjectCountryOptions");
      console.log(countryOptions);
      console.log(ProjectCountryOptions);
    });

    _getProjectTypes().then((res) => {
      let ticketTypeOptions = [];

      res.data.map(function ({ key, text, value }) {
        ticketTypeOptions.push({ key: key, text: text, value: value });
      });
      setProjectTicketTypeOptions(ticketTypeOptions);
      console.log("ProjectTicketTypeOptions");
      console.log(ticketTypeOptions);
      console.log(ProjectTicketTypeOptions);
    });

    _getProjectCategories().then((res) => {
      let categoryOptions = [];

      res.data.map(function ({ key, text, value }) {
        categoryOptions.push({ key: key, text: text, value: value });
      });
      setProjectCategoryOptions(categoryOptions);
      console.log("ProjectCategoryOptions");
      console.log(categoryOptions);
      console.log(ProjectCategoryOptions);
    });
    // return () => {
    //   isMounted = false;
    // };
  }, [
    setLoading,
    setProjectCategoryOptions,
    setProjectTicketTypeOptions,
    setProjectCountryOptions,
  ]);

  const handleOnClick = (type) => {
    switch (type) {
      case "next":
        setTabs("");
        setTimeout(() => {
          setTabs("tab2");
        }, 500);
        return;
      case "back":
        setTabs("");
        setTimeout(() => {
          setTabs("tab1");
        }, 500);
        return;
      case "finish":
        if(!state.ongoing && state.endDate <= state.startDate){
          setToastAlert({
            show: true,
            title: "Fill form",
            message: "The End date must be after the start date.",
          });
          return;
        }
        // if(!state.banner){
        //   setToastAlert({
        //     show: true,
        //     title: "Fill form",
        //     message: "Please Add an Image to the project!",
        //   });
        //   return;
        // }
        setDisabled(true);
        const formData = {
          name: state.name,
          type: state.type,
          category: state.category,
          address: {
            number: state.streetNumber,
            street: "Test",
            zip: "Test",
            city: state.city,
            country: state.country,
            formattedAddress: state.address,
            loc: {
              type: "Test",
              coordinates: [4.9886],
            },
          },
          to: state.endDate,
          from: state.startDate,
          ongoing: state.ongoing,
          description: state.desc,
          contactInfo: state.contactInfo,
        };
        if(state.banner != ""){
          formData.image_id = state.banner;
        }
        // const formData = {
        //   type: state.type,
        //   category: state.category,
        //   address: {
        //     number: state.streetNumber,
        //     street: "test",
        //     zip: "Test",
        //     city: state.city,
        //     country: state.country,
        //     formattedAddress: state.address,
        //     loc: {
        //       type: "Test",
        //       coordinates: [4.9886],
        //     },
        //   },
        //   to: state.endDate,
        //   from: state.startDate,
        //   ongoing: state.ongoing,
        //   description: state.desc,
        //   contactInfo: state.contactInfo,
        //   pictureBanner: {
        //     large: state.banner,
        //     medium: "Test",
        //     small: "Test",
        //   },
        //   pictureFlyer: {
        //     large: state.layer,
        //     medium: "Test",
        //     small: "Test",
        //   },
        //   private: false,
        //   name: state.name,
        //   genderAccess: "male",
        // };
        const validate = _validateForm(formData, "project");

        if (!validate) {
          setToastAlert({
            show: true,
            title: "Fill form",
            message: "Please fill the form correctly then try again!",
          });
          setDisabled(false);
          return;
        }

        _createProject(formData, isLogged).then((res) => {
          if (res.status === "error") {
            setToastAlert({
              show: true,
              message: res.message,
            });
            setDisabled(false);
            return;
          }
          setSelectedProject([{ ...res.data }]);
          localStorage.setItem(
            "selectedProject",
            JSON.stringify([{ ...res.data }])
          );
          setProjects([...projects, { ...res.data }]);
          setShowModal("success");
          setDisabled(false);
        });
        return;
      default:
        break;
    }
  };
  return (
    <MainContent subClass="small-sub-content">
      <div className="dashboard-header mb-2">
        <h3 style={{ color: "#5abdbf" }}>
          Create New Project ({tabs === "tab1" ? "1" : "2"} / 2)
        </h3>
      </div>

      <div className="create-event-form">
        <Form autoComplete="nope">
          <Transition
            visible={tabs === "tab1" ? true : false}
            animation="scale"
            unmountOnHide
            duration={500}
          >
            <Container>
              <p style={{ color: "#5abdbf" }}>General Info</p>

              <Form.Group widths="equal">
                <Form.Field>
                  <Form.Input
                    label="Project Title"
                    value={state.name}
                    required
                    onChange={(e, { value }) =>
                      setState({ ...state, name: value })
                    }
                  />
                </Form.Field>
                {/* <Form.Field>
                  <label>Add co-managers</label>
                  <Dropdown
                    id="coManagers"
                    clearable
                    fluid
                    value={state.coManagers}
                    multiple
                    labeled
                    search
                    selection
                    onChange={(e, { value }) =>
                      setState({ ...state, coManagers: value })
                    }
                    options={countryOptions}
                    placeholder="Select Co-manager"
                  />
                </Form.Field> */}
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field>
                  <Form.Select
                    fluid
                    id="ticketType"
                    value={state.type}
                    label="Type"
                    onClick={() => setShow({ id: "1", show: !show.show })}
                    onChange={(e, { value }) =>
                      setState({ ...state, type: value })
                    }
                    className={`ticketType ${
                      show.show && show.id === "1" ? "active" : ""
                    }`}
                    required
                    options={ProjectTicketTypeOptions}
                    placeholder="Select..."
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Select
                    fluid
                    id="ticketType"
                    label="Category"
                    value={state.category}
                    onClick={() => setShow({ id: "1", show: !show.show })}
                    onChange={(e, { value }) =>
                      setState({ ...state, category: value })
                    }
                    className={`ticketType ${
                      show.show && show.id === "1" ? "active" : ""
                    }`}
                    required
                    options={ProjectCategoryOptions}
                    placeholder="Select..."
                  />
                </Form.Field>
              </Form.Group>
              <br />
              <p style={{ color: "#5abdbf" }}>Location</p>
              <Form.Group widths="equal">
                <Form.Field>
                  <Form.Input
                    label="City"
                    autoComplete="nope"
                    value={state.city}
                    onChange={(e, { value }) =>
                      setState({ ...state, city: value })
                    }
                    required
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    label="Address"
                    autoComplete="nope"
                    value={state.address}
                    onChange={(e, { value }) =>
                      setState({ ...state, address: value })
                    }
                    required
                  />
                </Form.Field>
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Field>
                  <Form.Input
                    label="Street Number"
                    autoComplete="nope"
                    value={state.streetNumber}
                    onChange={(e, { value }) =>
                      setState({ ...state, streetNumber: value })
                    }
                    required
                  />
                </Form.Field>
                  <Form.Select
                    id="countrySelect"
                    label="Country"
                    value={state.country}
                    onChange={(e, { value }) =>
                      setState({ ...state, country: value })
                    }
                    placeholder="Select country"
                    className={`ticketType ${
                      show.show && show.id === "1" ? "active" : ""
                    }`}
                    
                    options={ProjectCountryOptions}
                    autoComplete="nope"
                    required
                  />
              </Form.Group>
              <br />

              <DateTimeShared
                title="Date and Time"
                status={state.ongoing}
                subTitle="Ongoing event (no specific dates)"
                ongoing={(value) => setState({ ...state, ongoing: value })}
                setTimeDate={(value) => {
                  if (value.type === "start") {
                    setState({ ...state, startDate: value.date });
                  } else {
                    setState({ ...state, endDate: value.date });
                  }
                }}
                from={state.startDate}
                to={state.endDate}
                value={state.ongoing}
              />
            </Container>
          </Transition>
          <Transition
            visible={tabs === "tab2" ? true : false}
            animation="scale"
            unmountOnHide
            duration={500}
          >
            <Container>
              <p
                htmlFor="ticketDetails"
                style={{
                  fontSize: "15px",
                  color: "#5abdbf",
                  marginBottom: "10px",
                }}
              >
                Details
              </p>
              <EditorShared
                title="Project Description*"
                data={state.desc}
                setData={(value) => setState({ ...state, desc: value })}
              />
              <EditorShared
                title="Project contact information*"
                data={state.contactInfo}
                setData={(value) => setState({ ...state, contactInfo: value })}
              />

              <br />
              <Form.Group widths="equal">
                <UploadShared title="Add Banner*" id="banner" setBanner={(value) => setState({ ...state, banner: value })} type="project"/>
                {/* <UploadShared title="Add a map (optional)" id="map" setBanner={(value) => setState({ ...state, layer: value })} /> */}
              </Form.Group>
            </Container>
          </Transition>
          <div style={{ textAlign: "right"}}>
            {tabs === "tab2" && (
              <>
                <Button onClick={() => handleOnClick("back")}>Back</Button>
                <Button
                  disabled={disabled}
                  loading={disabled}
                  onClick={() => handleOnClick("finish")}
                >
                  Finish!
                </Button>
              </>
            )}
            {tabs === "tab1" && (
              <Button onClick={() => handleOnClick("next")}>Next</Button>
            )}
          </div>
        </Form>
      </div>
    </MainContent>
  );
};

export default CreateProject;
