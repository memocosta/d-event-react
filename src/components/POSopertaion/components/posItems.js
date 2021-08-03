import React, { useState } from 'react'
import { Grid, Image } from 'semantic-ui-react';
import { keys } from '../../../config/keys';

const POSitems = ({data, setSelected, selected}) => {
    const [state, setState] = useState({background: '#eee'})
    
    const handleSelection = (selectedID) => {
        setSelected(selectedID)
        // setState({ background: "#d6af00" });
    }
    return (
      <Grid.Column width="3">
        <div
          style={{
            background: '#eee',
            padding: "5px",
            margin: "0 auto",
                    borderRadius: "10px",
            cursor: 'pointer'
                }}
                onClick={() => handleSelection(data)}
        >
          <Image
            src={data.image === null ?"/images/favicon.png" : `${keys.SERVER_IP}/images/${data.image.for}/${data.image.name}`}
            style={{
              width: "155px",
              height: "100%",
              objectFit: "contain",
              margin: "0 auto",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: '12px', fontWeight: "bold" }}>{data.name}</p>
          <p style={{ fontSize: '12px', fontWeight: "bold" }}>{data.price}{` ${data.type || data.exchange}`}</p>
        </div>
      </Grid.Column>
    );
}
 
export default POSitems;