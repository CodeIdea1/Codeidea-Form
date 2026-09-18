"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Lead, LeadStatus } from "@/types/lead";
import styles from "./dashboard.module.css";

const ADMIN_UID = "oBHwBrAionRUW1nHWrcLVxAr0N33";

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/dashboard/login");
      } else if (user.uid !== ADMIN_UID) {
        // Not the authorized admin
        signOut();
        router.push("/dashboard/login");
      }
    }
  }, [user, authLoading, router, signOut]);

  // Real-time listener for leads
  useEffect(() => {
    if (!user || user.uid !== ADMIN_UID || !db) return;

    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const leadsData: Lead[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lead[];
        setLeads(leadsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching leads:", err);
        setError("Failed to load leads. Please refresh the page.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/dashboard/login");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "—";
    try {
      return timestamp.toDate().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "#3b82f6";
      case "contacted": return "#8b5cf6";
      case "meeting": return "#f59e0b";
      case "proposal": return "#10b981";
      case "won": return "#22c55e";
      case "lost": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const handleStatusUpdate = async (leadId: string, newStatus: LeadStatus) => {
    setUpdatingStatus(true);
    setStatusError("");
    
    try {
      if (!db) throw new Error("DB not available");
      const leadRef = doc(db, "leads", leadId);
      await updateDoc(leadRef, { status: newStatus });
      
      // Update local state
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
      
      setUpdatingStatus(false);
    } catch (err) {
      console.error("Error updating status:", err);
      setStatusError("Failed to update status. Please try again.");
      setUpdatingStatus(false);
    }
  };

  const statusOptions: LeadStatus[] = ["new", "contacted", "meeting", "proposal", "won", "lost"];

  if (authLoading || (user && user.uid !== ADMIN_UID)) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const newLeads = leads.filter(l => l.status === "new").length;
  const totalLeads = leads.length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Lead Dashboard</h1>
            <p className={styles.subtitle}>Early Access Submissions</p>
          </div>
          <button onClick={handleSignOut} className={styles.logoutButton}>
            Sign Out
          </button>
        </div>
      </header>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalLeads}</div>
          <div className={styles.statLabel}>Total Leads</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{newLeads}</div>
          <div className={styles.statLabel}>New Leads</div>
        </div>
      </div>

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No leads yet</p>
          <p className={styles.emptyText}>
            When someone submits the early access form, their information will appear here.
          </p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>WhatsApp</th>
                <th>Interest</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className={styles.nameCell}>{lead.name}</td>
                  <td className={styles.emailCell}>{lead.email}</td>
                  <td className={styles.phoneCell}>{lead.whatsapp}</td>
                  <td>{lead.interest}</td>
                  <td className={styles.dateCell}>{formatDate(lead.createdAt)}</td>
                  <td>
                    <span
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(lead.status) }}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className={styles.viewButton}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedLead && (
        <div className={styles.modal} onClick={() => setSelectedLead(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Lead Details</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailField}>
                  <div className={styles.detailLabel}>Full Name</div>
                  <div className={styles.detailValue}>{selectedLead.name}</div>
                </div>

                <div className={styles.detailField}>
                  <div className={styles.detailLabel}>Email Address</div>
                  <div className={styles.detailValue}>{selectedLead.email}</div>
                </div>

                <div className={styles.detailField}>
                  <div className={styles.detailLabel}>WhatsApp Number</div>
                  <div className={styles.detailValue}>{selectedLead.whatsapp}</div>
                </div>

                <div className={styles.detailField}>
                  <div className={styles.detailLabel}>Area of Interest</div>
                  <div className={styles.detailValue}>{selectedLead.interest}</div>
                </div>

                <div className={styles.detailField}>
                  <div className={styles.detailLabel}>Submission Date</div>
                  <div className={styles.detailValue}>{formatDate(selectedLead.createdAt)}</div>
                </div>

                <div className={styles.detailField}>
                  <div className={styles.detailLabel}>Lead ID</div>
                  <div className={styles.detailValueMono}>{selectedLead.id}</div>
                </div>
              </div>

              <div className={styles.statusSection}>
                <div className={styles.statusHeader}>
                  <div className={styles.detailLabel}>Current Status</div>
                  <span
                    className={styles.statusBadgeLarge}
                    style={{ backgroundColor: getStatusColor(selectedLead.status) }}
                  >
                    {selectedLead.status}
                  </span>
                </div>

                <div className={styles.statusButtons}>
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedLead.id, status)}
                      disabled={updatingStatus || selectedLead.status === status}
                      className={`${styles.statusButton} ${selectedLead.status === status ? styles.statusButtonActive : ""}`}
                      style={{
                        borderColor: getStatusColor(status),
                        color: selectedLead.status === status ? "white" : getStatusColor(status),
                        backgroundColor: selectedLead.status === status ? getStatusColor(status) : "transparent",
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {statusError && (
                  <div className={styles.statusError}>{statusError}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
