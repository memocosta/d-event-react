import React from "react";
import { Grid } from "semantic-ui-react";
import TicketCards from "../../shared/ticketCards";

const FoodTickets = ({ data }) => {
  return (
    <div className="mb-2">
      <div className="hero-content">
        <div className="hero-title manage-tickets">
          <p> Food Tickets </p>
        </div>
        <Grid stackable>
          <Grid.Row stretched>
            {data.length > 0 ? (
              data.map((ticket, i) => (
                <TicketCards
                key={i}
                ticketID={ticket.id}
                name={ticket.name}
                price={ticket.price}
                quantity={ticket.quantity}
                image={ticket.image ? ticket.image : ""}
                exchangeable={ticket.exchangeable}
                refundable={ticket.refundable}
                validStartDate={ticket.from}
                validEndDate={ticket.to}
                validity={ticket.validity}
                current_quantity={ticket.current_quantity}
                />
              ))
            ) : (
              <div
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <p>No tickets here</p>
              </div>
            )}
          </Grid.Row>
        </Grid>
      </div>{" "}
    </div>
  );
};

export default FoodTickets;
