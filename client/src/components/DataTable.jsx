import { useState } from "react";

import { FileText, Check } from "lucide-react"; // import icons
import { Square, CheckSquare } from "lucide-react";

const sampleData = [
  {
    id: "1",
    orderId: "B13789",
    date: "Feb 08, 2022",
    particulars: "DNR PRINT (SUB-LEVEL)",
    rate: 90.0,
    quantity: 12,
    mtr: "11,941",
    credit: "571,119.41",
    debit: "-",
    balance: "571,119.41",
    billsCHQ: "869",
    days: 471,
    dueDate: "20-March-2025"
  }
];

const DataTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(
      selectedRows.length === sampleData.length
        ? []
        : sampleData.map((row) => row.id)
    );
  };

const Checkbox = ({ checked, onCheckedChange }) => (
              <button
                            type="button"
                            onClick={onCheckedChange}
                            className="focus:outline-none"
              >
                            {checked ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>
);

return (
              <div className="bg-background">
                            <div className="overflow-x-auto">
                                          <table className="w-full">
                                                        <thead>
                                                                      <tr className="border-b border-border bg-muted/50">
                                                                                    <th className="p-4 text-left">
                                                                                                  <Checkbox
                                                                                                                checked={selectedRows.length === sampleData.length}
                                                                                                                onCheckedChange={toggleAllRows}
                                                                                                  />
                                                                                    </th>
                                                                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                                                                  <FileText size={16} />
                                                                                                  Order Id
                                                                                    </th>
                                                                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                                                                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Particulars</th>
                                                                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Rate</th>
                                                                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Quantity</th>
                                                                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">MTR</th>
                                                                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Credit</th>
                                                                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Debit</th>
                                                                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Balance</th>
                                                                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Bills/ CHQ</th>
                                                                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Days</th>
                                                                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Due Date</th>
                                                                      </tr>
                                                        </thead>
                                                        <tbody>
                                                                      {sampleData.map((row) => (
                                                                                    <tr
                                                                                                  key={row.id}
                                                                                                  className="border-b border-border hover:bg-muted/30 transition-colors"
                                                                                    >
                                                                                                  <td className="p-4">
                                                                                                                <Checkbox
                                                                                                                              checked={selectedRows.includes(row.id)}
                                                                                                                              onCheckedChange={() => toggleRowSelection(row.id)}
                                                                                                                />
                                                                                                  </td>
                                                                                                  <td className="p-4 text-sm text-foreground flex items-center gap-1">
                                                                                                                <Check size={14} className="text-green-500" />
                                                                                                                {row.orderId}
                                                                                                  </td>
                                                                                                  <td className="p-4 text-sm text-muted-foreground">{row.date}</td>
                                                                                                  <td className="p-4 text-sm text-foreground">{row.particulars}</td>
                                                                                                  <td className="p-4 text-sm text-foreground">{row.rate.toFixed(2)}</td>
                                                                                                  <td className="p-4 text-sm text-foreground">{row.quantity}</td>
                                                                                                  <td className="p-4 text-sm text-foreground">{row.mtr}</td>
                                                                                                  <td className="p-4 text-sm text-foreground">{row.credit}</td>
                                                                                                  <td className="p-4 text-sm text-muted-foreground">{row.debit}</td>
                                                                                                  <td className="p-4 text-sm text-foreground">{row.balance}</td>
                                                                                                  <td className="p-4 text-sm text-foreground">{row.billsCHQ}</td>
                                                                                                  <td className="p-4 text-sm text-foreground">{row.days}</td>
                                                                                                  <td className="p-4 text-sm text-foreground">{row.dueDate}</td>
                                                                                    </tr>
                                                                      ))}
                                                        </tbody>
                                          </table>
                            </div>
              </div>
);
};

export default DataTable;
