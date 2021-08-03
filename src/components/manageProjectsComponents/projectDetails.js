import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Checkbox, Form, Grid, Image } from "semantic-ui-react";
import CardShared from "../../shared/cardShared";
import ProjectInfoShared from "../../shared/projectInfoShared";
import { Link } from "react-router-dom";
import moment from "moment";
import StateContext from "../../context/stateContext";
import { keys } from "../../config/keys";
import { _deleteProject, _editProject, _getUserProjects } from "../../controllers/AxiosRequests";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ProjectDetails = ({ data, url }) => {
    const { selectedProject, isLogged, setLoading, setToastAlert, setProjects, setSelectedProject } = useContext(StateContext);
    const [projectData, setProjectData] = useState([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if (!isMounted) return;
        if (!data || data.length === 0) {
            data = selectedProject;
        }
        data[0]["address"] = typeof data[0].address === "string" ? JSON.parse(data[0].address) : data[0].address;
        setProjectData(data);
        return () => {
            isMounted = false;
        };
    }, [data]);

    const handleOnCopy = () => {
        setCopied(true);
    };

    const handleToggle = (e, { checked }) => {
        let project = [...projectData]
        project[0].publish = checked;
        setProjectData(project);

        _editProject({ publish: checked }, isLogged, selectedProject[0].id).then((res) => {
            if (res.status === "error") {
                setToastAlert({
                    show: true,
                    title: "Can't Update the Project",
                    message: res.message,
                });
                return;
            }
            setSelectedProject([{ ...res.data }]);
            localStorage.setItem(
                "selectedProject",
                JSON.stringify([{ ...res.data }])
            );
        });
    };

    const handleDeleteProject = (id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="custom-ui">
                        <h1>Are you sure?</h1>
                        <p>You want to delete this Project?</p>
                        <div className="buttons">
                            <button onClick={onClose}>No</button>
                            <button
                                onClick={() => {
                                    setLoading(true);
                                    _deleteProject(isLogged, id).then((res) => {
                                        if (res.status === "error") {
                                            setLoading(false);
                                            setToastAlert({
                                                show: true,
                                                message: "Something went wrong, please Try Again!",
                                            });
                                            return;
                                        }
                                        _getUserProjects(isLogged).then((project) => {
                                            if (project.data.length === 0) {
                                                setLoading(false);
                                                setProjects([]);
                                                setSelectedProject([]);
                                                setLoading(false);
                                                return;
                                            } else {
                                                setProjects(project.data);
                                                localStorage.setItem("selectedProject", JSON.stringify([project.data[0]]));
                                                setSelectedProject([project.data[0]]);
                                                setLoading(false);
                                                return;
                                            }
                                        });
                                    });
                                    onClose();
                                }}
                            >
                                Yes, Delete it!
                            </button>
                        </div>
                    </div>
                );
            },
        });
    };
    return (
        <CardShared id="projectDetails" title="">
            <div className="project-details-header mb-2">
                <p> Project Details <Image src={projectData.length > 0 && projectData[0].image ? `${keys.SERVER_IP}/images/${projectData[0].image.for}/${projectData[0].image.name}` : "/images/favicon.png"} width="50px" /> </p>
                <div style={{ display: 'flex' }}>
                    <Link to={`${url}/editProject/${projectData.length > 0 ? projectData[0].id : ""}`}>
                        <div className="edit-action">
                            <p> Edit Project </p>
                        </div>
                    </Link>
                    <FontAwesomeIcon
                        id="deleteItemIcon"
                        icon={faTrash}
                        size="1x"
                        color="red"
                        style={{ color: "red", marginLeft: "8px" }}
                        onClick={() => handleDeleteProject(projectData[0].id)}
                    />
                </div>
            </div>
            <Grid stackable>
                <Grid.Row columns="2">
                    <Grid.Column>
                        <div className="col-title">
                            <p> General Info </p>
                        </div>
                        <Grid stackable>
                            <Grid.Row columns="2">
                                <ProjectInfoShared title="Project Info" info={projectData.length > 0 ? projectData[0].name : ""} />
                                <Grid.Row columns="1">
                                    <ProjectInfoShared title="Type" info={projectData.length > 0 ? projectData[0].type : ""} />
                                    <ProjectInfoShared title="Category" info={projectData.length > 0 ? projectData[0].category : ""} />
                                </Grid.Row>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>

                    <Grid.Column>
                        <div className="col-title">
                            <p> Location </p>
                        </div>
                        <Grid stackable>
                            <Grid.Row columns="2">
                                <ProjectInfoShared title="City" info={projectData.length > 0 && projectData[0].address.city} />
                                <ProjectInfoShared title="Address" info={ projectData.length > 0 ? projectData[0].address.formattedAddress : "" } />
                                <ProjectInfoShared title="Street Number" info={ projectData.length > 0 ? projectData[0].address.number : "" } />
                                <ProjectInfoShared title="Country" info={ projectData.length > 0 ? projectData[0].address.country : "" } />
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns="2" style={{ marginTop: "20px" }}>
                    {projectData.length > 0 && (
                        <>
                            {projectData[0].from !== "" && projectData[0].to !== "" && !projectData[0].ongoing && (
                                <Grid.Column>
                                    <div className="col-title">
                                        <p> Date and Time </p>
                                    </div>
                                    <Grid stackable>
                                        <Grid.Row columns="2">
                                            {projectData.length > 0 && projectData[0].from !== "" && (
                                                <>
                                                    <ProjectInfoShared title="Start Date" info={ projectData.length > 0 && moment(projectData[0].from).format("MM-DD-YYYY") } />
                                                    <ProjectInfoShared title="Start Time" info={ projectData.length > 0 ? moment(projectData[0].from).format("hh:mm A") : "" } />
                                                </>
                                            )}

                                            {projectData.length > 0 && projectData[0].to !== "" && (
                                                <>
                                                    <ProjectInfoShared title="End Date" info={ projectData.length > 0 && moment(projectData[0].to).format("MM-DD-YYYY") } />
                                                    <ProjectInfoShared title="End Time" info={ projectData.length > 0 ? moment(projectData[0].to).format("hh:mm A") : "" } />
                                                </>
                                            )}
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                            )}
                        </>
                    )}

                    <Grid.Column>
                        <div className="hero-flex">
                            <div className="hero-flex-content">
                                <p>
                                    Ongoing event (no specific dates):{" "}
                                    <span> {projectData.length > 0 && projectData[0].ongoing ? "YES" : "NO"} </span>
                                </p>
                            </div>
                            <div className="hero-flex-content">
                                <p>Share your event: </p>
                                <CopyToClipboard
                                    text={`https://d-event.io/${projectData.length > 0 ? projectData[0].name : ""
                                        }`}
                                    onCopy={handleOnCopy}
                                >
                                    <div className="share-content">
                                        <p> https://d-event.io/{projectData.length > 0 && projectData[0].name}{" "}</p>
                                        <FontAwesomeIcon icon={copied ? "clipboard" : "copy"} />
                                    </div>
                                </CopyToClipboard>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                {projectData[0] && <Grid.Row columns="3">
                    <Grid.Column></Grid.Column><Grid.Column></Grid.Column>
                    <Grid.Column>
                        <Form.Group>
                            <Form.Field>
                                <div style={{ marginTop: "10px" }}>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                                        <p style={{ color: "#c5c7de" }}>Publish / Unpublish</p>
                                        <Checkbox id="publishToggle" checked={projectData[0].publish} toggle onChange={handleToggle} />
                                    </div>
                                </div>
                            </Form.Field>
                        </Form.Group>
                    </Grid.Column>
                </Grid.Row>}
            </Grid>
        </CardShared>
    );
};

export default ProjectDetails;
