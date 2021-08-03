import React from "react";
import { Form, Table, Button } from "semantic-ui-react";
import MainContent from "../../shared/mainContent";

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

const Taxes = () => {
  return (
    <MainContent id="taxes">
      <h2 style={{ color: "#5abdbf" }}>Manage VAT</h2>
      <div id="taxes-container" className="taxes-container">
        {/* <div className="country-selection">
          <Form.Select
            label="Country: "
            options={countryOptions}
            search
            placeholder="Select"
          />
        </div> */}
        <div className="taxes-table">
          <Table id="taxesTable" textAlign="center" celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Items</Table.HeaderCell>
                <Table.HeaderCell>Money Exchange</Table.HeaderCell>
                <Table.HeaderCell>Price (In Money Exchange)</Table.HeaderCell>
                <Table.HeaderCell>Value (&euro;)</Table.HeaderCell>
                <Table.HeaderCell>VAT Rate (%)</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>Beer</Table.Cell>
                <Table.Cell>Drink Token</Table.Cell>
                <Table.Cell>2</Table.Cell>
                <Table.Cell>2,40 &euro;</Table.Cell>
                <Table.Cell textAlign="left">
                  <Form.Input
                    className="vat-input"
                    type="text"
                    style={{ width: "100%" }}
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Coca</Table.Cell>
                <Table.Cell>Drink Token</Table.Cell>
                <Table.Cell>3</Table.Cell>
                <Table.Cell>6,00 &euro;</Table.Cell>
                <Table.Cell>
                  <Form.Input
                    className="vat-input"
                    type="text"
                    style={{ width: "100%" }}
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Champagne</Table.Cell>
                <Table.Cell>Drink Token</Table.Cell>
                <Table.Cell>4</Table.Cell>
                <Table.Cell>40,80 &euro;</Table.Cell>
                <Table.Cell>
                  <Form.Input
                    className="vat-input"
                    type="text"
                    style={{ width: "100%" }}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
        <div className="taxes-table">
          <Table
            id="ticketsTaxesTable"
            style={{ width: "70%" }}
            textAlign="center"
            celled
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Items</Table.HeaderCell>
                <Table.HeaderCell>Money Exchange</Table.HeaderCell>
                <Table.HeaderCell>Price (In Money Exchange)</Table.HeaderCell>
                <Table.HeaderCell>Value (&euro;)</Table.HeaderCell>
                <Table.HeaderCell>VAT Rate (%)</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>Beer</Table.Cell>
                <Table.Cell>Drink Token</Table.Cell>
                <Table.Cell>2</Table.Cell>
                <Table.Cell>2,40 &euro;</Table.Cell>
                <Table.Cell textAlign="left">
                  <Form.Input
                    className="vat-input"
                    type="text"
                    style={{ width: "100%" }}
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Coca</Table.Cell>
                <Table.Cell>Drink Token</Table.Cell>
                <Table.Cell>3</Table.Cell>
                <Table.Cell>6,00 &euro;</Table.Cell>
                <Table.Cell>
                  <Form.Input
                    className="vat-input"
                    type="text"
                    style={{ width: "100%" }}
                  />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Champagne</Table.Cell>
                <Table.Cell>Drink Token</Table.Cell>
                <Table.Cell>4</Table.Cell>
                <Table.Cell>40,80 &euro;</Table.Cell>
                <Table.Cell>
                  <Form.Input
                    className="vat-input"
                    type="text"
                    style={{ width: "100%" }}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>

        <div style={{ width: "70%" }}>
          <div className="vatTable">
            <div className="vatTitle">
              <p>VAT on unused tickets: </p>
            </div>
            <div className="vatValue">
              <Form.Input
                type="text"
                className="vat-input"
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <p style={{ marginTop: "5px", color: "#5abdbf", fontSize: "12px" }}>
            Unused titckets can be considered as donations, it is up to you to
            check with your accountant how you will treat these tickets.
          </p>
        </div>

        <div className="confirmAction">
          <Button primary content="Confirm" />
        </div>
      </div>
    </MainContent>
  );
};

export default Taxes;
