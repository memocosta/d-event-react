import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Grid } from "semantic-ui-react";
import BarChart from "../../components/charts/dashboardCharts/barChart";
import CashSalesChart from "../../components/charts/dashboardCharts/cashSalesChart";
import SalesPerItem from "../../components/charts/dashboardCharts/salesPerItemChart";
import SalesPerPOSChart from "../../components/charts/dashboardCharts/salesPerPOSchart";
import Widgets from "../../components/charts/dashboardCharts/widgets";
import TicketHeader from "../../components/dashboardComponents/ticketHeader";
import StateContext from "../../context/stateContext";
import { _getPOSdata, _getSalesPerTicktsChart } from "../../controllers/AxiosRequests";
import CardShared from "../../shared/cardShared";
import CreateNewProject from "../../shared/createNewProject";
import LoadingScreen from "../../shared/loadingScreen";
import MainContent from "../../shared/mainContent";

// const posOptions = [
//   { key: '0', text: 'POS 1', value: 'pos1' },
//   {key: '1', text: 'POS 2', value: 'pos2'},
//   {key: '2', text: 'POS 3', value: 'pos3'}
  
// ]
const Revenue = () => {
  const { isLogged, selectedProject, loading, setLoading } = useContext(StateContext);
  const [ticktsSales, setTicketsSales] = useState([]);
  const [filterType, setFilterType] = useState('week');
  const [revenueCheckbox, setRevenueCheckBox] = useState("Gross");
  const [salesCheckBox, setSalesCheckBox] = useState("Gross");
  const [selectedPos, setSelectedPos] = useState("");
  const [posOptions, setPosOptions] = useState([])
  const history = useHistory()

  const handleCheckBox = (checked, type) => {
    switch (type) {
      case "revenue":
        if (checked) {
          setRevenueCheckBox("Net");
        } else {
          setRevenueCheckBox("Gross");
        }
        return;
      case "sales":
        if (checked) {
          setSalesCheckBox("Net");
        } else {
          setSalesCheckBox("Gross");
        }
        return;
      default:
        break;
    }
  };

  useEffect(() => {
    console.log(isLogged);
    let isMounted = true;
    if (!isMounted) return;
    if(!selectedProject || !selectedProject[0]) {history.push('/'); return;}
    if (!isMounted || selectedProject.length === 0) {
      setLoading(false);
      return
    };
    setLoading(true);

    _getSalesPerTicktsChart(isLogged,selectedProject[0].id).then(res => {
      setLoading(false);
      console.log(res.data);
      setTicketsSales(res.data);
    })
    _getPOSdata(selectedProject[0].id, isLogged).then(res => {
      if (res.error) {
        return
      }
      let options = res.data.map((pos)=> {return {key: pos.id, text:pos.name, value: pos.id}})
      if(res.data.length > 0){
        setSelectedPos(res.data[0].id)
      }
      setPosOptions(options)
    })
    return () => {
      isMounted = false;
    };
  }, [selectedProject, isLogged]);

  if (loading) {
    return <LoadingScreen />;
  }
  if (selectedProject.length === 0) {
    return <CreateNewProject />
  }
  return (
    <MainContent id="revenue">
      <div className="dashboard-header mb-2 pl-20">
        <p>Revenue</p>
        <div>
          <Form.Checkbox
            toggle
            onChange={(e, { checked }) => handleCheckBox(checked, "revenue")}
          />
          <p
            style={{
              color: "#eee",
              fontWeight: "normal",
              marginRight: "10px",
            }}
          >
            {revenueCheckbox}
          </p>
        </div>
      </div>
      <div id="salesPerChannel" className="header-content">
        <p>Sales per Channel</p>
        <Widgets />
      </div>
      <div className="mb-2">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={16}>
              <CardShared id="salesPerTickets" title="Sales Per Ticket">
                <div
                  style={{
                    marginTop: "-30px",
                    marginBottom: "20px",
                  }}
                >
                  <Form.Checkbox
                    toggle
                    onChange={(e, { checked }) =>
                      handleCheckBox(checked, "sales")
                    }
                  />
                  <p
                    style={{
                      color: "#eee",
                      fontWeight: "normal",
                      marginBottom: 0,
                    }}
                  >
                    {salesCheckBox}
                  </p>
                </div>
                {/* TICKET HEADER VALUES */}
                <Grid>
                  <Grid.Row columns="3">
                  {ticktsSales.slice(0, 3).map((i, index) => {
                        return <TicketHeader title={i.ticket_name} value={i.ticket_price} bg={index === 0 ? `#6a1ccd` : index === 1 ? "#3d4465" : "#28c76f"} key={index}/>
                    })}
                    {/* <TicketHeader title="Ticket 2" value={2300} />
                    <TicketHeader title="Ticket 3" value={6400} /> */}
                  </Grid.Row>
                </Grid>

                {/* BAR CHART */}
                <div className="card-bar-chart">
                  <BarChart  tickets={ticktsSales} filter={filterType}/>
                </div>
              </CardShared>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>

      <div className="mb-2">
        <CardShared id="" title="">
          <Grid
            stackable
            verticalAlign="middle"
            textAlign="center"
            style={{ width: "100%", marginTop: "10px" }}
          >
            <Grid.Row columns={2}>
              <Grid.Column>
                <p>Cash Sales</p>
                <CashSalesChart />
              </Grid.Column>
              <Grid.Column>
                <p>Sales per Item</p>
                <div style={{ position: "relative" }}>
                  <SalesPerItem />
                  {/* <p
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "fit-content",
                    }}
                  >
                    In-Stores Sales <br />
                    <span>30</span>{" "}
                  </p> */}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </CardShared>
      </div>

      <div className="mb-2 secondary_bgColor">
        <p style={{ fontWeight: "bold" }}>Sales per POS</p>
        <div style={{marginBottom: '10px'}}>
                    <Form.Select options={posOptions} id='posSelect'
                     value={selectedPos} 
                     onChange={(e, { value }) =>
                          setSelectedPos(value)
                        }
                     />
        </div>
        <SalesPerPOSChart pos={selectedPos}/>
      </div>
    </MainContent>
  );
};

export default Revenue;
