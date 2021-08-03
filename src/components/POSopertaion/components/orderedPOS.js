import React from 'react'
import { Icon, Image } from 'semantic-ui-react';

const OrderedPOS = ({id, quantity, setDelete, name, exchange, price, image}) => {
  console.log('====================================');
  console.log(image);
  console.log('====================================');
    return (
      
      <li id={id}>
        <div className="posOrderList-img">
          <Image src={`${image}`} />
        </div>
        <div className="posOrderList-title">
          <p>{name}</p>
          <p>{price} ({exchange})</p>
        </div>
        <div className="posOrderList-quantity">
          <p>{quantity}</p>
        </div>
        <div className="posOrderList-delete" onClick={() => setDelete(id)}>
          <Icon name="times circle"  />
        </div>
      </li>
    );
}
 
export default OrderedPOS;