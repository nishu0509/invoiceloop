import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

export default function Dashboard() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ clientName: "", clientEmail: "", amount: "", dueDate: "" });
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate-asc");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchInvoices();
  }, []);

  const authHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchInvoices = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/invoice/all`,
        authHeader()
      );
      setInvoices(res.data.invoices || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }
      setError("Could not load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ clientName: "", clientEmail: "", amount: "", dueDate: "" });
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/invoice/update/${editingId}`,
          formData,
          authHeader()
        );
        toast.success("Invoice updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/invoice/create`,
          formData,
          authHeader()
        );
        toast.success("Invoice created successfully");
      }
      resetForm();
      fetchInvoices();
    } catch (err) {
      const message = editingId
        ? "Could not update invoice. Please check the fields and try again."
        : "Could not create invoice. Please check the fields and try again.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (invoice) => {
    const newStatus = invoice.status === "Paid" ? "Pending" : "Paid";
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/invoice/update/${invoice._id}`,
        { status: newStatus },
        authHeader()
      );
      fetchInvoices();
      toast.success(`Marked as ${newStatus}`);
    } catch (err) {
      setError("Could not update status.");
      toast.error("Could not update status");
    }
  };

  const startEdit = (invoice) => {
    setFormData({
      clientName: invoice.clientName || "",
      clientEmail: invoice.clientEmail || "",
      amount: invoice.amount || "",
      dueDate: invoice.dueDate ? invoice.dueDate.slice(0, 10) : "",
    });
    setEditingId(invoice._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteInvoice = async (id) => {
    const confirmDelete = window.confirm("Delete this invoice? This cannot be undone.");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/invoice/delete/${id}`,
        authHeader()
      );
      if (editingId === id) resetForm();
      fetchInvoices();
      toast.success("Invoice deleted");
    } catch (err) {
      setError("Could not delete invoice.");
      toast.error("Could not delete invoice");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const downloadInvoicePdf = (invoice) => {
    const doc = new jsPDF();

    doc.setFont("times", "bold");
    doc.setFontSize(20);
    doc.text("InvoiceLoop", 14, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Centralized workspace to track, manage, and verify billing cycles.", 14, 27);

    doc.setDrawColor(200, 185, 168);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Invoice #${invoice._id.slice(-8).toUpperCase()}`, 14, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Status: ${invoice.status}`, 14, 49);
    doc.text(
      `Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-IN") : "—"}`,
      14,
      55
    );

    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 140, 42);
    doc.setFont("helvetica", "normal");
    doc.text(invoice.clientName || "", 140, 49);
    doc.text(invoice.clientEmail || "", 140, 55);

    autoTable(doc, {
      startY: 65,
      head: [["Description", "Amount"]],
      body: [["Professional services rendered", `Rs. ${Number(invoice.amount).toLocaleString("en-IN")}`]],
      foot: [["Total", `Rs. ${Number(invoice.amount).toLocaleString("en-IN")}`]],
      theme: "grid",
      headStyles: { fillColor: [26, 26, 26] },
      footStyles: { fillColor: [26, 26, 26], fontStyle: "bold" },
    });

    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      "Generated by InvoiceLoop",
      14,
      doc.internal.pageSize.height - 10
    );

    doc.save(`invoice-${invoice.clientName.replace(/\s+/g, "-").toLowerCase()}.pdf`);
    toast.success("PDF downloaded");
  };

  const isOverdue = (inv) =>
    inv.status !== "Paid" && inv.dueDate && new Date(inv.dueDate) < new Date();

  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "Paid")
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  const totalBilled = invoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  const uniqueClients = new Set(invoices.map((inv) => inv.clientEmail || inv.clientName)).size;

  const overdueCount = invoices.filter(isOverdue).length;

  const visibleInvoices = useMemo(() => {
    let result = [...invoices];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (inv) =>
          inv.clientName?.toLowerCase().includes(q) ||
          inv.clientEmail?.toLowerCase().includes(q)
      );
    }

    if (statusFilter === "Overdue") {
      result = result.filter(isOverdue);
    } else if (statusFilter !== "All") {
      result = result.filter((inv) => inv.status === statusFilter);
    }

    const [key, dir] = sortBy.split("-");
    result.sort((a, b) => {
      let valA, valB;
      if (key === "amount") {
        valA = Number(a.amount || 0);
        valB = Number(b.amount || 0);
      } else if (key === "dueDate") {
        valA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        valB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      } else {
        valA = a.clientName?.toLowerCase() || "";
        valB = b.clientName?.toLowerCase() || "";
      }
      if (valA < valB) return dir === "asc" ? -1 : 1;
      if (valA > valB) return dir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [invoices, search, statusFilter, sortBy]);

  const statusStyles = {
    Paid: "text-[#79947a] bg-[#79947a]/10",
    Pending: "text-[#b8894f] bg-[#b8894f]/10",
    Unpaid: "text-[#b85f4f] bg-[#b85f4f]/10",
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0f11] text-[#e0dcc8] p-4 sm:p-6 lg:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
        <div>
          <p className="text-[10px] tracking-widest uppercase mb-2 text-[#b8894f]">
            Overview
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif">Dashboard</h1>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-auto border border-[#2a2d30] text-[#e0dcc8] px-4 py-2 text-xs tracking-widest uppercase hover:border-[#b85f4f] hover:text-[#b85f4f] transition-colors rounded"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="border border-[#b85f4f]/40 bg-[#b85f4f]/10 text-[#e0a89c] text-xs px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <StatCard label="Total Billed" value={`₹${totalBilled.toLocaleString("en-IN")}`} accent="#e0dcc8" />
        <StatCard label="Outstanding" value={`₹${totalOutstanding.toLocaleString("en-IN")}`} accent="#b8894f" />
        <StatCard label="Overdue" value={overdueCount} accent="#b85f4f" />
        <StatCard label="Clients" value={uniqueClients} accent="#79947a" />
      </div>

      <div className="border border-[#1e2022] rounded mb-8">
        <div className="px-4 sm:px-6 py-4 border-b border-[#1e2022] flex items-center justify-between">
          <h2 className="text-sm tracking-widest uppercase text-[#888]">
            {editingId ? "Edit Invoice" : "New Invoice"}
          </h2>
          {editingId && (
            <span className="text-[10px] tracking-widest uppercase text-[#b8894f]">
              Editing existing invoice
            </span>
          )}
        </div>
        <form onSubmit={handleSave} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 text-[#888]">Client Name</label>
            <input
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              placeholder="Client name"
              className="w-full bg-transparent border-b border-[#2a2d30] py-2 focus:outline-none focus:border-[#b8894f] transition-colors placeholder:text-[#555]"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 text-[#888]">Client Email</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              required
              placeholder="client@email.com"
              className="w-full bg-transparent border-b border-[#2a2d30] py-2 focus:outline-none focus:border-[#b8894f] transition-colors placeholder:text-[#555]"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 text-[#888]">Amount</label>
            <input
              type="number"
              min="0"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="0"
              className="w-full bg-transparent border-b border-[#2a2d30] py-2 focus:outline-none focus:border-[#b8894f] transition-colors placeholder:text-[#555]"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 text-[#888]">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b border-[#2a2d30] py-2 focus:outline-none focus:border-[#b8894f] transition-colors"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-[#e0dcc8] text-[#0d0f11] px-6 py-3 text-xs font-medium tracking-[0.15em] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "SAVING..." : editingId ? "UPDATE INVOICE" : "+ CREATE INVOICE"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 text-xs font-medium tracking-[0.15em] border border-[#2a2d30] hover:border-[#b85f4f] hover:text-[#b85f4f] transition-colors"
              >
                CANCEL
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="border border-[#1e2022] rounded">
        <div className="px-4 sm:px-6 py-4 border-b border-[#1e2022] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <h2 className="text-sm tracking-widest uppercase text-[#888]">All Invoices</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client name or email..."
              className="bg-[#15171a] border border-[#2a2d30] rounded px-3 py-2 text-xs w-full sm:w-56 focus:outline-none focus:border-[#b8894f] placeholder:text-[#555]"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#15171a] border border-[#2a2d30] rounded px-3 py-2 text-xs w-full sm:w-36 focus:outline-none focus:border-[#b8894f]"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#15171a] border border-[#2a2d30] rounded px-3 py-2 text-xs w-full sm:w-44 focus:outline-none focus:border-[#b8894f]"
            >
              <option value="dueDate-asc">Due Date (earliest)</option>
              <option value="dueDate-desc">Due Date (latest)</option>
              <option value="amount-desc">Amount (high to low)</option>
              <option value="amount-asc">Amount (low to high)</option>
              <option value="client-asc">Client (A-Z)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-4 sm:p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded bg-[#15171a] animate-pulse" />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <p className="text-[#888] text-sm">No invoices yet. Create your first one above.</p>
          </div>
        ) : visibleInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <p className="text-[#888] text-sm mb-3">No invoices match your search or filter.</p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="text-[#b8894f] text-xs underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <table className="w-full text-sm hidden md:table">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-[#888] border-b border-[#1e2022]">
                  <th className="px-6 py-3 font-normal">Client</th>
                  <th className="px-6 py-3 font-normal">Amount</th>
                  <th className="px-6 py-3 font-normal">Status</th>
                  <th className="px-6 py-3 font-normal">Due Date</th>
                  <th className="px-6 py-3 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleInvoices.map((inv) => (
                  <tr
                    key={inv._id}
                    className={`border-b border-[#1e2022] last:border-0 hover:bg-[#15171a] transition-colors ${
                      isOverdue(inv) ? "bg-[#b85f4f]/5" : ""
                    } ${editingId === inv._id ? "bg-[#b8894f]/5" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div>{inv.clientName}</div>
                      <div className="text-[#666] text-xs">{inv.clientEmail}</div>
                    </td>
                    <td className="px-6 py-4">₹{Number(inv.amount).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(inv)}
                        className={`px-2 py-1 rounded text-[10px] tracking-widest uppercase ${statusStyles[inv.status] || ""} hover:opacity-80 transition-opacity`}
                        title="Click to toggle status"
                      >
                        {inv.status}
                      </button>
                      {isOverdue(inv) && (
                        <span className="ml-2 text-[10px] tracking-widest uppercase text-[#b85f4f]">
                          Overdue
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#888]">
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        <button
                          onClick={() => downloadInvoicePdf(inv)}
                          className="text-[#79947a] hover:underline text-xs"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => startEdit(inv)}
                          className="text-[#b8894f] hover:underline text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteInvoice(inv._id)}
                          className="text-[#b85f4f] hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="md:hidden divide-y divide-[#1e2022]">
              {visibleInvoices.map((inv) => (
                <div
                  key={inv._id}
                  className={`p-4 ${isOverdue(inv) ? "bg-[#b85f4f]/5" : ""} ${editingId === inv._id ? "bg-[#b8894f]/5" : ""}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{inv.clientName}</p>
                      <p className="text-[#666] text-xs">{inv.clientEmail}</p>
                    </div>
                    <button
                      onClick={() => toggleStatus(inv)}
                      className={`px-2 py-1 rounded text-[10px] tracking-widest uppercase ${statusStyles[inv.status] || ""}`}
                    >
                      {inv.status}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#888] mb-3">
                    <span>₹{Number(inv.amount).toLocaleString("en-IN")}</span>
                    <span>
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-IN") : "—"}
                      {isOverdue(inv) && (
                        <span className="ml-2 text-[#b85f4f]">Overdue</span>
                      )}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => downloadInvoicePdf(inv)}
                      className="text-[#79947a] text-xs underline underline-offset-2"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => startEdit(inv)}
                      className="text-[#b8894f] text-xs underline underline-offset-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteInvoice(inv._id)}
                      className="text-[#b85f4f] text-xs underline underline-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="border border-[#1e2022] rounded p-4 sm:p-6 bg-[#0d0f11]">
      <p className="text-[10px] tracking-widest uppercase text-[#888] mb-2 sm:mb-3">{label}</p>
      <p className="text-lg sm:text-2xl font-serif truncate" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}