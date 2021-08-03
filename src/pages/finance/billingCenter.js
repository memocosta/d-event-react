import React, { useContext, useEffect , useState} from "react";
import MainContent from "../../shared/mainContent";
import { Form, Grid, Button, Table, Icon } from "semantic-ui-react";
import TotalRevenueChart from "../../components/charts/totalRevenueChart";
import StateContext from "../../context/stateContext";
import { _getBillingCenter } from "../../controllers/AxiosRequests";
import { useHistory } from "react-router-dom";
import LoadingScreen from "../../shared/loadingScreen";
import CreateNewProject from "../../shared/createNewProject";

const years = [
  { key: "0", text: "2020", value: "2020" },
  { key: "1", text: "2021", value: "2021" },
  { key: "2", text: "2022", value: "2022" },
  { key: "3", text: "2023", value: "2023" },
  { key: "4", text: "2024", value: "2024" },
  { key: "5", text: "2025", value: "2025" },
  { key: "6", text: "2026", value: "2026" },
  { key: "7", text: "2027", value: "2027" },
];
const options = [
  { key: "0", text: "Action 1", value: "action1" },
  { key: "1", text: "Action 2", value: "action2" },
  { key: "2", text: "Action 3", value: "action3" },
  { key: "3", text: "Action 4", value: "action4" },
];
const BillingCenter = () => {
  const { isLogged, selectedProject, setLoading , loading} = useContext(StateContext);
  const [year, setYear] = useState("2020")
  const [billingData, setBillingData] = useState(null);
  const [actions, setActions] = useState({actionsArray :[],selectedAction : ""});
  const history = useHistory()

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

    _getBillingCenter(isLogged,selectedProject[0].id, year).then(res => {
      setLoading(false);
      let options = [{ key: 0, text: "All", value: "" }];
      res.data.details.forEach((element, index) => {
        options.push({ key: index+1, text: element.action, value: element.action })
      });
      setActions({actionsArray : options, selectedAction : ""});
      console.log(res.data);
      setBillingData(res.data);
    })
    return () => {
      isMounted = false;
    };
  }, [selectedProject, isLogged, year]);

  if (loading) {
    return <LoadingScreen />;
  }
  if (selectedProject.length === 0) {
    return <CreateNewProject />
  }

  return (
    <MainContent id="billingCenter">

      <div id="billing-container" className="billing-container secondary_bgColor">
      <h2 style={{ color: "#5abdbf" }}>Billing Center</h2>

        <div className="country-selection">
          <Form.Select
            label="Select year: "
            options={years}
            placeholder="Select"
            onChange={(e,{value}) => setYear(value)}
          />
          <Button icon="download" content="ALL INVOICES" />
        </div>
        <div style={{ marginTop: "50px" }}>
          <Grid>
            <Grid.Row>
              <Grid.Column width="16">
                <p
                  style={{
                    color: "#5abdbf",
                    width: "850px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Total Revenue
                </p>
                <TotalRevenueChart data={billingData}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>

        <div style={{ marginTop: "30px" }}>
          <p style={{ color: "#5abdbf", fontWeight: "bold" }}>Details</p>
          <div className="detailsTable" style={{ marginTop: "20px" }}>
            <Table id="billingTable" celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <Form.Select options={actions.actionsArray} placeholder="Actions"
                    value={actions.selectedAction}
                     onChange={(e,{value}) => setActions({...actions,selectedAction: value})}
                     />
                  </Table.HeaderCell>
                  <Table.HeaderCell style={{ cursor: "pointer" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ color: "#5abdbf", marginBottom: 0 }}>Date</p>

                      <div className="filter-icons">
                        <Icon name="angle up" />
                        <Icon name="angle down" />
                      </div>
                    </div>
                  </Table.HeaderCell>
                  <Table.HeaderCell style={{ cursor: "pointer" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ color: "#5abdbf", marginBottom: 0 }}>
                        Amount
                      </p>

                      <div className="filter-icons">
                        <Icon name="angle up" />
                        <Icon name="angle down" />
                      </div>
                    </div>
                  </Table.HeaderCell>
                  <Table.HeaderCell>Fee</Table.HeaderCell>
                  <Table.HeaderCell>VAT</Table.HeaderCell>
                  <Table.HeaderCell>Total Taxes Incl.</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {billingData && billingData.details.map((transaction, index) =>{
                  return (actions.selectedAction === "" ||  actions.selectedAction === transaction.action ?<Table.Row key={index+1}>
                  <Table.Cell>{transaction.action}</Table.Cell>
                  <Table.Cell textAlign="right">{transaction.date}</Table.Cell>
                  <Table.Cell textAlign="right">{transaction.amount} &euro;</Table.Cell>
                  <Table.Cell textAlign="right">{transaction.fee} &euro;</Table.Cell>
                  <Table.Cell textAlign="right">{transaction.vat} &euro;</Table.Cell>
                  <Table.Cell textAlign="right">{transaction.total_tax} &euro;</Table.Cell>
                </Table.Row> : "")
                })
                }
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </MainContent>
  );
};

export default BillingCenter;
