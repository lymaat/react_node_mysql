import React from "react";

export const InvoiceContentToPrint = React.forwardRef((props, ref) => {
    return (
      <div ref={ref} style={{padding:10}}>
        <div style={{borderBottom:"1px solid "}}>
            <div>NIT COFFEE</div>
            <div>Your Choice</div>
        </div>
      </div>
    );
  });