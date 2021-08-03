import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Link } from 'react-router-dom';


const CreateNewProject = () => {
    return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 40px - 25px - 20px - 25px)",
          }}
        >
          <Link to="/createProject">
            <div
              style={{
                backgroundColor: "#eee",
                height: "133px",
                borderRadius: "10px",
                overflow: "hidden",
                width: "250px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#5abdbf",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                <h2 style={{ color: "#333" }}>Create your first project</h2>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px'
              }}>
  
              <FontAwesomeIcon icon="plus-square" style={{ fontSize: "40px" }} />
              </div>
  
            </div>
          </Link>
        </div>
      );
}

export default CreateNewProject;