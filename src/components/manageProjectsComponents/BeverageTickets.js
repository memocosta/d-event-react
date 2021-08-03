import React from "react";
import { Grid } from "semantic-ui-react";
import TicketCards from "../../shared/ticketCards";

const BeverageTickets = ({data}) => {
  return (
    data.length > 0 && (
      <>
        <div className="hero-content">
          <div className="hero-title manage-tickets">
            <p> Beverage Tickets </p>
          </div>
          <Grid stackable>
            <Grid.Row>
              {data.length > 0 &&
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
                ))}
            </Grid.Row>
          </Grid>
        </div>{" "}
      </>
    )
  );
};

export default BeverageTickets;
