import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Dropdown, Icon } from "semantic-ui-react";
import StateContext from "../../context/stateContext";

const projectOptions = [{ key: "0", text: "No Projects", value: "0" }];

const Navbar = () => {
    const { show, setShow, setSelectedProject, selectedProject, projects, setLoading, setIsLogged } = useContext(StateContext);
    const [projectName, setProjectName] = useState([]);
    const [defaultProject, setDefaultProject] = useState("");

    useEffect(() => {
        let isMounted = true;
        if (!isMounted) return;
        if (projects.length === 0) {
            setProjectName([]);
            setDefaultProject("0");
            return;
        }
        let projectNames = [];

        projects.map((project, i) => {
            return projectNames.push({
                key: i,
                text: project.name,
                value: project.id,
            });
        });

        setProjectName(projectNames);
        setDefaultProject(selectedProject[0].id);

        return () => {
            isMounted = false;
        };
    }, [selectedProject, projects]);

    const handleOnChange = (e, { value }) => {
        const index = projects.findIndex((obj) => obj.id === value);
        setLoading(true);
        setSelectedProject([projects[index]]);
        localStorage.setItem("selectedProject", JSON.stringify([projects[index]]));
        setDefaultProject(value);
    };

    const handleOnClick = () => {
        setShow(!show);
    };

    const handleOnClickLogOut = () => {
        localStorage.removeItem('loginData');
        localStorage.removeItem("selectedProject");
        setIsLogged('')
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                height: "70px",
            }}
            className="main-nav"
        >
            <div className="navBar navBar-container">
                <Icon
                    name="bars"
                    size="large"
                    className="icon-container"
                    style={{ cursor: "pointer" }}
                    onClick={handleOnClick}
                />
                <div className="select-section">
                    <Dropdown
                        // placeholder="Select Project"
                        options={projectName.length > 0 ? projectName : projectOptions}
                        scrolling
                        disabled={defaultProject === "0" ? true : false}
                        value={defaultProject}
                        className="nav-dropdownBtn"
                        onChange={handleOnChange}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        width: "100%",
                    }}
                >
                    <div style={{ marginRight: "20px" }}>
                        <Link to="/wallet">
                            <Button color="black">Wallet <FontAwesomeIcon icon={faWallet} size="sm" /></Button>

                        </Link>
                    </div>
                    <div style={{ marginRight: "20px" }}>
                        <Link to="/createProject">
                            <Button color="black">Create New Project</Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Dropdown
                button
                className='icon'
                icon='user'
                style={{
                    padding: "30px",
                    cursor: "pointer",
                    borderRight: "1px solid #000",
                    backgroundColor: "#292b48",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "20px"
                }}
            >
                <Dropdown.Menu
                    direction="left"
                    style={{
                        backgroundColor: "#292b48",
                    }}>
                    <Dropdown.Item>
                        <Link to='/account/settings'>Account Settings</Link>
                    </Dropdown.Item>
                    <Dropdown.Item text="Logout " onClick={handleOnClickLogOut} />
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default Navbar;
