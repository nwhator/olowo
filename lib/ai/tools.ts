import {
  getTreasury,
  getInvoices,
  getInvoiceById,
  getVendors,
  getVendorById,
  getContracts,
  getContractById,
  getPolicy,
  getUpcomingObligations,
  getAuditEvents,
  toggleReserveObligation,
} from '@/lib/db/storage';
import { evaluatePaymentPolicy } from '@/lib/policy/engine';
import { calculateTreasuryForecast } from '@/lib/treasury/forecast';

/**
 * Structured tool registry for OLOWO AI Financial Operator.
 * The AI uses these tools rather than hallucinating financial data.
 */
export const olowoTools = {
  getTreasury: () => {
    return getTreasury();
  },

  getInvoices: () => {
    return getInvoices().map((inv) => ({
      id: inv.id,
      number: inv.number,
      vendorName: inv.vendorName,
      amount: inv.amount,
      dueDate: inv.dueDate,
      status: inv.status,
      aiDecision: inv.aiDecision,
    }));
  },

  getInvoice: (id: string) => {
    return getInvoiceById(id);
  },

  getVendors: () => {
    return getVendors().map((v) => ({
      id: v.id,
      name: v.name,
      approved: v.approved,
      riskStatus: v.riskStatus,
      category: v.category,
    }));
  },

  getVendor: (id: string) => {
    return getVendorById(id);
  },

  getContract: (id: string) => {
    return getContractById(id);
  },

  getPolicies: () => {
    const policy = getPolicy();
    return {
      autonomousLimit: policy.autonomousLimit,
      dailyLimit: policy.dailyLimit,
      dailySpent: policy.dailySpent,
      minimumReserve: policy.minimumReserve,
      newVendorRequiresApproval: policy.newVendorRequiresApproval,
      milestoneRequired: policy.milestoneRequired,
      duplicateProtection: policy.duplicateProtection,
      flaggedCounterpartyProtection: policy.flaggedCounterpartyProtection,
      isAutonomousPaused: policy.isAutonomousPaused,
    };
  },

  evaluateInvoicePolicy: (invoiceId: string) => {
    const invoice = getInvoiceById(invoiceId);
    if (!invoice) return { error: 'Invoice not found' };
    const vendor = getVendorById(invoice.vendorId);
    if (!vendor) return { error: 'Vendor not found' };
    const contract = invoice.contractId ? getContractById(invoice.contractId) : undefined;
    const treasury = getTreasury();
    const policy = getPolicy();

    return evaluatePaymentPolicy({
      invoice,
      vendor,
      contract,
      treasury,
      policy,
    });
  },

  getUpcomingObligations: () => {
    return getUpcomingObligations();
  },

  calculateTreasuryForecast: () => {
    const treasury = getTreasury();
    const obligations = getUpcomingObligations();
    const policy = getPolicy();
    return calculateTreasuryForecast(treasury, obligations, policy.minimumReserve);
  },

  getAuditHistory: (limit: number = 10) => {
    return getAuditEvents().slice(0, limit);
  },

  reserveFunds: (obligationId: string) => {
    return toggleReserveObligation(obligationId);
  },
};
