import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

import { InvoiceContentToPrint } from './InvoiceContentToPrint';

const PrintInvoice = () => {
  const componentRef = useRef();

  return (
    <div>
      <ReactToPrint
        // trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      />
      {/* <InvoiceContentToPrint ref={componentRef} /> */}
    </div>
  );
}

export default PrintInvoice;