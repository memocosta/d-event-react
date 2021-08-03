import React, { useContext, useState } from "react";
import { Button, Container, Form, Transition, Checkbox } from "semantic-ui-react";
import StateContext from "../../context/stateContext";
import DateTimeShared from "../../shared/dateTimeShared";
import EditorShared from "../../shared/editorShared";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { _isSelectedProject } from "../../controllers/functions";
import MainContent from "../../shared/mainContent";
import UploadShared from "../../shared/uploadShared";
import {
  _editProject,
  _getProjectData,
  _getCountries,
  _getProjectTypes,
  _getProjectCategories,
} from "../../controllers/AxiosRequests";
import { useEffect } from "react";
import { keys } from "../../config/keys";

const EditProject = ({ match }) => {
  const history = useHistory();
  const [show, setShow] = useState({ id: "", show: false });
  const [tabs, setTabs] = useState("tab1");
  const [ProjectCountryOptions, setProjectCountryOptions] = useState([]);
  const [ProjectTicketTypeOptions, setProjectTicketTypeOptions] = useState([]);
  const [ProjectCategoryOptions, setProjectCategoryOptions] = useState([]);
  const {
    setShowModal,
    selectedProject,
    isLogged,
    setToastAlert,
    setSelectedProject,
  } = useContext(StateContext);
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
    endDate: moment().format(),
    ongoing: false,
    desc: "",
    contactInfo: "",
    banner:"",
    image:"",
    publish: 1
  });
  
  _isSelectedProject(match.params.id).then((sel) => {
    if(!sel) history.push("/");
  });

  useEffect(() => {
    let isMounted = true;

    if (!isMounted) return;
    let tagArr = document.getElementsByTagName("input");
      for (let i = 0; i < tagArr.length; i++) {
        tagArr[i].autoComplete = 'nope';
      }
    _getCountries().then((res) => {
      let countryOptions = [];

      res.data.map(function ({ key, text, flag, value }) {
        countryOptions.push({ key: key, text: text, flag: flag, value: value });
      });
      setProjectCountryOptions(countryOptions);
    });

    _getProjectTypes().then((res) => {
      let ticketTypeOptions = [];

      res.data.map(function ({ key, text, value }) {
        ticketTypeOptions.push({ key: key, text: text, value: value });
      });
      setProjectTicketTypeOptions(ticketTypeOptions);
    });

    _getProjectCategories().then((res) => {
      let categoryOptions = [];

      res.data.map(function ({ key, text, value }) {
        categoryOptions.push({ key: key, text: text, value: value });
      });
      setProjectCategoryOptions(categoryOptions);
    });

    _getProjectData(match.params.id).then((res) => {
      console.log(res);
      let project = res.data;
      // project.address = JSON.parse(project.address);
      setState({
        name: project.name,
        coManagers: [],
        type: project.type,
        category: project.category,
        city: project.address.city,
        address: project.address.formattedAddress,
        streetNumber: project.address.number,
        country: project.address.country,
        startDate:
          project.from === null || project.from === ""
            ? moment().format()
            : project.from,
        endDate:
          project.to === null || project.to === ""
            ? moment().format()
            : project.to,
        ongoing: project.ongoing,
        desc: project.description,
        contactInfo: project.contactInfo,
        banner: project.image ? project.image.id: "",
        image: project.image ? `${keys.SERVER_IP}/images/${project.image.for}/${project.image.name}` : "",
        publish: project.publish
      });
    });
    return () => {
      isMounted = false;
    };
  }, [
    match.params.id,
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
        let formData = {
          type: state.type,
          category: state.category,
          address: {
            number: state.streetNumber,
            street: state.address,
            zip: "Test",
            city: state.city,
            country: state.country,
            formattedAddress: state.address,
            loc: {
              type: "Test",
              coordinates: [4.9886],
            },
          },
          to: !state.ongoing ? state.endDate : "",
          from: !state.ongoing ? state.startDate : "",
          ongoing: state.ongoing,
          description: state.desc,
          contactInfo: state.contactInfo,
          name: state.name,
          publish:state.publish
        };

        if(state.banner != ""){
          formData.image_id = state.banner;
        }
        _editProject(formData, isLogged, selectedProject[0].id).then((res) => {
          if (res.status === "error") {
            setToastAlert({
              show: true,
              message: res.message,
            });
            return;
          }
          setSelectedProject([{ ...res.data }]);
          localStorage.setItem(
            "selectedProject",
            JSON.stringify([{ ...res.data }])
          );
          setShowModal("updateProjectSuccess");
        });

        return;
      default:
        break;
    }
  };

  return (
    <MainContent id="editProject" subClass="small-sub-content">
      <div className="dashboard-header mb-2">
        <h3 style={{ color: "#5abdbf" }}>
          Edit project ( {tabs === "tab1" ? "1" : "2"} / 2)
        </h3>
      </div>
      <Form>
        <Transition
          animation="scale"
          duration={500}
          visible={tabs === "tab1" ? true : false}
        >
          <Container>
          
            <p style={{ color: "#5abdbf", marginBottom: "15px" }}>
              General Info
            </p>

            <Form.Group widths="equal">
              <Form.Field>
                <Form.Input
                  label="Project Title"
                  type="text"
                  value={state.name}
                  onChange={(e, { value }) =>
                    setState({ ...state, name: value })
                  }
                  placeholder="title..."
                  required
                />
              </Form.Field>
              {/* <Form.Field>
                <label>Add co-managers</label>
                <Dropdown
                  id="coManagers"
                  clearable
                  fluid
                  multiple
                  labeled
                  search
                  selection
                  onChange={(e, { value }) =>
                    setState({
                      ...state,
                      coManagers: [...state.coManagers, value],
                    })
                  }
                  options={countryOptions}
                  placeholder="Select Co-managers"
                />
              </Form.Field> */}
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Field>
                <Form.Select
                  fluid
                  id="ticketType"
                  label="Type"
                  value={state.type}
                  onClick={() => setShow({ id: "1", show: !show.show })}
                  className={`ticketType ${
                    show.show && show.id === "1" ? "active" : ""
                  }`}
                  required
                  onChange={(e, { value }) =>
                    setState({ ...state, type: value })
                  }
                  options={ProjectTicketTypeOptions}
                  placeholder="Select..."
                />
              </Form.Field>
              <Form.Field>
                <Form.Select
                  fluid
                  id="ticketType"
                  label="Category"
                  onClick={() => setShow({ id: "1", show: !show.show })}
                  className={`ticketType ${
                    show.show && show.id === "1" ? "active" : ""
                  }`}
                  required
                  value={state.category}
                  onChange={(e, { value }) =>
                    setState({ ...state, category: value })
                  }
                  options={ProjectCategoryOptions}
                  placeholder="Select..."
                />
              </Form.Field>
            </Form.Group>
            <br />
            <p style={{ color: "#5abdbf", marginBottom: "15px" }}>Location</p>

            <Form.Group widths="equal">
              <Form.Field>
                <Form.Input
                  label="City"
                  onChange={(e, { value }) =>
                    setState({ ...state, city: value })
                  }
                  required
                  value={state.city}
                  placeholder="City..."
                  autoComplete="nope"
                />
              </Form.Field>
              <Form.Field>
                <Form.Input
                  label="Address"
                  onChange={(e, { value }) =>
                    setState({ ...state, address: value })
                  }
                  value={state.address}
                  required
                  placeholder="Address..."
                  autoComplete="nope"
                />
              </Form.Field>
            </Form.Group>

            <Form.Group widths="equal">
              <Form.Field>
                <Form.Input
                  label="Street Number"
                  onChange={(e, { value }) =>
                    setState({ ...state, streetNumber: value })
                  }
                  required
                  value={state.streetNumber}
                  placeholder="Street Number..."
                  autoComplete="nope"
                />
              </Form.Field>
              <Form.Field>
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
                  autoComplete="nope"
                  options={ProjectCountryOptions}
                  required
                />
              </Form.Field>
            </Form.Group>
            <br />
            <DateTimeShared
              title="Date and Time"
              subTitle="Ongoing events (no specific time)"
              data={{
                ongoing: state.ongoing,
                startDate: state.startDate,
                endDate: state.endDate,
              }}
              setTimeDate={(value) => {
                if (value.type === "start") {
                  setState({ ...state, startDate: value.date });
                } else {
                  setState({ ...state, endDate: value.date });
                }
              }}
              ongoing={(value) => setState({ ...state, ongoing: value })}
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
              <UploadShared title="Add Banner*" id="banner" type="project" 
              setBanner={(value) => setState({ ...state, banner: value })}
              banner={state.image}
              />
            </Form.Group>
          </Container>
        </Transition>
        <div style={{ textAlign: "right" }}>
          {tabs === "tab2" && (
            <>
              <Button onClick={() => handleOnClick("back")}>Back</Button>
              <Button onClick={() => handleOnClick("finish")}>Finish!</Button>
            </>
          )}
          {tabs === "tab1" && (
            <Button onClick={() => handleOnClick("next")}>Next</Button>
          )}
        </div>
      </Form>
    </MainContent>
  );
};

export default EditProject;
